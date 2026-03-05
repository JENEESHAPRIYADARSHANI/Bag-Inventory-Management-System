#!/bin/bash

# Order Management Service - AWS Deployment Script
# This script deploys the Order Management Service to AWS ECS Fargate

set -e  # Exit on error

echo "=========================================="
echo "Order Management Service - AWS Deployment"
echo "=========================================="
echo ""

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="468284644046"
ECR_REPO_NAME="order-management-service"
ECS_CLUSTER="quotation-cluster"
SERVICE_NAME="order-management-service"
TASK_FAMILY="order-service-task"

echo "Step 1: Building Maven application..."
mvn clean package -DskipTests
echo "✅ Maven build complete"
echo ""

echo "Step 2: Building Docker image..."
docker build -t $ECR_REPO_NAME .
echo "✅ Docker image built"
echo ""

echo "Step 3: Creating ECR repository (if not exists)..."
aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION
echo "✅ ECR repository ready"
echo ""

echo "Step 4: Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "✅ Logged into ECR"
echo ""

echo "Step 5: Tagging Docker image..."
docker tag $ECR_REPO_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest
echo "✅ Image tagged"
echo ""

echo "Step 6: Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest
echo "✅ Image pushed to ECR"
echo ""

echo "Step 7: Registering task definition..."
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json --region $AWS_REGION
echo "✅ Task definition registered"
echo ""

echo "Step 8: Checking if service exists..."
SERVICE_EXISTS=$(aws ecs describe-services --cluster $ECS_CLUSTER --services $SERVICE_NAME --region $AWS_REGION --query 'services[0].status' --output text 2>/dev/null || echo "NONE")

if [ "$SERVICE_EXISTS" = "ACTIVE" ]; then
    echo "Service exists. Updating with force new deployment..."
    aws ecs update-service \
        --cluster $ECS_CLUSTER \
        --service $SERVICE_NAME \
        --task-definition $TASK_FAMILY \
        --force-new-deployment \
        --region $AWS_REGION
    echo "✅ Service updated"
else
    echo "Service does not exist. Please create it manually using the guide."
    echo "See DEPLOY_ORDER_SERVICE_TO_AWS.md for instructions."
fi
echo ""

echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for service to start"
echo "2. Get the service IP address"
echo "3. Update quotation-service with ORDER_SERVICE_URL"
echo ""
echo "To get the IP address, run:"
echo "  ./get-service-ip.sh"
echo ""
