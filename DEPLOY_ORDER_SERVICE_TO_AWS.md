# Deploy Order-Management-Service to AWS

## Overview

This guide will help you deploy the Order-Management-Service to AWS ECS Fargate, following the same pattern as the quotation-service deployment.

**Time Required:** 30-45 minutes  
**Cost:** ~$30-40/month (after free tier)

---

## Prerequisites

- ✅ AWS Account with credentials configured
- ✅ AWS CLI installed and configured
- ✅ Docker Desktop installed and running
- ✅ Maven installed
- ✅ Order-Management-Service code ready

---

## Step 1: Prepare Order-Management-Service

### 1.1 Check the Service

```bash
cd Backend/Order-Management-Service
```

### 1.2 Verify pom.xml

Make sure Java version is 17 (not 25):

```xml
<properties>
    <java.version>17</java.version>
</properties>
```

### 1.3 Create Dockerfile

Create `Backend/Order-Management-Service/Dockerfile`:

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 1.4 Create .dockerignore

Create `Backend/Order-Management-Service/.dockerignore`:

```
target/
.mvn/
*.log
.git/
.gitignore
README.md
```

---

## Step 2: Create RDS Database for Orders

### 2.1 Create Database Instance

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

**Note:** Using the same security group as quotation-service for simplicity.

### 2.2 Wait for Database to be Available

```bash
aws rds wait db-instance-available \
  --db-instance-identifier order-db \
  --region us-east-1
```

This takes 5-10 minutes.

### 2.3 Get Database Endpoint

```bash
aws rds describe-db-instances \
  --db-instance-identifier order-db \
  --region us-east-1 \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

**Save this endpoint!** Example: `order-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com`

---

## Step 3: Create Database and Tables

### 3.1 Connect to RDS

```bash
mysql -h order-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com -u admin -p
# Password: OrderDB2024!
```

### 3.2 Create Database

```sql
CREATE DATABASE order_db;
USE order_db;
EXIT;
```

**Note:** Tables will be created automatically by Spring Boot when the service starts.

---

## Step 4: Store Database Credentials in Secrets Manager

### 4.1 Create Database URL Secret

```bash
aws secretsmanager create-secret \
  --name order-db-url \
  --description "Order Management Service Database URL" \
  --secret-string "jdbc:mysql://order-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com:3306/order_db" \
  --region us-east-1
```

### 4.2 Create Database Password Secret

```bash
aws secretsmanager create-secret \
  --name order-db-password \
  --description "Order Management Service Database Password" \
  --secret-string "OrderDB2024!" \
  --region us-east-1
```

### 4.3 Get Secret ARNs

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

**Save these ARNs!** You'll need them for the task definition.

---

## Step 5: Update Order-Management-Service Configuration

### 5.1 Update application.properties

Edit `Backend/Order-Management-Service/src/main/resources/application.properties`:

```properties
spring.application.name=order-management-service
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/order_db}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
server.port=8082
```

### 5.2 Add CORS Configuration

Create `Backend/Order-Management-Service/src/main/java/com/starbag/Order_Management_Service/config/CorsConfig.java`:

```java
package com.starbag.Order_Management_Service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:8080",
            "http://localhost:5173",
            "http://3.227.243.51:8080"  // Quotation service on AWS
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

---

## Step 6: Build and Push Docker Image

### 6.1 Build the Application

```bash
cd Backend/Order-Management-Service
mvn clean package -DskipTests
```

### 6.2 Build Docker Image

```bash
docker build -t order-management-service .
```

### 6.3 Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name order-management-service \
  --region us-east-1
```

### 6.4 Login to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 468284644046.dkr.ecr.us-east-1.amazonaws.com
```

### 6.5 Tag Image

```bash
docker tag order-management-service:latest 468284644046.dkr.ecr.us-east-1.amazonaws.com/order-management-service:latest
```

### 6.6 Push to ECR

```bash
docker push 468284644046.dkr.ecr.us-east-1.amazonaws.com/order-management-service:latest
```

---

## Step 7: Create ECS Task Definition

### 7.1 Create Task Definition File

Create `Backend/Order-Management-Service/ecs-task-definition.json`:

```json
{
  "family": "order-service-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::468284644046:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "order-management-service",
      "image": "468284644046.dkr.ecr.us-east-1.amazonaws.com/order-management-service:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8082,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "cloud"
        },
        {
          "name": "SPRING_DATASOURCE_USERNAME",
          "value": "admin"
        },
        {
          "name": "SPRING_DATASOURCE_DRIVER_CLASS_NAME",
          "value": "com.mysql.cj.jdbc.Driver"
        },
        {
          "name": "SPRING_JPA_HIBERNATE_DDL_AUTO",
          "value": "update"
        },
        {
          "name": "SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT",
          "value": "org.hibernate.dialect.MySQLDialect"
        }
      ],
      "secrets": [
        {
          "name": "SPRING_DATASOURCE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:468284644046:secret:order-db-url-XXXXXX"
        },
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:468284644046:secret:order-db-password-XXXXXX"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/order-management-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "wget --no-verbose --tries=1 --spider http://localhost:8082/orders || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 90
      }
    }
  ]
}
```

**Important:** Replace the secret ARNs with the actual ARNs from Step 4.3!

### 7.2 Register Task Definition

```bash
cd Backend/Order-Management-Service
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json \
  --region us-east-1
```

---

## Step 8: Create ECS Service

### 8.1 Create Security Group (if needed)

```bash
# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text --region us-east-1)

# Create security group
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
```

### 8.2 Get Subnet IDs

```bash
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].SubnetId' \
  --output text \
  --region us-east-1
```

**Save the subnet IDs!**

### 8.3 Create ECS Service

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

**Note:** Replace subnet IDs with your actual subnet IDs from Step 8.2.

---

## Step 9: Get Order Service IP Address

### 9.1 Wait for Service to Start

```bash
# Wait 2-3 minutes for service to start
sleep 120
```

### 9.2 Get Task ARN

```bash
TASK_ARN=$(aws ecs list-tasks \
  --cluster quotation-cluster \
  --service-name order-management-service \
  --desired-status RUNNING \
  --region us-east-1 \
  --query 'taskArns[0]' \
  --output text)

echo "Task ARN: $TASK_ARN"
```

### 9.3 Get Network Interface ID

```bash
ENI_ID=$(aws ecs describe-tasks \
  --cluster quotation-cluster \
  --tasks $TASK_ARN \
  --region us-east-1 \
  --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' \
  --output text)

echo "ENI ID: $ENI_ID"
```

### 9.4 Get Public IP

```bash
ORDER_SERVICE_IP=$(aws ec2 describe-network-interfaces \
  --network-interface-ids $ENI_ID \
  --query 'NetworkInterfaces[0].Association.PublicIp' \
  --output text \
  --region us-east-1)

echo "Order Service IP: $ORDER_SERVICE_IP"
```

**Save this IP!** Example: `54.123.45.67`

---

## Step 10: Test Order Service

### 10.1 Test Health Check

```bash
curl http://$ORDER_SERVICE_IP:8082/orders
```

Should return empty array: `[]`

### 10.2 Test Create Order

```bash
curl -X POST http://$ORDER_SERVICE_IP:8082/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 123,
    "productIds": "1,2",
    "quantities": "5,10",
    "status": "PENDING"
  }'
```

Should return created order with ID.

---

## Step 11: Update Quotation Service Configuration

### 11.1 Update Quotation Service Environment

You need to update the quotation-service to use the Order Service URL.

**Option A: Update Task Definition**

Edit `Backend/quotation-service/ecs-task-definition.json` and add:

```json
{
  "name": "ORDER_SERVICE_URL",
  "value": "http://ORDER_SERVICE_IP:8082"
}
```

Then redeploy quotation-service:

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

**Option B: Use Service Discovery (Recommended for Production)**

This is more complex but provides stable service-to-service communication.

---

## Step 12: Test Convert to Order

### 12.1 Create a Quotation

```bash
curl -X POST http://3.227.243.51:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST001",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "test@example.com",
    "phone": "1234567890",
    "items": [{"productId": 1, "quantity": 5}]
  }'
```

### 12.2 Send Quotation

```bash
curl -X PUT http://3.227.243.51:8080/api/quotations/1/send \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"itemId": 1, "unitPrice": 1199.99, "discount": 100.00}]
  }'
```

### 12.3 Accept Quotation

```bash
curl -X PUT http://3.227.243.51:8080/api/quotations/1/accept
```

### 12.4 Convert to Order

```bash
curl -X POST http://3.227.243.51:8080/api/quotations/1/convert
```

Should now work! ✅

---

## Summary

You've now deployed:

1. ✅ Order-Management-Service on ECS Fargate
2. ✅ RDS MySQL database for orders
3. ✅ Security groups and networking
4. ✅ Service-to-service communication

**Total Cost:** ~$60-70/month for both services (after free tier)

---

## Troubleshooting

### Service Won't Start

Check logs:
```bash
aws logs tail /ecs/order-management-service --follow --region us-east-1
```

### Can't Connect to Database

1. Check security group allows traffic from ECS
2. Verify database endpoint is correct
3. Check secrets are configured correctly

### Convert to Order Still Fails

1. Verify Order Service is running
2. Check quotation-service has correct ORDER_SERVICE_URL
3. Check network connectivity between services
4. Review CloudWatch logs

---

## Next Steps

1. **Setup Application Load Balancer** - Provides stable URLs
2. **Enable Auto-scaling** - Scale based on demand
3. **Setup CloudWatch Alarms** - Monitor service health
4. **Implement Service Discovery** - Automatic service-to-service communication

---

**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Cost:** ~$30-40/month (after free tier)
