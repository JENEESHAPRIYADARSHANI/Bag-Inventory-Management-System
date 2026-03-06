# 🚀 AWS Configuration Guide for Quotation Management Service

## Overview

This guide provides complete AWS setup for deploying the Quotation Management Service using:
- **AWS RDS** (MySQL Database)
- **AWS ECS Fargate** (Container Orchestration)
- **AWS Secrets Manager** (Secure Credential Storage)
- **AWS CloudWatch** (Logging and Monitoring)
- **AWS ECR** (Container Registry)
- **AWS Application Load Balancer** (Traffic Distribution)

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Docker** installed for container builds
4. **Maven** for Java application builds
5. **Node.js** for frontend builds

## 🗄️ Step 1: RDS Database Setup

### 1.1 Create RDS MySQL Instance

```bash
# Create RDS subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name quotation-db-subnet-group \
    --db-subnet-group-description "Subnet group for quotation database" \
    --subnet-ids subnet-12345678 subnet-87654321 \
    --region us-east-1

# Create RDS MySQL instance
aws rds create-db-instance \
    --db-instance-identifier quotation-db \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0.35 \
    --master-username admin \
    --master-user-password "YourSecurePassword123!" \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids sg-12345678 \
    --db-subnet-group-name quotation-db-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --region us-east-1
```

### 1.2 Create Database Schema

```sql
-- Connect to RDS instance and run:
CREATE DATABASE quotation_db;
USE quotation_db;

-- Run the schema from Backend/quotation-service/database/schema.sql
```

## 🔐 Step 2: Secrets Manager Setup

### 2.1 Store Database Credentials

```bash
# Store database URL
aws secretsmanager create-secret \
    --name "quotation-db-url" \
    --description "Database URL for quotation service" \
    --secret-string "jdbc:mysql://quotation-db.region.rds.amazonaws.com:3306/quotation_db?useSSL=true&serverTimezone=UTC" \
    --region us-east-1

# Store database password
aws secretsmanager create-secret \
    --name "quotation-db-password" \
    --description "Database password for quotation service" \
    --secret-string "YourSecurePassword123!" \
    --region us-east-1

# Store complete database configuration
aws secretsmanager create-secret \
    --name "quotation-service-config" \
    --description "Complete configuration for quotation service" \
    --secret-string '{
        "spring.datasource.url": "jdbc:mysql://quotation-db.region.rds.amazonaws.com:3306/quotation_db?useSSL=true&serverTimezone=UTC",
        "spring.datasource.username": "admin",
        "spring.datasource.password": "YourSecurePassword123!",
        "product.service.url": "http://product-service-alb.region.elb.amazonaws.com/api/products",
        "order.service.url": "http://order-service-alb.region.elb.amazonaws.com/api/orders"
    }' \
    --region us-east-1
```

## 📦 Step 3: ECR Repository Setup

### 3.1 Create ECR Repository

```bash
# Create repository for quotation service
aws ecr create-repository \
    --repository-name quotation-service \
    --region us-east-1

# Get login token and login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
```

### 3.2 Build and Push Docker Image

```bash
# Navigate to backend directory
cd Backend/quotation-service

# Build the application
./mvnw clean package -DskipTests

# Build Docker image
docker build -t quotation-service .

# Tag for ECR
docker tag quotation-service:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest
```

## 🏗️ Step 4: ECS Cluster Setup

### 4.1 Create ECS Cluster

```bash
# Create ECS cluster
aws ecs create-cluster \
    --cluster-name quotation-service-cluster \
    --capacity-providers FARGATE \
    --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
    --region us-east-1
```

### 4.2 Create Task Definition

```bash
# Register task definition
aws ecs register-task-definition \
    --cli-input-json file://ecs-task-definition.json \
    --region us-east-1
```

### 4.3 Create ECS Service

```bash
# Create ECS service
aws ecs create-service \
    --cluster quotation-service-cluster \
    --service-name quotation-service \
    --task-definition quotation-service-task:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
    --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/quotation-tg/1234567890123456,containerName=quotation-service,containerPort=8080 \
    --region us-east-1
```

## 🔄 Step 5: Application Load Balancer

### 5.1 Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
    --name quotation-service-alb \
    --subnets subnet-12345678 subnet-87654321 \
    --security-groups sg-12345678 \
    --region us-east-1

# Create target group
aws elbv2 create-target-group \
    --name quotation-tg \
    --protocol HTTP \
    --port 8080 \
    --vpc-id vpc-12345678 \
    --target-type ip \
    --health-check-path /api/quotations/products \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --region us-east-1

# Create listener
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/quotation-service-alb/1234567890123456 \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/quotation-tg/1234567890123456 \
    --region us-east-1
```

## 📊 Step 6: CloudWatch Setup

### 6.1 Create Log Group

```bash
# Create CloudWatch log group
aws logs create-log-group \
    --log-group-name /ecs/quotation-service \
    --region us-east-1

# Set retention policy
aws logs put-retention-policy \
    --log-group-name /ecs/quotation-service \
    --retention-in-days 30 \
    --region us-east-1
```

### 6.2 Create CloudWatch Alarms

```bash
# CPU utilization alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "quotation-service-high-cpu" \
    --alarm-description "Alarm when CPU exceeds 70%" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 70 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=ServiceName,Value=quotation-service Name=ClusterName,Value=quotation-service-cluster \
    --evaluation-periods 2 \
    --region us-east-1

# Memory utilization alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "quotation-service-high-memory" \
    --alarm-description "Alarm when Memory exceeds 80%" \
    --metric-name MemoryUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=ServiceName,Value=quotation-service Name=ClusterName,Value=quotation-service-cluster \
    --evaluation-periods 2 \
    --region us-east-1
```

## 🔧 Step 7: IAM Roles and Policies

### 7.1 Create ECS Task Execution Role

```bash
# Create trust policy
cat > ecs-task-execution-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document file://ecs-task-execution-trust-policy.json

# Attach AWS managed policy
aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Create custom policy for Secrets Manager
cat > secrets-manager-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:123456789012:secret:quotation-*"
      ]
    }
  ]
}
EOF

# Create and attach custom policy
aws iam create-policy \
    --policy-name SecretsManagerAccessPolicy \
    --policy-document file://secrets-manager-policy.json

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::123456789012:policy/SecretsManagerAccessPolicy
```

## 🌐 Step 8: Security Groups

### 8.1 Create Security Groups

```bash
# Create security group for ALB
aws ec2 create-security-group \
    --group-name quotation-alb-sg \
    --description "Security group for quotation service ALB" \
    --vpc-id vpc-12345678 \
    --region us-east-1

# Allow HTTP traffic to ALB
aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region us-east-1

# Allow HTTPS traffic to ALB
aws ec2 authorize-security-group-ingress \
    --group-id sg-12345678 \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region us-east-1

# Create security group for ECS tasks
aws ec2 create-security-group \
    --group-name quotation-ecs-sg \
    --description "Security group for quotation service ECS tasks" \
    --vpc-id vpc-12345678 \
    --region us-east-1

# Allow traffic from ALB to ECS tasks
aws ec2 authorize-security-group-ingress \
    --group-id sg-87654321 \
    --protocol tcp \
    --port 8080 \
    --source-group sg-12345678 \
    --region us-east-1

# Create security group for RDS
aws ec2 create-security-group \
    --group-name quotation-rds-sg \
    --description "Security group for quotation service RDS" \
    --vpc-id vpc-12345678 \
    --region us-east-1

# Allow MySQL traffic from ECS tasks to RDS
aws ec2 authorize-security-group-ingress \
    --group-id sg-11111111 \
    --protocol tcp \
    --port 3306 \
    --source-group sg-87654321 \
    --region us-east-1
```

## 🚀 Step 9: Auto Scaling

### 9.1 Create Auto Scaling Target

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/quotation-service-cluster/quotation-service \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 1 \
    --max-capacity 10 \
    --region us-east-1

# Create scaling policy
aws application-autoscaling put-scaling-policy \
    --policy-name quotation-service-scaling-policy \
    --service-namespace ecs \
    --resource-id service/quotation-service-cluster/quotation-service \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration '{
        "TargetValue": 70.0,
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
        },
        "ScaleOutCooldown": 300,
        "ScaleInCooldown": 300
    }' \
    --region us-east-1
```

## 📝 Step 10: Environment Configuration

### 10.1 Update Application Properties

Create `application-cloud.properties`:

```properties
spring.application.name=quotation-service

# AWS RDS Configuration (using Secrets Manager)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Server Configuration
server.port=8080
management.endpoints.web.exposure.include=health,info,metrics

# Microservice URLs
product.service.url=${PRODUCT_SERVICE_URL:http://localhost:8081/api/products}
order.service.url=${ORDER_SERVICE_URL:http://localhost:8082/api/orders}

# Logging
logging.level.com.example.quotation_service=INFO
logging.level.org.springframework.web=INFO
```

## 🔍 Step 11: Monitoring and Troubleshooting

### 11.1 Useful AWS CLI Commands

```bash
# Check ECS service status
aws ecs describe-services \
    --cluster quotation-service-cluster \
    --services quotation-service \
    --region us-east-1

# View ECS task logs
aws logs get-log-events \
    --log-group-name /ecs/quotation-service \
    --log-stream-name ecs/quotation-service/task-id \
    --region us-east-1

# Check RDS instance status
aws rds describe-db-instances \
    --db-instance-identifier quotation-db \
    --region us-east-1

# View ALB target health
aws elbv2 describe-target-health \
    --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/quotation-tg/1234567890123456 \
    --region us-east-1
```

### 11.2 Health Check Endpoints

```bash
# Test application health
curl http://your-alb-dns-name/api/quotations/products

# Test specific endpoints
curl http://your-alb-dns-name/api/quotations
curl http://your-alb-dns-name/actuator/health
```

## 💰 Cost Optimization

### 11.1 Recommended Instance Types

- **RDS**: `db.t3.micro` (Free tier eligible)
- **ECS**: Fargate with 0.25 vCPU, 512 MB memory
- **ALB**: Standard Application Load Balancer

### 11.2 Cost Monitoring

```bash
# Set up billing alerts
aws budgets create-budget \
    --account-id 123456789012 \
    --budget '{
        "BudgetName": "quotation-service-budget",
        "BudgetLimit": {
            "Amount": "50",
            "Unit": "USD"
        },
        "TimeUnit": "MONTHLY",
        "BudgetType": "COST"
    }' \
    --region us-east-1
```

## 🔒 Security Best Practices

1. **Use Secrets Manager** for all sensitive data
2. **Enable encryption** at rest and in transit
3. **Implement least privilege** IAM policies
4. **Use VPC endpoints** for AWS services
5. **Enable CloudTrail** for audit logging
6. **Regular security updates** for container images
7. **Network segmentation** with security groups

## 📋 Deployment Checklist

- [ ] RDS instance created and configured
- [ ] Secrets Manager secrets created
- [ ] ECR repository created
- [ ] Docker image built and pushed
- [ ] ECS cluster and service created
- [ ] Application Load Balancer configured
- [ ] Security groups properly configured
- [ ] CloudWatch logging enabled
- [ ] Auto scaling configured
- [ ] Health checks passing
- [ ] Domain name configured (optional)
- [ ] SSL certificate installed (optional)

---

## 🎯 Next Steps

1. **Deploy the service** using the configurations above
2. **Test all endpoints** to ensure functionality
3. **Monitor performance** using CloudWatch
4. **Set up CI/CD pipeline** for automated deployments
5. **Configure domain and SSL** for production use

Your Quotation Management Service is now ready for AWS deployment! 🚀