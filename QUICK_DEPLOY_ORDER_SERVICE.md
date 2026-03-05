# Quick Deploy - Order Management Service

## TL;DR - Fast Deployment Commands

### 1. Create RDS Database (5-10 min wait)

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

aws rds wait db-instance-available --db-instance-identifier order-db --region us-east-1
```

### 2. Get Database Endpoint

```bash
aws rds describe-db-instances \
  --db-instance-identifier order-db \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

**Save this!** Example: `order-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com`

### 3. Create Database Schema

```bash
mysql -h YOUR_ENDPOINT_HERE -u admin -p
# Password: OrderDB2024!
```

```sql
CREATE DATABASE order_management_db;
EXIT;
```

### 4. Create Secrets (Replace YOUR_ENDPOINT_HERE)

```bash
aws secretsmanager create-secret \
  --name order-db-url \
  --secret-string "jdbc:mysql://YOUR_ENDPOINT_HERE:3306/order_management_db" \
  --region us-east-1

aws secretsmanager create-secret \
  --name order-db-password \
  --secret-string "OrderDB2024!" \
  --region us-east-1
```

### 5. Get Secret ARNs

```bash
aws secretsmanager describe-secret --secret-id order-db-url --region us-east-1 --query 'ARN' --output text
aws secretsmanager describe-secret --secret-id order-db-password --region us-east-1 --query 'ARN' --output text
```

**Save these ARNs!**

### 6. Update Task Definition

Edit `Backend/Order-Management-Service/ecs-task-definition.json`:

Replace the `secrets` section ARNs with your actual ARNs from step 5.

### 7. Deploy Service

```bash
cd Backend/Order-Management-Service

# Windows
deploy-to-aws.bat

# Linux/Mac
chmod +x deploy-to-aws.sh
./deploy-to-aws.sh
```

### 8. Create ECS Service (First Time Only)

```bash
# Get VPC and subnets
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region us-east-1)
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region us-east-1)

# Create security group
aws ec2 create-security-group \
  --group-name order-service-sg \
  --description "Order Service SG" \
  --vpc-id $VPC_ID \
  --region us-east-1

SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=order-service-sg" --query 'SecurityGroups[0].GroupId' --output text --region us-east-1)

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 8082 \
  --cidr 0.0.0.0/0 \
  --region us-east-1

# Create service (replace subnet IDs)
aws ecs create-service \
  --cluster quotation-cluster \
  --service-name order-management-service \
  --task-definition order-service-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-01ee8a40c1f59f4aa,subnet-0ec80e3a4c1a98d88],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
  --region us-east-1
```

### 9. Get Service IP (Wait 2-3 min first)

```bash
# Windows
get-service-ip.bat

# Linux/Mac
./get-service-ip.sh
```

**Save the IP!** Example: `http://54.123.45.67:8082`

### 10. Test Order Service

```bash
curl http://YOUR_ORDER_IP:8082/orders
```

Should return: `[]`

### 11. Update Quotation Service

Edit `Backend/quotation-service/ecs-task-definition.json`, add to `environment`:

```json
{
  "name": "ORDER_SERVICE_URL",
  "value": "http://YOUR_ORDER_IP:8082"
}
```

Deploy:

```bash
cd Backend/quotation-service

aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json \
  --region us-east-1

aws ecs update-service \
  --cluster quotation-cluster \
  --service quotation-service \
  --task-definition quotation-service-task \
  --force-new-deployment \
  --region us-east-1
```

### 12. Get New Quotation Service IP

```bash
TASK_ARN=$(aws ecs list-tasks --cluster quotation-cluster --service-name quotation-service --desired-status RUNNING --region us-east-1 --query 'taskArns[0]' --output text)
ENI_ID=$(aws ecs describe-tasks --cluster quotation-cluster --tasks $TASK_ARN --region us-east-1 --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
QUOTATION_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region us-east-1)

echo "Quotation Service: http://$QUOTATION_IP:8080/api"
```

### 13. Update Frontend (if IP changed)

Update these files with new quotation service IP:
- `frontend/.env.development`
- `frontend/.env.production`
- `frontend/src/services/quotationApi.ts`

Restart frontend:
```bash
cd frontend
npm run dev
```

### 14. Test Complete Flow

1. Create quotation
2. Send quotation (admin)
3. Accept quotation (customer)
4. **Convert to Order** ✅ Should work!

---

## Verification Commands

```bash
# Check Order Service
curl http://ORDER_IP:8082/orders

# Check Quotation Service
curl http://QUOTATION_IP:8080/api/quotations

# View Order Service Logs
aws logs tail /ecs/order-management-service --follow --region us-east-1

# View Quotation Service Logs
aws logs tail /ecs/quotation-service --follow --region us-east-1

# Check Service Status
aws ecs describe-services --cluster quotation-cluster --services order-management-service --region us-east-1
```

---

## Troubleshooting

**Service won't start:**
```bash
aws logs tail /ecs/order-management-service --follow --region us-east-1
```

**Can't connect to database:**
- Check security group: `sg-05d1fe70b735bcaee`
- Verify endpoint in secrets
- Check secrets ARNs in task definition

**Convert to Order fails:**
- Verify ORDER_SERVICE_URL in quotation-service
- Test Order Service directly: `curl http://ORDER_IP:8082/orders`
- Check CloudWatch logs

---

## Summary

**Time:** 30-40 minutes  
**Cost:** ~$35/month additional  
**Result:** "Convert to Order" feature working on AWS ✅

