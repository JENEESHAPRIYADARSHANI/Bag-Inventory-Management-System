# AWS Deployment Guide - Quotation Service

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Services Overview](#aws-services-overview)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Configuration](#configuration)
5. [Monitoring & Scaling](#monitoring--scaling)
6. [Cost Estimation](#cost-estimation)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Tools
- [ ] AWS Account (Free tier available for 12 months)
- [ ] AWS CLI installed and configured
- [ ] Docker installed
- [ ] Git installed

### Install AWS CLI

**Windows:**
```bash
# Download from: https://aws.amazon.com/cli/
# Or use chocolatey
choco install awscli
```

**Linux/Mac:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configure AWS CLI
```bash
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

---

## 2. AWS Services Overview

### Services We'll Use

```
┌─────────────────────────────────────────┐
│              AWS Cloud                  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Application Load Balancer      │  │
│  │   (Public Access)                │  │
│  └────────────┬─────────────────────┘  │
│               │                         │
│               ↓                         │
│  ┌──────────────────────────────────┐  │
│  │   ECS Fargate Cluster            │  │
│  │   ┌────────────────────────┐     │  │
│  │   │ Quotation Service      │     │  │
│  │   │ Container (Port 8080)  │     │  │
│  │   └───────────┬────────────┘     │  │
│  └───────────────┼──────────────────┘  │
│                  │                      │
│                  ↓                      │
│  ┌──────────────────────────────────┐  │
│  │   RDS MySQL Database             │  │
│  │   (Private Subnet)               │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   ECR (Container Registry)       │  │
│  │   Stores Docker Images           │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Service Descriptions

1. **Amazon ECR** - Stores your Docker images
2. **Amazon ECS Fargate** - Runs your containers (serverless)
3. **Amazon RDS** - Managed MySQL database
4. **Application Load Balancer** - Distributes traffic
5. **CloudWatch** - Monitoring and logs
6. **Secrets Manager** - Stores database credentials

---

## 3. Step-by-Step Deployment

### Step 1: Create RDS MySQL Database

```bash
# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier quotation-db \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0.35 \
    --master-username admin \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name default \
    --backup-retention-period 7 \
    --publicly-accessible \
    --region us-east-1

# Wait for database to be available (5-10 minutes)
aws rds wait db-instance-available --db-instance-identifier quotation-db

# Get database endpoint
aws rds describe-db-instances \
    --db-instance-identifier quotation-db \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text
```

**Note the database endpoint** - you'll need it later!

---

### Step 2: Create ECR Repository

```bash
# Create repository for your Docker image
aws ecr create-repository \
    --repository-name quotation-service \
    --region us-east-1

# Get repository URI
aws ecr describe-repositories \
    --repository-names quotation-service \
    --query 'repositories[0].repositoryUri' \
    --output text
```

---

### Step 3: Build and Push Docker Image

```bash
# Get your AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="us-east-1"
ECR_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/quotation-service"

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin $ECR_REPO

# Build Docker image
cd Backend/quotation-service
docker build -t quotation-service .

# Tag image
docker tag quotation-service:latest $ECR_REPO:latest

# Push to ECR
docker push $ECR_REPO:latest

echo "Image pushed to: $ECR_REPO:latest"
```

---

### Step 4: Store Database Credentials in Secrets Manager

```bash
# Create secret for database password
aws secretsmanager create-secret \
    --name quotation-db-password \
    --description "Database password for quotation service" \
    --secret-string "YourSecurePassword123!" \
    --region us-east-1

# Create secret for database URL
DB_ENDPOINT="your-db-endpoint.rds.amazonaws.com"
aws secretsmanager create-secret \
    --name quotation-db-url \
    --description "Database URL for quotation service" \
    --secret-string "jdbc:mysql://$DB_ENDPOINT:3306/quotation_db" \
    --region us-east-1
```

---

### Step 5: Create ECS Cluster

```bash
# Create ECS cluster
aws ecs create-cluster \
    --cluster-name quotation-cluster \
    --region us-east-1

# Verify cluster creation
aws ecs describe-clusters \
    --clusters quotation-cluster \
    --region us-east-1
```

---

### Step 6: Create Task Execution Role

```bash
# Create IAM role for ECS task execution
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "ecs-tasks.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }'

# Attach required policies
aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

---

### Step 7: Register Task Definition

Update `ecs-task-definition.json` with your values, then:

```bash
# Register task definition
aws ecs register-task-definition \
    --cli-input-json file://ecs-task-definition.json \
    --region us-east-1
```

---

### Step 8: Create Application Load Balancer

```bash
# Create security group for ALB
aws ec2 create-security-group \
    --group-name quotation-alb-sg \
    --description "Security group for quotation service ALB" \
    --vpc-id vpc-xxxxxxxxx

# Allow HTTP traffic
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

# Create load balancer
aws elbv2 create-load-balancer \
    --name quotation-alb \
    --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
    --security-groups sg-xxxxxxxxx \
    --scheme internet-facing \
    --type application

# Create target group
aws elbv2 create-target-group \
    --name quotation-targets \
    --protocol HTTP \
    --port 8080 \
    --vpc-id vpc-xxxxxxxxx \
    --target-type ip \
    --health-check-path /actuator/health

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:... \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

---

### Step 9: Create ECS Service

```bash
# Create ECS service
aws ecs create-service \
    --cluster quotation-cluster \
    --service-name quotation-service \
    --task-definition quotation-service-task \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={
        subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],
        securityGroups=[sg-xxxxxxxxx],
        assignPublicIp=ENABLED
    }" \
    --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=quotation-service,containerPort=8080" \
    --region us-east-1
```

---

### Step 10: Verify Deployment

```bash
# Check service status
aws ecs describe-services \
    --cluster quotation-cluster \
    --services quotation-service \
    --region us-east-1

# Get load balancer DNS
aws elbv2 describe-load-balancers \
    --names quotation-alb \
    --query 'LoadBalancers[0].DNSName' \
    --output text

# Test health endpoint
curl http://YOUR-ALB-DNS/actuator/health
```

---

## 4. Configuration

### Environment Variables

Set these in your task definition:

```json
{
  "environment": [
    {
      "name": "SPRING_PROFILES_ACTIVE",
      "value": "cloud"
    },
    {
      "name": "DB_NAME",
      "value": "quotation_db"
    },
    {
      "name": "DB_USERNAME",
      "value": "admin"
    }
  ],
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:quotation-db-url"
    },
    {
      "name": "DB_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:quotation-db-password"
    }
  ]
}
```

---

## 5. Monitoring & Scaling

### View Logs

```bash
# View CloudWatch logs
aws logs tail /ecs/quotation-service --follow
```

### Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/quotation-cluster/quotation-service \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 1 \
    --max-capacity 5

# Create scaling policy
aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --resource-id service/quotation-cluster/quotation-service \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-name cpu-scaling \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration '{
      "TargetValue": 70.0,
      "PredefinedMetricSpecification": {
        "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
      }
    }'
```

---

## 6. Cost Estimation

### Free Tier (First 12 Months)
- **RDS MySQL**: 750 hours/month (db.t3.micro)
- **ECS Fargate**: 50 GB storage
- **ECR**: 500 MB storage
- **ALB**: 750 hours/month

### After Free Tier (~$30-50/month)
- **RDS MySQL (db.t3.micro)**: $15-20/month
- **ECS Fargate (0.25 vCPU, 0.5 GB)**: $10-15/month
- **ALB**: $16/month
- **Data Transfer**: $5-10/month

### Cost Optimization Tips
1. Use Fargate Spot for non-production
2. Stop RDS instance when not in use
3. Use reserved instances for production
4. Enable auto-scaling to match demand

---

## 7. Troubleshooting

### Service Won't Start

**Check task logs:**
```bash
aws ecs describe-tasks \
    --cluster quotation-cluster \
    --tasks TASK_ID \
    --query 'tasks[0].containers[0].reason'
```

**Common issues:**
- Database connection failed → Check security groups
- Image pull failed → Verify ECR permissions
- Health check failed → Check /actuator/health endpoint

### Database Connection Issues

**Test connection:**
```bash
mysql -h YOUR-DB-ENDPOINT -u admin -p
```

**Check security group:**
- Ensure ECS security group can access RDS security group on port 3306

### High Costs

**Check resource usage:**
```bash
# View ECS service metrics
aws cloudwatch get-metric-statistics \
    --namespace AWS/ECS \
    --metric-name CPUUtilization \
    --dimensions Name=ServiceName,Value=quotation-service \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-02T00:00:00Z \
    --period 3600 \
    --statistics Average
```

---

## 8. Cleanup (When Done)

```bash
# Delete ECS service
aws ecs delete-service --cluster quotation-cluster --service quotation-service --force

# Delete ECS cluster
aws ecs delete-cluster --cluster quotation-cluster

# Delete RDS instance
aws rds delete-db-instance --db-instance-identifier quotation-db --skip-final-snapshot

# Delete load balancer
aws elbv2 delete-load-balancer --load-balancer-arn YOUR-ALB-ARN

# Delete ECR repository
aws ecr delete-repository --repository-name quotation-service --force
```

---

## 9. Production Checklist

- [ ] Enable HTTPS with ACM certificate
- [ ] Configure custom domain with Route 53
- [ ] Enable CloudWatch alarms
- [ ] Setup backup strategy for RDS
- [ ] Enable RDS encryption
- [ ] Configure VPC with private subnets
- [ ] Enable AWS WAF for security
- [ ] Setup CI/CD with CodePipeline
- [ ] Enable container insights
- [ ] Configure log retention

---

## 10. Next Steps

1. **Test the deployment** - Access your ALB DNS
2. **Setup monitoring** - Configure CloudWatch alarms
3. **Enable HTTPS** - Request ACM certificate
4. **Configure domain** - Point your domain to ALB
5. **Setup CI/CD** - Automate deployments

---

**Your quotation service is now running on AWS!** ☁️

**Access your service:**
```
http://YOUR-ALB-DNS/actuator/health
http://YOUR-ALB-DNS/api/quotations/products
```
