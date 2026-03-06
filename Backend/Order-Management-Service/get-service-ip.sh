#!/bin/bash

# Get Order Management Service IP Address

AWS_REGION="us-east-1"
ECS_CLUSTER="quotation-cluster"
SERVICE_NAME="order-management-service"

echo "Getting Order Management Service IP address..."
echo ""

# Get task ARN
TASK_ARN=$(aws ecs list-tasks \
  --cluster $ECS_CLUSTER \
  --service-name $SERVICE_NAME \
  --desired-status RUNNING \
  --region $AWS_REGION \
  --query 'taskArns[0]' \
  --output text)

if [ "$TASK_ARN" = "None" ] || [ -z "$TASK_ARN" ]; then
    echo "❌ No running tasks found for service: $SERVICE_NAME"
    echo ""
    echo "Please check:"
    echo "1. Service is created and running"
    echo "2. Service name is correct: $SERVICE_NAME"
    echo "3. Cluster name is correct: $ECS_CLUSTER"
    exit 1
fi

echo "Task ARN: $TASK_ARN"
echo ""

# Get network interface ID
ENI_ID=$(aws ecs describe-tasks \
  --cluster $ECS_CLUSTER \
  --tasks $TASK_ARN \
  --region $AWS_REGION \
  --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
  --output text)

echo "Network Interface ID: $ENI_ID"
echo ""

# Get public IP
PUBLIC_IP=$(aws ec2 describe-network-interfaces \
  --network-interface-ids $ENI_ID \
  --query 'NetworkInterfaces[0].Association.PublicIp' \
  --output text \
  --region $AWS_REGION)

echo "=========================================="
echo "✅ Order Management Service IP Address:"
echo "=========================================="
echo ""
echo "  http://$PUBLIC_IP:8082"
echo ""
echo "=========================================="
echo ""
echo "Test the service:"
echo "  curl http://$PUBLIC_IP:8082/orders"
echo ""
echo "Update quotation-service environment:"
echo "  ORDER_SERVICE_URL=http://$PUBLIC_IP:8082"
echo ""
