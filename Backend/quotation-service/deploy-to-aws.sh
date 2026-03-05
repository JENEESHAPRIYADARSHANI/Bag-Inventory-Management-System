#!/bin/bash

# AWS Deployment Script for Quotation Service
# This script automates the deployment of quotation-service to AWS

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
CLUSTER_NAME="quotation-cluster"
SERVICE_NAME="quotation-service"
REPOSITORY_NAME="quotation-service"
DB_INSTANCE_ID="quotation-db"
TASK_FAMILY="quotation-service-task"

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  AWS Deployment - Quotation Service${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS Account ID: $AWS_ACCOUNT_ID${NC}"
echo ""

# Step 1: Create RDS Database
echo -e "${YELLOW}Step 1: Creating RDS MySQL Database...${NC}"
read -p "Create new RDS instance? (y/n): " CREATE_RDS

if [ "$CREATE_RDS" = "y" ]; then
    read -sp "Enter database password: " DB_PASSWORD
    echo ""
    
    aws rds create-db-instance \
        --db-instance-identifier $DB_INSTANCE_ID \
        --db-instance-class db.t3.micro \
        --engine mysql \
        --engine-version 8.0.35 \
        --master-username admin \
        --master-user-password "$DB_PASSWORD" \
        --allocated-storage 20 \
        --backup-retention-period 7 \
        --publicly-accessible \
        --region $AWS_REGION \
        2>/dev/null || echo "Database may already exist"
    
    echo -e "${GREEN}✓ Database creation initiated${NC}"
    echo -e "${YELLOW}Waiting for database to be available (this may take 5-10 minutes)...${NC}"
    
    aws rds wait db-instance-available \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $AWS_REGION
    
    DB_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_INSTANCE_ID \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text \
        --region $AWS_REGION)
    
    echo -e "${GREEN}✓ Database available at: $DB_ENDPOINT${NC}"
else
    read -p "Enter existing database endpoint: " DB_ENDPOINT
    read -sp "Enter database password: " DB_PASSWORD
    echo ""
fi
echo ""

# Step 2: Create ECR Repository
echo -e "${YELLOW}Step 2: Creating ECR Repository...${NC}"
aws ecr create-repository \
    --repository-name $REPOSITORY_NAME \
    --region $AWS_REGION \
    2>/dev/null || echo "Repository may already exist"

ECR_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPOSITORY_NAME"
echo -e "${GREEN}✓ ECR Repository: $ECR_REPO${NC}"
echo ""

# Step 3: Build and Push Docker Image
echo -e "${YELLOW}Step 3: Building and pushing Docker image...${NC}"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin $ECR_REPO

# Build image
echo "Building Docker image..."
docker build -t $REPOSITORY_NAME .

# Tag image
docker tag $REPOSITORY_NAME:latest $ECR_REPO:latest

# Push image
echo "Pushing image to ECR..."
docker push $ECR_REPO:latest

echo -e "${GREEN}✓ Image pushed successfully${NC}"
echo ""

# Step 4: Store Secrets
echo -e "${YELLOW}Step 4: Storing database credentials in Secrets Manager...${NC}"

# Create or update database URL secret
aws secretsmanager create-secret \
    --name quotation-db-url \
    --description "Database URL for quotation service" \
    --secret-string "jdbc:mysql://$DB_ENDPOINT:3306/quotation_db" \
    --region $AWS_REGION \
    2>/dev/null || \
aws secretsmanager update-secret \
    --secret-id quotation-db-url \
    --secret-string "jdbc:mysql://$DB_ENDPOINT:3306/quotation_db" \
    --region $AWS_REGION

# Create or update database password secret
aws secretsmanager create-secret \
    --name quotation-db-password \
    --description "Database password for quotation service" \
    --secret-string "$DB_PASSWORD" \
    --region $AWS_REGION \
    2>/dev/null || \
aws secretsmanager update-secret \
    --secret-id quotation-db-password \
    --secret-string "$DB_PASSWORD" \
    --region $AWS_REGION

echo -e "${GREEN}✓ Secrets stored${NC}"
echo ""

# Step 5: Create ECS Cluster
echo -e "${YELLOW}Step 5: Creating ECS Cluster...${NC}"
aws ecs create-cluster \
    --cluster-name $CLUSTER_NAME \
    --region $AWS_REGION \
    2>/dev/null || echo "Cluster may already exist"

echo -e "${GREEN}✓ ECS Cluster created${NC}"
echo ""

# Step 6: Create Task Execution Role
echo -e "${YELLOW}Step 6: Creating IAM role...${NC}"
aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "ecs-tasks.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }' \
    2>/dev/null || echo "Role may already exist"

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
    2>/dev/null || true

aws iam attach-role-policy \
    --role-name ecsTaskExecutionRole \
    --policy-arn arn:aws:iam::aws:policy/SecretsManagerReadWrite \
    2>/dev/null || true

echo -e "${GREEN}✓ IAM role configured${NC}"
echo ""

# Step 7: Update and Register Task Definition
echo -e "${YELLOW}Step 7: Registering task definition...${NC}"

# Create task definition with current values
cat > /tmp/task-definition.json << EOF
{
  "family": "$TASK_FAMILY",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "$SERVICE_NAME",
      "image": "$ECR_REPO:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "cloud"
        },
        {
          "name": "DB_USERNAME",
          "value": "admin"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:$AWS_REGION:$AWS_ACCOUNT_ID:secret:quotation-db-url"
        },
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:$AWS_REGION:$AWS_ACCOUNT_ID:secret:quotation-db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$SERVICE_NAME",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
EOF

aws ecs register-task-definition \
    --cli-input-json file:///tmp/task-definition.json \
    --region $AWS_REGION

echo -e "${GREEN}✓ Task definition registered${NC}"
echo ""

# Step 8: Create or Update Service
echo -e "${YELLOW}Step 8: Creating/Updating ECS Service...${NC}"

# Get default VPC and subnets
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region $AWS_REGION)
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region $AWS_REGION | tr '\t' ',')

# Create security group
SG_ID=$(aws ec2 create-security-group \
    --group-name quotation-service-sg \
    --description "Security group for quotation service" \
    --vpc-id $VPC_ID \
    --region $AWS_REGION \
    --query 'GroupId' \
    --output text 2>/dev/null) || \
SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=quotation-service-sg" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $AWS_REGION)

# Allow inbound traffic
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 8080 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION \
    2>/dev/null || true

# Create or update service
aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region $AWS_REGION \
    2>/dev/null || \
aws ecs update-service \
    --cluster $CLUSTER_NAME \
    --service $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --force-new-deployment \
    --region $AWS_REGION

echo -e "${GREEN}✓ ECS Service deployed${NC}"
echo ""

# Step 9: Get Service Information
echo -e "${YELLOW}Step 9: Getting service information...${NC}"
sleep 10

TASK_ARN=$(aws ecs list-tasks \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --query 'taskArns[0]' \
    --output text \
    --region $AWS_REGION)

if [ "$TASK_ARN" != "None" ] && [ -n "$TASK_ARN" ]; then
    ENI_ID=$(aws ecs describe-tasks \
        --cluster $CLUSTER_NAME \
        --tasks $TASK_ARN \
        --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
        --output text \
        --region $AWS_REGION)
    
    PUBLIC_IP=$(aws ec2 describe-network-interfaces \
        --network-interface-ids $ENI_ID \
        --query 'NetworkInterfaces[0].Association.PublicIp' \
        --output text \
        --region $AWS_REGION)
    
    echo -e "${GREEN}✓ Service is running${NC}"
    echo ""
fi

# Final Summary
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "${YELLOW}Service Information:${NC}"
echo "  Cluster: $CLUSTER_NAME"
echo "  Service: $SERVICE_NAME"
echo "  Region: $AWS_REGION"
echo ""

if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "None" ]; then
    echo -e "${YELLOW}Access your service:${NC}"
    echo "  Health Check: http://$PUBLIC_IP:8080/actuator/health"
    echo "  API: http://$PUBLIC_IP:8080/api/quotations/products"
    echo ""
fi

echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View logs:"
echo "    aws logs tail /ecs/$SERVICE_NAME --follow"
echo ""
echo "  Check service status:"
echo "    aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME"
echo ""
echo "  Update service:"
echo "    ./deploy-to-aws.sh"
echo ""
echo -e "${YELLOW}Note:${NC} It may take 2-3 minutes for the service to be fully available."
echo ""
