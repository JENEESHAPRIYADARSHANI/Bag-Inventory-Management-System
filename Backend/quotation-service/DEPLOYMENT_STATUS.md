# AWS Deployment Status

## ✅ Completed Steps

### Step 1: RDS MySQL Database - CREATED ✅
- **Status**: Creating (will be available in 5-10 minutes)
- **Instance ID**: quotation-db
- **Engine**: MySQL 8.0.40
- **Class**: db.t3.micro (Free tier eligible)
- **Storage**: 20 GB
- **Username**: admin
- **Password**: QuotationDB2024!
- **Publicly Accessible**: Yes

**Get Database Endpoint:**
```bash
aws rds describe-db-instances \
    --db-instance-identifier quotation-db \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text \
    --region us-east-1
```

### Step 2: ECR Repository - CREATED ✅
- **Repository Name**: quotation-service
- **Repository URI**: 468284644046.dkr.ecr.us-east-1.amazonaws.com/quotation-service
- **Region**: us-east-1
- **Account**: 468284644046

---

## 🔄 Next Steps to Complete

### Step 3: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for Docker to start (green icon in system tray)
3. Verify: `docker ps`

### Step 4: Build and Push Docker Image

```bash
# Navigate to quotation-service folder
cd Backend/quotation-service

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 468284644046.dkr.ecr.us-east-1.amazonaws.com

# Build Docker image
docker build -t quotation-service .

# Tag image
docker tag quotation-service:latest 468284644046.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest

# Push to ECR
docker push 468284644046.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest
```

### Step 5: Store Database Credentials in Secrets Manager

```bash
# Wait for database to be available
aws rds wait db-instance-available --db-instance-identifier quotation-db --region us-east-1

# Get database endpoint
$DB_ENDPOINT = aws rds describe-db-instances --db-instance-identifier quotation-db --query 'DBInstances[0].Endpoint.Address' --output text --region us-east-1

# Create secret for database URL
aws secretsmanager create-secret `
    --name quotation-db-url `
    --description "Database URL for quotation service" `
    --secret-string "jdbc:mysql://$DB_ENDPOINT:3306/quotation_db" `
    --region us-east-1

# Create secret for database password
aws secretsmanager create-secret `
    --name quotation-db-password `
    --description "Database password" `
    --secret-string "QuotationDB2024!" `
    --region us-east-1
```

### Step 6: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name quotation-cluster --region us-east-1
```

### Step 7: Create IAM Role for ECS

```bash
# Create role
aws iam create-role `
    --role-name ecsTaskExecutionRole `
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "ecs-tasks.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }'

# Attach policies
aws iam attach-role-policy `
    --role-name ecsTaskExecutionRole `
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy `
    --role-name ecsTaskExecutionRole `
    --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite
```

### Step 8: Update and Register Task Definition

Update `ecs-task-definition.json` with your database endpoint, then:

```bash
aws ecs register-task-definition `
    --cli-input-json file://ecs-task-definition.json `
    --region us-east-1
```

### Step 9: Create ECS Service

```bash
# Get default VPC and subnet
$VPC_ID = aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region us-east-1
$SUBNET_ID = aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0].SubnetId' --output text --region us-east-1

# Create security group
$SG_ID = aws ec2 create-security-group `
    --group-name quotation-service-sg `
    --description "Security group for quotation service" `
    --vpc-id $VPC_ID `
    --region us-east-1 `
    --query 'GroupId' `
    --output text

# Allow inbound traffic on port 8080
aws ec2 authorize-security-group-ingress `
    --group-id $SG_ID `
    --protocol tcp `
    --port 8080 `
    --cidr 0.0.0.0/0 `
    --region us-east-1

# Create ECS service
aws ecs create-service `
    --cluster quotation-cluster `
    --service-name quotation-service `
    --task-definition quotation-service-task `
    --desired-count 1 `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ID],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" `
    --region us-east-1
```

### Step 10: Get Service Public IP

```bash
# Get task ARN
$TASK_ARN = aws ecs list-tasks --cluster quotation-cluster --service-name quotation-service --query 'taskArns[0]' --output text --region us-east-1

# Get network interface ID
$ENI_ID = aws ecs describe-tasks --cluster quotation-cluster --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text --region us-east-1

# Get public IP
$PUBLIC_IP = aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region us-east-1

Write-Host "Your service is available at: http://$PUBLIC_IP:8080"
```

---

## 🚀 Quick Complete Deployment

Once Docker Desktop is running, use the automated script:

```bash
cd Backend/quotation-service
./deploy-to-aws.bat
```

Or run the PowerShell commands above step by step.

---

## 📊 Current Resources

| Resource | Status | ID/Name |
|----------|--------|---------|
| RDS Database | Creating | quotation-db |
| ECR Repository | Created | quotation-service |
| ECS Cluster | Not created | - |
| ECS Service | Not created | - |

---

## 💰 Cost Estimate

**Current Resources:**
- RDS MySQL (db.t3.micro): Free tier (750 hours/month for 12 months)
- ECR: Free tier (500 MB storage)

**After completing deployment:**
- Total: $0/month (within free tier)
- After free tier: ~$30-40/month

---

## 🔍 Verify Deployment

Once complete, test your service:

```bash
# Health check
curl http://YOUR-PUBLIC-IP:8080/actuator/health

# Get products
curl http://YOUR-PUBLIC-IP:8080/api/quotations/products

# Create quotation
curl -X POST http://YOUR-PUBLIC-IP:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "test123",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@test.com",
    "phone": "1234567890",
    "items": [{"productId": 1, "quantity": 5}]
  }'
```

---

## 📝 Important Information

**Database Credentials:**
- Endpoint: (will be available after database is ready)
- Username: admin
- Password: QuotationDB2024!
- Database: quotation_db

**AWS Account:**
- Account ID: 468284644046
- Region: us-east-1

**ECR Repository:**
- URI: 468284644046.dkr.ecr.us-east-1.amazonaws.com/quotation-service

---

## 🆘 Troubleshooting

### Database not ready?
```bash
# Check status
aws rds describe-db-instances --db-instance-identifier quotation-db --query 'DBInstances[0].DBInstanceStatus' --output text
```

### Docker not running?
1. Start Docker Desktop
2. Wait for green icon
3. Run: `docker ps`

### Need to cleanup?
```bash
# Delete service
aws ecs delete-service --cluster quotation-cluster --service quotation-service --force

# Delete cluster
aws ecs delete-cluster --cluster quotation-cluster

# Delete database
aws rds delete-db-instance --db-instance-identifier quotation-db --skip-final-snapshot

# Delete ECR repository
aws ecr delete-repository --repository-name quotation-service --force
```

---

**Next Action:** Start Docker Desktop and continue with Step 4!
