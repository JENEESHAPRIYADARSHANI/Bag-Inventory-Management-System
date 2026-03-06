#!/bin/bash

# AWS Deployment Script for Quotation Management Service
# This script automates the deployment process to AWS

set -e  # Exit on any error

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="123456789012"  # Replace with your AWS account ID
ECR_REPOSITORY="quotation-service"
ECS_CLUSTER="quotation-service-cluster"
ECS_SERVICE="quotation-service"
TASK_DEFINITION="quotation-service-task"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if AWS CLI is installed and configured
check_aws_cli() {
    print_status "Checking AWS CLI configuration..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "AWS CLI is configured"
}

# Function to check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is running"
}

# Function to build the application
build_application() {
    print_status "Building Spring Boot application..."
    
    cd Backend/quotation-service
    
    # Clean and build
    ./mvnw clean package -DskipTests
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully"
    else
        print_error "Application build failed"
        exit 1
    fi
    
    cd ../..
}

# Function to login to ECR
ecr_login() {
    print_status "Logging in to Amazon ECR..."
    
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to ECR"
    else
        print_error "Failed to login to ECR"
        exit 1
    fi
}

# Function to build and push Docker image
build_and_push_image() {
    print_status "Building Docker image..."
    
    cd Backend/quotation-service
    
    # Build Docker image
    docker build -t $ECR_REPOSITORY .
    
    if [ $? -ne 0 ]; then
        print_error "Docker build failed"
        exit 1
    fi
    
    # Tag image for ECR
    docker tag $ECR_REPOSITORY:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
    
    print_status "Pushing image to ECR..."
    
    # Push to ECR
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest
    
    if [ $? -eq 0 ]; then
        print_success "Image pushed to ECR successfully"
    else
        print_error "Failed to push image to ECR"
        exit 1
    fi
    
    cd ../..
}

# Function to update ECS service
update_ecs_service() {
    print_status "Updating ECS service..."
    
    # Update the task definition with new image
    TASK_DEFINITION_JSON=$(cat Backend/quotation-service/ecs-task-definition.json | \
        sed "s|123456789012|$AWS_ACCOUNT_ID|g" | \
        sed "s|us-east-1|$AWS_REGION|g")
    
    # Register new task definition
    NEW_TASK_DEFINITION=$(echo "$TASK_DEFINITION_JSON" | aws ecs register-task-definition --cli-input-json file:///dev/stdin --region $AWS_REGION)
    
    if [ $? -ne 0 ]; then
        print_error "Failed to register new task definition"
        exit 1
    fi
    
    # Extract the new task definition ARN
    NEW_TASK_DEF_ARN=$(echo $NEW_TASK_DEFINITION | jq -r '.taskDefinition.taskDefinitionArn')
    
    print_status "New task definition registered: $NEW_TASK_DEF_ARN"
    
    # Update the service
    aws ecs update-service \
        --cluster $ECS_CLUSTER \
        --service $ECS_SERVICE \
        --task-definition $NEW_TASK_DEF_ARN \
        --region $AWS_REGION
    
    if [ $? -eq 0 ]; then
        print_success "ECS service update initiated"
    else
        print_error "Failed to update ECS service"
        exit 1
    fi
}

# Function to wait for deployment to complete
wait_for_deployment() {
    print_status "Waiting for deployment to complete..."
    
    aws ecs wait services-stable \
        --cluster $ECS_CLUSTER \
        --services $ECS_SERVICE \
        --region $AWS_REGION
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully"
    else
        print_error "Deployment failed or timed out"
        exit 1
    fi
}

# Function to get service status
get_service_status() {
    print_status "Getting service status..."
    
    SERVICE_INFO=$(aws ecs describe-services \
        --cluster $ECS_CLUSTER \
        --services $ECS_SERVICE \
        --region $AWS_REGION)
    
    RUNNING_COUNT=$(echo $SERVICE_INFO | jq -r '.services[0].runningCount')
    DESIRED_COUNT=$(echo $SERVICE_INFO | jq -r '.services[0].desiredCount')
    
    print_status "Service Status: $RUNNING_COUNT/$DESIRED_COUNT tasks running"
    
    # Get load balancer DNS name
    ALB_INFO=$(aws elbv2 describe-load-balancers \
        --names quotation-service-alb \
        --region $AWS_REGION 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        ALB_DNS=$(echo $ALB_INFO | jq -r '.LoadBalancers[0].DNSName')
        print_success "Application URL: http://$ALB_DNS"
        print_status "Health Check: http://$ALB_DNS/api/quotations/products"
    fi
}

# Function to run health check
health_check() {
    print_status "Running health check..."
    
    ALB_INFO=$(aws elbv2 describe-load-balancers \
        --names quotation-service-alb \
        --region $AWS_REGION 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        ALB_DNS=$(echo $ALB_INFO | jq -r '.LoadBalancers[0].DNSName')
        
        # Wait a bit for the service to be ready
        sleep 30
        
        # Test the health endpoint
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$ALB_DNS/api/quotations/products" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            print_success "Health check passed! Service is running correctly."
        else
            print_warning "Health check returned status: $HTTP_STATUS"
            print_warning "Service may still be starting up. Please check again in a few minutes."
        fi
    else
        print_warning "Could not find load balancer. Please check manually."
    fi
}

# Main deployment function
main() {
    echo "=========================================="
    echo "  AWS Deployment - Quotation Service"
    echo "=========================================="
    
    # Pre-deployment checks
    check_aws_cli
    check_docker
    
    # Build and deploy
    build_application
    ecr_login
    build_and_push_image
    update_ecs_service
    wait_for_deployment
    
    # Post-deployment status
    get_service_status
    health_check
    
    echo "=========================================="
    print_success "Deployment completed successfully!"
    echo "=========================================="
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build-only")
        check_docker
        build_application
        ecr_login
        build_and_push_image
        print_success "Build and push completed!"
        ;;
    "status")
        check_aws_cli
        get_service_status
        ;;
    "health")
        health_check
        ;;
    "help")
        echo "Usage: $0 [deploy|build-only|status|health|help]"
        echo ""
        echo "Commands:"
        echo "  deploy     - Full deployment (default)"
        echo "  build-only - Build and push image only"
        echo "  status     - Check service status"
        echo "  health     - Run health check"
        echo "  help       - Show this help"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac