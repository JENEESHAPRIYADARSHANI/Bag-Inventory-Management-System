# ☁️ AWS Integration Guide - Logistics Service

Complete guide to deploy and integrate your Spring Boot Logistics Service with AWS services.

---

## 📋 Table of Contents

1. [AWS Services Overview](#aws-services-overview)
2. [Prerequisites](#prerequisites)
3. [Deploy to AWS Elastic Beanstalk](#deploy-to-aws-elastic-beanstalk)
4. [Setup AWS RDS MySQL Database](#setup-aws-rds-mysql-database)
5. [Configure AWS S3 for File Storage](#configure-aws-s3-for-file-storage)
6. [Setup AWS SES for Email Notifications](#setup-aws-ses-for-email-notifications)
7. [Configure AWS SNS for SMS Notifications](#configure-aws-sns-for-sms-notifications)
8. [Setup AWS CloudWatch for Monitoring](#setup-aws-cloudwatch-for-monitoring)
9. [Configure AWS Lambda for Automation](#configure-aws-lambda-for-automation)
10. [Security with AWS IAM](#security-with-aws-iam)

---

## 🌐 AWS Services Overview

### Recommended AWS Services for Logistics Service

| AWS Service           | Purpose                | Use Case                                   |
| --------------------- | ---------------------- | ------------------------------------------ |
| **Elastic Beanstalk** | Application Hosting    | Deploy Spring Boot application             |
| **RDS (MySQL)**       | Database               | Replace local MySQL with cloud database    |
| **S3**                | File Storage           | Store delivery documents, images, receipts |
| **SES**               | Email Service          | Send tracking notifications to customers   |
| **SNS**               | SMS/Push Notifications | Send delivery status updates via SMS       |
| **CloudWatch**        | Monitoring & Logs      | Monitor application health and logs        |
| **Lambda**            | Serverless Functions   | Automated tasks (e.g., status updates)     |
| **API Gateway**       | API Management         | Manage and secure your REST APIs           |
| **CloudFront**        | CDN                    | Fast content delivery globally             |
| **IAM**               | Security               | Manage access and permissions              |

---

## 📦 Prerequisites

### 1. AWS Account

- Create account at: https://aws.amazon.com/
- Free tier available for 12 months

### 2. AWS CLI Installation

```bash
# Windows (using Chocolatey)
choco install awscli

# Or download installer from:
# https://aws.amazon.com/cli/
```

### 3. Configure AWS CLI

```bash
aws configure
```

Enter:

- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Default output format (json)

### 4. Install Elastic Beanstalk CLI

```bash
pip install awsebcli
```

---

## 🚀 1. Deploy to AWS Elastic Beanstalk

### Step 1: Prepare Application for Deployment

#### Update `pom.xml` - Add packaging

```xml
<packaging>jar</packaging>
```

#### Update `application.yaml` - Use environment variables

```yaml
spring:
  application:
    name: logistics-service

  datasource:
    url: ${DATABASE_URL:jdbc:mysql://localhost:3306/logistics_db}
    username: ${DATABASE_USERNAME:root}
    password: ${DATABASE_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

server:
  port: ${SERVER_PORT:5000}
```

### Step 2: Build JAR File

```bash
mvnw.cmd clean package
```

This creates: `target/logistics-Service-0.0.1-SNAPSHOT.jar`

### Step 3: Initialize Elastic Beanstalk

```bash
eb init
```

Select:

- Region: `us-east-1` (or your preferred region)
- Application name: `logistics-service`
- Platform: `Java`
- Platform version: `Corretto 17`
- SSH: `Yes` (for debugging)

### Step 4: Create Environment

```bash
eb create logistics-service-env
```

Options:

- Environment name: `logistics-service-env`
- DNS CNAME: `logistics-service` (will be: logistics-service.elasticbeanstalk.com)
- Load balancer: `application`

### Step 5: Deploy Application

```bash
eb deploy
```

### Step 6: Open Application

```bash
eb open
```

Your app will be at: `http://logistics-service.elasticbeanstalk.com`

### Step 7: Set Environment Variables

```bash
eb setenv DATABASE_URL=jdbc:mysql://your-rds-endpoint:3306/logistics_db \
          DATABASE_USERNAME=admin \
          DATABASE_PASSWORD=your-password \
          SERVER_PORT=5000
```

---

## 🗄️ 2. Setup AWS RDS MySQL Database

### Step 1: Create RDS Instance via AWS Console

1. Go to **AWS RDS Console**
2. Click **Create database**
3. Choose:
   - Engine: **MySQL**
   - Version: **8.0.35**
   - Template: **Free tier** (for testing)
   - DB instance identifier: `logistics-db`
   - Master username: `admin`
   - Master password: `YourSecurePassword123!`
   - DB instance class: `db.t3.micro` (free tier)
   - Storage: 20 GB
   - Public access: **Yes** (for initial setup)
   - VPC security group: Create new
   - Database name: `logistics_db`

4. Click **Create database**

### Step 2: Configure Security Group

1. Go to **EC2 > Security Groups**
2. Find RDS security group
3. Edit **Inbound rules**
4. Add rule:
   - Type: `MySQL/Aurora`
   - Port: `3306`
   - Source: `0.0.0.0/0` (for testing) or your IP
   - Description: `MySQL access`

### Step 3: Get RDS Endpoint

1. Go to **RDS > Databases**
2. Click on `logistics-db`
3. Copy **Endpoint** (e.g., `logistics-db.xxxxxx.us-east-1.rds.amazonaws.com`)

### Step 4: Update Application Configuration

```yaml
spring:
  datasource:
    url: jdbc:mysql://logistics-db.xxxxxx.us-east-1.rds.amazonaws.com:3306/logistics_db
    username: admin
    password: YourSecurePassword123!
```

Or use environment variables:

```bash
eb setenv DATABASE_URL=jdbc:mysql://logistics-db.xxxxxx.us-east-1.rds.amazonaws.com:3306/logistics_db \
          DATABASE_USERNAME=admin \
          DATABASE_PASSWORD=YourSecurePassword123!
```

### Step 5: Test Connection

```bash
mysql -h logistics-db.xxxxxx.us-east-1.rds.amazonaws.com -u admin -p
```

---

## 📁 3. Configure AWS S3 for File Storage

### Use Case: Store delivery documents, proof of delivery images, receipts

### Step 1: Add AWS SDK Dependencies

Add to `pom.xml`:

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.20.26</version>
</dependency>
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>auth</artifactId>
    <version>2.20.26</version>
</dependency>
```

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://logistics-service-documents --region us-east-1
```

Or via AWS Console:

1. Go to **S3 Console**
2. Click **Create bucket**
3. Bucket name: `logistics-service-documents`
4. Region: `us-east-1`
5. Block public access: **Uncheck** (if you need public URLs)
6. Click **Create bucket**

### Step 3: Create S3 Configuration

Create `src/main/java/com/starbag/logistics_Service/config/S3Config.java`:

```java
package com.starbag.logistics_Service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${aws.access.key}")
    private String accessKey;

    @Value("${aws.secret.key}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);

        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }
}
```

### Step 4: Create S3 Service

Create `src/main/java/com/starbag/logistics_Service/service/S3Service.java`:

```java
package com.starbag.logistics_Service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String trackingId) throws IOException {
        String fileName = trackingId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return getFileUrl(fileName);
    }

    public String getFileUrl(String fileName) {
        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, fileName);
    }

    public void deleteFile(String fileName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }
}
```

### Step 5: Update application.yaml

```yaml
aws:
  access:
    key: ${AWS_ACCESS_KEY}
  secret:
    key: ${AWS_SECRET_KEY}
  region: us-east-1
  s3:
    bucket: logistics-service-documents
```

### Step 6: Add File Upload Endpoint

Add to `DeliveryTrackingController.java`:

```java
@Autowired
private S3Service s3Service;

@PostMapping("/{trackingId}/upload")
public ResponseEntity<String> uploadDocument(
        @PathVariable String trackingId,
        @RequestParam("file") MultipartFile file) {
    try {
        String fileUrl = s3Service.uploadFile(file, trackingId);
        return ResponseEntity.ok(fileUrl);
    } catch (IOException e) {
        return ResponseEntity.status(500).body("Upload failed");
    }
}
```

---

## 📧 4. Setup AWS SES for Email Notifications

### Use Case: Send tracking updates, delivery confirmations via email

### Step 1: Verify Email Address

```bash
aws ses verify-email-identity --email-address your-email@example.com --region us-east-1
```

Check email and click verification link.

### Step 2: Add AWS SES Dependency

Add to `pom.xml`:

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>ses</artifactId>
    <version>2.20.26</version>
</dependency>
```

### Step 3: Create Email Service

Create `src/main/java/com/starbag/logistics_Service/service/EmailService.java`:

```java
package com.starbag.logistics_Service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${aws.ses.from-email}")
    private String fromEmail;

    private final SesClient sesClient;

    public void sendTrackingUpdate(String toEmail, String trackingId, String status) {
        String subject = "Tracking Update: " + trackingId;
        String body = String.format(
            "Your delivery status has been updated to: %s\n\nTracking ID: %s",
            status, trackingId
        );

        SendEmailRequest request = SendEmailRequest.builder()
                .destination(Destination.builder().toAddresses(toEmail).build())
                .message(Message.builder()
                        .subject(Content.builder().data(subject).build())
                        .body(Body.builder()
                                .text(Content.builder().data(body).build())
                                .build())
                        .build())
                .source(fromEmail)
                .build();

        sesClient.sendEmail(request);
    }
}
```

### Step 4: Update application.yaml

```yaml
aws:
  ses:
    from-email: your-verified-email@example.com
```

---

## 📱 5. Configure AWS SNS for SMS Notifications

### Use Case: Send SMS alerts for delivery status changes

### Step 1: Add AWS SNS Dependency

Add to `pom.xml`:

```xml
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>sns</artifactId>
    <version>2.20.26</version>
</dependency>
```

### Step 2: Create SMS Service

Create `src/main/java/com/starbag/logistics_Service/service/SmsService.java`:

```java
package com.starbag.logistics_Service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.*;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final SnsClient snsClient;

    public void sendSms(String phoneNumber, String message) {
        PublishRequest request = PublishRequest.builder()
                .message(message)
                .phoneNumber(phoneNumber)
                .build();

        snsClient.publish(request);
    }

    public void sendDeliveryAlert(String phoneNumber, String trackingId, String status) {
        String message = String.format(
            "Delivery Update: Your package %s is now %s",
            trackingId, status
        );
        sendSms(phoneNumber, message);
    }
}
```

### Step 3: Configure SNS Client

Add to `S3Config.java` or create new config:

```java
@Bean
public SnsClient snsClient() {
    return SnsClient.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)
            ))
            .build();
}
```

---

## 📊 6. Setup AWS CloudWatch for Monitoring

### Step 1: Add CloudWatch Dependency

Add to `pom.xml`:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-cloudwatch2</artifactId>
</dependency>
```

### Step 2: Configure CloudWatch

Add to `application.yaml`:

```yaml
management:
  metrics:
    export:
      cloudwatch:
        namespace: LogisticsService
        batch-size: 20
        step: 1m
  endpoints:
    web:
      exposure:
        include: health,metrics,info
```

### Step 3: View Logs in CloudWatch

```bash
aws logs tail /aws/elasticbeanstalk/logistics-service-env/var/log/eb-engine.log --follow
```

---

## ⚡ 7. Configure AWS Lambda for Automation

### Use Case: Automated status updates, scheduled tasks

### Example: Auto-update delivery status

Create Lambda function:

```python
import json
import boto3
import requests

def lambda_handler(event, context):
    # Your logistics service endpoint
    api_url = "http://logistics-service.elasticbeanstalk.com/api/tracking"

    # Update logic here
    tracking_id = event['trackingId']
    new_status = event['status']

    response = requests.put(
        f"{api_url}/{tracking_id}/status",
        json={"status": new_status, "updatedBy": "system"}
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Status updated successfully')
    }
```

---

## 🔐 8. Security with AWS IAM

### Create IAM User for Application

```bash
aws iam create-user --user-name logistics-service-app
```

### Attach Policies

```bash
aws iam attach-user-policy --user-name logistics-service-app \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-user-policy --user-name logistics-service-app \
    --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess

aws iam attach-user-policy --user-name logistics-service-app \
    --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess
```

### Create Access Keys

```bash
aws iam create-access-key --user-name logistics-service-app
```

Save the Access Key ID and Secret Access Key.

---

## 🎯 Complete Deployment Checklist

- [ ] AWS account created
- [ ] AWS CLI configured
- [ ] Application built as JAR
- [ ] Elastic Beanstalk environment created
- [ ] RDS MySQL database created and configured
- [ ] S3 bucket created for file storage
- [ ] SES email verified
- [ ] SNS configured for SMS
- [ ] CloudWatch monitoring enabled
- [ ] IAM user and policies configured
- [ ] Environment variables set
- [ ] Application deployed and tested

---

## 💰 Cost Estimation (Free Tier)

| Service           | Free Tier                | After Free Tier    |
| ----------------- | ------------------------ | ------------------ |
| Elastic Beanstalk | Free (pay for resources) | ~$15-30/month      |
| RDS (db.t3.micro) | 750 hours/month          | ~$15/month         |
| S3                | 5GB storage              | $0.023/GB/month    |
| SES               | 62,000 emails/month      | $0.10/1000 emails  |
| SNS               | 1,000 SMS/month          | $0.00645/SMS (US)  |
| CloudWatch        | 10 metrics               | $0.30/metric/month |

**Total estimated cost after free tier: $30-50/month**

---

## 🚀 Quick Deploy Commands

```bash
# Build application
mvnw.cmd clean package

# Initialize Elastic Beanstalk
eb init -p java-17 logistics-service

# Create environment
eb create logistics-service-env

# Deploy
eb deploy

# Set environment variables
eb setenv DATABASE_URL=your-rds-endpoint \
          DATABASE_USERNAME=admin \
          DATABASE_PASSWORD=your-password

# Open application
eb open

# View logs
eb logs

# Check status
eb status
```

---

**Your logistics service is now cloud-ready with AWS! ☁️🚀**
