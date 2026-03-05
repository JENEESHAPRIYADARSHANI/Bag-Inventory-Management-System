# Deploy Order Management Service to AWS - Step by Step Guide

## Overview

This guide will help you deploy the Order-Management-Service to AWS so the "Convert to Order" feature works on the cloud.

**Time Required:** 30-40 minutes  
**Current Status:** Quotation service is deployed, Order service is NOT deployed

---

## What You'll Do

1. Create RDS database for orders
2. Store database credentials in AWS Secrets Manager
3. Build and deploy Order Management Service to ECS
4. Update Quotation Service to connect to Order Service
5. Test the complete flow

---

## Prerequisites

✅ AWS CLI configured  
✅ Docker Desktop running  
✅ Maven installed  
✅ Quotation service already deployed on AWS

---

## Step 1: Create RDS Database for Orders

### 1.1 Create the database instance

```bash
aws rds create-db-instance \
  --db-instance-identifier order-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.40 \
  --master-username admin \
  --master-user-password OrderDB2024! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-05d1fe70b735bcaee \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --publicly-accessible \
  --region us-east-1
```

**Note:** This uses the same security group as quotation-service for simplicity.

### 1.2 Wait for database to be ready (5-10 minutes)

```bash
aws rds wait db-instance-available \
  --db-instance-identifier order-db \
  --region us-east-1
```

### 1.3 Get the database endpoint

```bash
aws rds describe-db-instances \
  --db-instance-identifier order-db \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

**Save this endpoint!** It will look like: `order-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com`

---

## Step 2: Create Database Schema

### 2.1 Connect to the database

```bash
mysql -h order-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com -u admin -p
# Password: OrderDB2024!
```

### 2.2 Create the database

```sql
CREATE DATABASE order_management_db;
USE order_management_db;
EXIT;
```

**Note:** Tables will be created automatically by Spring Boot when the service starts.

---

## Step 3: Store Database Credentials in AWS Secrets Manager

### 3.1 Create database URL secret

Replace `order-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com` with your actual endpoint:

```bash
aws secretsmanager create-secret \
  --name order-db-url \
  --description "Order Management Service Database URL" \
  --secret-string "jdbc:mysql://order-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com:3306/order_management_db" \
  --region us-east-1
```

### 3.2 Create database password secret

```bash
aws secretsmanager create-secret \
  --name order-db-password \
  --description "Order Management Service Database Password" \
  --secret-string "OrderDB2024!" \
  --region us-east-1
```

### 3.3 Get the secret ARNs

```bash
# Get URL secret ARN
aws secretsmanager describe-secret \
  --secret-id order-db-url \
  --region us-east-1 \
  --query 'ARN' \
  --output text

# Get password secret ARN
aws secretsmanager describe-secret \
  --secret-id order-db-password \
  --region us-east-1 \
  --query 'ARN' \
  --output text
```

**Save these ARNs!** They look like:
- `arn:aws:secretsmanager:us-east-1:468284644046:secret:order-db-url-XXXXXX`
- `arn:aws:secretsmanager:us-east-1:468284644046:secret:order-db-password-XXXXXX`

### 3.4 Update task definition with secret ARNs

Edit `Backend/Order-Management-Service/ecs-task-definition.json` and update the `secrets` section with your actual ARNs:

```json
"secrets": [
  {
    "name": "SPRING_DATASOURCE_URL",
    "valueFrom": "arn:aws:secretsmanager:us-east-1:468284644046:secret:order-db-url-XXXXXX"
  },
  {
    "name": "SPRING_DATASOURCE_PASSWORD",
    "valueFrom": "arn:aws:secretsmanager:us-east-1:468284644046:secret:order-db-password-XXXXXX"
  }
]
```

---

## Step 4: Build and Deploy Order Management Service

### 4.1 Navigate to the service directory

```bash
cd Backend/Order-Management-Service
```

### 4.2 Run the deployment script

**On Windows:**
```bash
deploy-to-aws.bat
```

**On Linux/Mac:**
```bash
chmod +x deploy-to-aws.sh
./deploy-to-aws.sh
```

This script will:
- Build the Maven application
- Build Docker image
- Create ECR repository
- Push image to ECR
- Register task definition

**Note:** The script will tell you if the service needs to be created manually.

---

## Step 5: Create ECS Service (First Time Only)

If this is your first deployment, you need to create the ECS service.

### 5.1 Get subnet IDs

```bash
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region us-east-1)

aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].SubnetId' \
  --output text \
  --region us-east-1
```

**Save the subnet IDs!** They look like: `subnet-01ee8a40c1f59f4aa subnet-0ec80e3a4c1a98d88`

### 5.2 Create security group

```bash
aws ec2 create-security-group \
  --group-name order-service-sg \
  --description "Security group for Order Management Service" \
  --vpc-id $VPC_ID \
  --region us-east-1

# Get security group ID
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=order-service-sg" --query 'SecurityGroups[0].GroupId' --output text --region us-east-1)

# Allow inbound traffic on port 8082
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 8082 \
  --cidr 0.0.0.0/0 \
  --region us-east-1

echo "Security Group ID: $SG_ID"
```

### 5.3 Create the ECS service

Replace `subnet-xxx` and `$SG_ID` with your actual values:

```bash
aws ecs create-service \
  --cluster quotation-cluster \
  --service-name order-management-service \
  --task-definition order-service-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-01ee8a40c1f59f4aa,subnet-0ec80e3a4c1a98d88],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
  --region us-east-1
```

---

## Step 6: Get Order Service IP Address

### 6.1 Wait for service to start (2-3 minutes)

```bash
sleep 120
```

### 6.2 Get the IP address

**On Windows:**
```bash
get-service-ip.bat
```

**On Linux/Mac:**
```bash
chmod +x get-service-ip.sh
./get-service-ip.sh
```

**Save the IP address!** It will look like: `http://54.123.45.67:8082`

### 6.3 Test the service

```bash
curl http://54.123.45.67:8082/orders
```

Should return: `[]` (empty array)

---

## Step 7: Update Quotation Service Configuration

Now you need to tell the quotation-service where to find the order-service.

### 7.1 Update quotation service task definition

Edit `Backend/quotation-service/ecs-task-definition.json` and add this to the `environment` array:

```json
{
  "name": "ORDER_SERVICE_URL",
  "value": "http://54.123.45.67:8082"
}
```

Replace `54.123.45.67` with your actual Order Service IP.

### 7.2 Redeploy quotation service

```bash
cd Backend/quotation-service

# Register new task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json \
  --region us-east-1

# Update service with new task definition
aws ecs update-service \
  --cluster quotation-cluster \
  --service quotation-service \
  --task-definition quotation-service-task \
  --force-new-deployment \
  --region us-east-1
```

### 7.3 Wait for quotation service to restart (2-3 minutes)

```bash
sleep 120
```

### 7.4 Get new quotation service IP (it may have changed)

```bash
# Get task ARN
TASK_ARN=$(aws ecs list-tasks \
  --cluster quotation-cluster \
  --service-name quotation-service \
  --desired-status RUNNING \
  --region us-east-1 \
  --query 'taskArns[0]' \
  --output text)

# Get network interface ID
ENI_ID=$(aws ecs describe-tasks \
  --cluster quotation-cluster \
  --tasks $TASK_ARN \
  --region us-east-1 \
  --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
  --output text)

# Get public IP
QUOTATION_IP=$(aws ec2 describe-network-interfaces \
  --network-interface-ids $ENI_ID \
  --query 'NetworkInterfaces[0].Association.PublicIp' \
  --output text \
  --region us-east-1)

echo "New Quotation Service IP: http://$QUOTATION_IP:8080/api"
```

### 7.5 Update frontend configuration

If the quotation service IP changed, update these files:

**frontend/.env.development:**
```
VITE_API_BASE_URL=http://NEW_IP:8080/api
```

**frontend/.env.production:**
```
VITE_API_BASE_URL=http://NEW_IP:8080/api
```

**frontend/src/services/quotationApi.ts:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://NEW_IP:8080/api';
```

### 7.6 Restart frontend

```bash
cd frontend
npm run dev
```

---

## Step 8: Test the Complete Flow

### 8.1 Create a quotation

1. Open frontend: http://localhost:8080
2. Go to "Request Quotation"
3. Fill in the form
4. Submit

### 8.2 Send quotation (Admin)

1. Go to Admin panel
2. Find the quotation
3. Update prices/discounts
4. Click "Send to Customer"

### 8.3 Accept quotation (Customer)

1. Go to "My Quotations"
2. Search by email
3. Click "Accept"

### 8.4 Convert to Order (Admin) - THIS SHOULD NOW WORK! ✅

1. Go to Admin panel
2. Find the ACCEPTED quotation
3. Click "Convert to Order"
4. ✅ Should succeed!

### 8.5 Verify order was created

```bash
curl http://ORDER_SERVICE_IP:8082/orders
```

Should show the created order!

---

## Troubleshooting

### Service won't start

Check logs:
```bash
aws logs tail /ecs/order-management-service --follow --region us-east-1
```

### Can't connect to database

1. Check security group allows traffic from ECS
2. Verify database endpoint is correct in secrets
3. Check secrets ARNs in task definition

### Convert to Order still fails

1. Verify Order Service is running:
   ```bash
   curl http://ORDER_SERVICE_IP:8082/orders
   ```

2. Check quotation-service has correct ORDER_SERVICE_URL:
   ```bash
   aws logs tail /ecs/quotation-service --follow --region us-east-1
   ```

3. Check network connectivity between services

### Health check failing

The health check uses `/orders` endpoint. Make sure:
- Service is listening on port 8082
- `/orders` endpoint returns 200 OK
- Container has `wget` installed (included in alpine image)

---

## Summary

After completing these steps, you will have:

✅ Order-Management-Service deployed on AWS ECS  
✅ RDS MySQL database for orders  
✅ Quotation service connected to Order service  
✅ "Convert to Order" feature working on cloud  

---

## Cost Estimate

**Additional Monthly Cost:**
- ECS Fargate (1 task): ~$15/month
- RDS MySQL (db.t3.micro): ~$15/month
- Data Transfer: ~$5/month
- **Total Additional:** ~$35/month

**Total for Both Services:** ~$70/month (after free tier)

---

## Next Steps

1. **Setup Application Load Balancer** - Provides stable URLs instead of dynamic IPs
2. **Enable Auto-scaling** - Scale based on demand
3. **Setup CloudWatch Alarms** - Monitor service health
4. **Deploy Frontend to AWS** - Complete cloud deployment

---

**Need Help?**

- Check CloudWatch logs for errors
- Verify security groups allow traffic
- Ensure secrets are configured correctly
- Test each service independently before testing together

