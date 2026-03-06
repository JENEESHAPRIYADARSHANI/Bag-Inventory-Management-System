# ☁️ AWS Deployment Guide - Quotation Service

Complete guide to deploy your Spring Boot Quotation Service to AWS Cloud.

---

## 📋 Table of Contents

1. [AWS Services Overview](#aws-services-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start - Deploy to AWS](#quick-start)
4. [Detailed Setup](#detailed-setup)
5. [Database Configuration](#database-configuration)
6. [Environment Variables](#environment-variables)
7. [Testing Deployment](#testing-deployment)
8. [Cost Estimation](#cost-estimation)

---

## 🌐 AWS Services Overview

### Services We'll Use

| AWS Service           | Purpose                     | Why We Need It                          |
| --------------------- | --------------------------- | --------------------------------------- |
| **EC2**               | Application Hosting         | Run Spring Boot application             |
| **RDS (MySQL)**       | Database                    | Cloud MySQL database for quotations     |
| **Elastic Beanstalk** | Easy Deployment (Optional)  | Simplified deployment and management    |
| **S3**                | File Storage (Optional)     | Store quotation documents/PDFs          |
| **CloudWatch**        | Monitoring & Logs           | Monitor application health              |
| **IAM**               | Security                    | Manage access and permissions           |

---

## 📦 Prerequisites

### 1. AWS Account
- Create account at: https://aws.amazon.com/
- Free tier available for 12 months

### 2. AWS CLI Installation

**Windows:**
```powershell
# Download from: https://aws.amazon.com/cli/
# Or using Chocolatey:
choco install awscli
```

### 3. Configure AWS CLI

```bash
aws configure
```

Enter:
- AWS Access Key ID: (from AWS Console → IAM → Users → Security credentials)
- AWS Secret Access Key: (from AWS Console)
- Default region: `us-east-1` (or your preferred region)
- Default output format: `json`

### 4. Java 17+ Installed
```bash
java -version
```

---

## 🚀 Quick Start - Deploy to AWS

### Option 1: Deploy to EC2 (Recommended for Learning)

#### Step 1: Create EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Configure:
   - **Name**: `quotation-service`
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04
   - **Instance type**: `t2.micro` (Free tier eligible)
   - **Key pair**: Create new or use existing
   - **Security group**: 
     - Allow SSH (port 22) from your IP
     - Allow HTTP (port 80) from anywhere
     - Allow Custom TCP (port 8080) from anywhere
3. Click **Launch Instance**

#### Step 2: Connect to EC2

```bash
# Windows (using PowerShell)
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip

# If permission error on Windows:
icacls "your-key.pem" /inheritance:r
icacls "your-key.pem" /grant:r "%username%:R"
```

#### Step 3: Install Java on EC2

```bash
# For Amazon Linux 2023
sudo yum install java-17-amazon-corretto -y

# For Ubuntu
sudo apt update
sudo apt install openjdk-17-jdk -y

# Verify
java -version
```

#### Step 4: Install MySQL on EC2 (or use RDS)

```bash
# For Amazon Linux
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Secure MySQL
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
```

```sql
CREATE DATABASE quotation_db;
CREATE USER 'quotation_user'@'localhost' IDENTIFIED BY 'Wr250x&@8052';
GRANT ALL PRIVILEGES ON quotation_db.* TO 'quotation_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: Build and Upload Application

**On your local machine:**

```powershell
# Navigate to quotation-service
cd C:\Users\user\Documents\GitHub\Bag-Inventory-Management-System\Backend\quotation-service

# Build JAR file
.\mvnw.cmd clean package -DskipTests

# The JAR will be in: target/quotation-service-0.0.1-SNAPSHOT.jar
```

**Upload to EC2:**

```powershell
# Using SCP
scp -i "your-key.pem" target/quotation-service-0.0.1-SNAPSHOT.jar ec2-user@your-ec2-ip:/home/ec2-user/
```

#### Step 6: Run Application on EC2

```bash
# On EC2 instance
export DB_PASSWORD='Wr250x&@8052'
java -jar quotation-service-0.0.1-SNAPSHOT.jar
```

**Or run as background service:**

```bash
# Create systemd service
sudo nano /etc/systemd/system/quotation-service.service
```

```ini
[Unit]
Description=Quotation Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user
ExecStart=/usr/bin/java -jar /home/ec2-user/quotation-service-0.0.1-SNAPSHOT.jar
Environment="DB_PASSWORD=Wr250x&@8052"
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl start quotation-service
sudo systemctl enable quotation-service

# Check status
sudo systemctl status quotation-service

# View logs
sudo journalctl -u quotation-service -f
```

#### Step 7: Access Your Application

```
http://your-ec2-public-ip:8080/api/quotations
```

---

### Option 2: Deploy to Elastic Beanstalk (Easier Management)

#### Step 1: Install EB CLI

```powershell
pip install awsebcli
```

#### Step 2: Initialize Elastic Beanstalk

```bash
cd C:\Users\user\Documents\GitHub\Bag-Inventory-Management-System\Backend\quotation-service

eb init
```

Select:
- Region: `us-east-1`
- Application name: `quotation-service`
- Platform: `Java`
- Platform version: `Corretto 17`
- SSH: `Yes`

#### Step 3: Create Environment

```bash
eb create quotation-service-env
```

Options:
- Environment name: `quotation-service-env`
- DNS CNAME: `quotation-service`
- Load balancer: `application`

#### Step 4: Set Environment Variables

```bash
eb setenv DB_PASSWORD=Wr250x&@8052 \
          SPRING_DATASOURCE_URL=jdbc:mysql://your-rds-endpoint:3306/quotation_db \
          SPRING_DATASOURCE_USERNAME=admin
```

#### Step 5: Deploy

```bash
eb deploy
```

#### Step 6: Open Application

```bash
eb open
```

Your app will be at: `http://quotation-service.elasticbeanstalk.com`

---

## 🗄️ Database Configuration

### Option 1: Use RDS MySQL (Recommended for Production)

#### Create RDS Instance

1. Go to **AWS Console → RDS → Create database**
2. Configure:
   - **Engine**: MySQL 8.0
   - **Template**: Free tier
   - **DB instance identifier**: `quotation-db`
   - **Master username**: `admin`
   - **Master password**: `Wr250x&@8052`
   - **DB instance class**: `db.t3.micro`
   - **Storage**: 20 GB
   - **Public access**: Yes (for initial setup)
   - **Database name**: `quotation_db`

3. **Security Group**: Allow MySQL (port 3306) from your EC2 security group

#### Get RDS Endpoint

1. Go to **RDS → Databases → quotation-db**
2. Copy **Endpoint** (e.g., `quotation-db.xxxxxx.us-east-1.rds.amazonaws.com`)

#### Update Application Configuration

**For EC2 Deployment:**

Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://quotation-db.xxxxxx.us-east-1.rds.amazonaws.com:3306/quotation_db
spring.datasource.username=admin
spring.datasource.password=${DB_PASSWORD}
```

**For Elastic Beanstalk:**

```bash
eb setenv SPRING_DATASOURCE_URL=jdbc:mysql://quotation-db.xxxxxx.us-east-1.rds.amazonaws.com:3306/quotation_db \
          SPRING_DATASOURCE_USERNAME=admin \
          DB_PASSWORD=Wr250x&@8052
```

### Option 2: Use MySQL on EC2 (For Testing)

Already covered in Quick Start Step 4.

---

## 🔧 Environment Variables

### Required Environment Variables

| Variable                      | Description                | Example                                      |
| ----------------------------- | -------------------------- | -------------------------------------------- |
| `DB_PASSWORD`                 | Database password          | `Wr250x&@8052`                               |
| `SPRING_DATASOURCE_URL`       | Database connection URL    | `jdbc:mysql://localhost:3306/quotation_db`   |
| `SPRING_DATASOURCE_USERNAME`  | Database username          | `admin` or `root`                            |
| `SERVER_PORT`                 | Application port           | `8080`                                       |
| `PRODUCT_SERVICE_URL`         | Product service endpoint   | `http://product-service-ip:8081/api/products`|
| `ORDER_SERVICE_URL`           | Order service endpoint     | `http://order-service-ip:8082`               |

### Set Environment Variables

**On EC2:**
```bash
export DB_PASSWORD='Wr250x&@8052'
export SPRING_DATASOURCE_URL='jdbc:mysql://localhost:3306/quotation_db'
```

**On Elastic Beanstalk:**
```bash
eb setenv DB_PASSWORD=Wr250x&@8052 \
          SPRING_DATASOURCE_URL=jdbc:mysql://your-rds:3306/quotation_db
```

**In systemd service file:**
```ini
Environment="DB_PASSWORD=Wr250x&@8052"
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/quotation_db"
```

---

## 🧪 Testing Deployment

### 1. Health Check

```bash
curl http://your-server:8080/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 2. Test API Endpoints

**Get all quotations:**
```bash
curl http://your-server:8080/api/quotations
```

**Get products:**
```bash
curl http://your-server:8080/api/quotations/products
```

**Create quotation:**
```bash
curl -X POST http://your-server:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "1",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "john@test.com",
    "phone": "+1234567890",
    "items": [
      {
        "productId": 1,
        "quantity": 10
      }
    ]
  }'
```

### 3. Check Logs

**On EC2:**
```bash
# If running as service
sudo journalctl -u quotation-service -f

# If running directly
# Check the console output
```

**On Elastic Beanstalk:**
```bash
eb logs
```

---

## 🔒 Security Best Practices

### 1. Use Security Groups

**EC2 Security Group Rules:**
- SSH (22): Only from your IP
- HTTP (80): From anywhere (if using reverse proxy)
- Custom TCP (8080): From anywhere or specific IPs
- MySQL (3306): Only from EC2 security group (if using RDS)

### 2. Use IAM Roles

Instead of access keys, use IAM roles for EC2:

1. Create IAM role with policies:
   - `AmazonRDSFullAccess` (if using RDS)
   - `AmazonS3ReadOnlyAccess` (if using S3)

2. Attach role to EC2 instance

### 3. Use Secrets Manager (Optional)

Store sensitive data in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
    --name quotation-service/db-password \
    --secret-string "Wr250x&@8052"
```

---

## 💰 Cost Estimation

### Free Tier (First 12 Months)

| Service           | Free Tier                | Cost After Free Tier |
| ----------------- | ------------------------ | -------------------- |
| EC2 (t2.micro)    | 750 hours/month          | ~$8-10/month         |
| RDS (db.t3.micro) | 750 hours/month          | ~$15/month           |
| Data Transfer     | 15 GB/month              | $0.09/GB             |
| Elastic Beanstalk | Free (pay for resources) | No additional cost   |

**Total estimated cost after free tier: $25-30/month**

### Cost Optimization Tips

1. **Use t2.micro or t3.micro** instances (free tier eligible)
2. **Stop instances** when not in use (development)
3. **Use RDS only for production**, MySQL on EC2 for testing
4. **Monitor usage** with AWS Cost Explorer
5. **Set up billing alerts**

---

## 🚀 Deployment Scripts

### Build and Deploy Script (PowerShell)

Create `deploy-to-aws.ps1`:

```powershell
# Build and Deploy to AWS EC2

$EC2_IP = "your-ec2-public-ip"
$KEY_FILE = "path/to/your-key.pem"
$EC2_USER = "ec2-user"

Write-Host "Building application..." -ForegroundColor Green
.\mvnw.cmd clean package -DskipTests

Write-Host "Uploading to EC2..." -ForegroundColor Green
scp -i $KEY_FILE target/quotation-service-0.0.1-SNAPSHOT.jar ${EC2_USER}@${EC2_IP}:/home/ec2-user/

Write-Host "Restarting service..." -ForegroundColor Green
ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} "sudo systemctl restart quotation-service"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Access at: http://${EC2_IP}:8080/api/quotations" -ForegroundColor Cyan
```

### Deploy to Elastic Beanstalk Script

Create `deploy-to-eb.ps1`:

```powershell
# Build and Deploy to Elastic Beanstalk

Write-Host "Building application..." -ForegroundColor Green
.\mvnw.cmd clean package -DskipTests

Write-Host "Deploying to Elastic Beanstalk..." -ForegroundColor Green
eb deploy

Write-Host "Deployment complete!" -ForegroundColor Green
eb open
```

---

## 📝 Deployment Checklist

- [ ] AWS account created and configured
- [ ] AWS CLI installed and configured
- [ ] EC2 instance created (or EB environment)
- [ ] Security groups configured
- [ ] Java 17 installed on EC2
- [ ] MySQL database setup (EC2 or RDS)
- [ ] Application built as JAR
- [ ] Environment variables configured
- [ ] Application deployed and running
- [ ] API endpoints tested
- [ ] Logs verified
- [ ] Frontend updated with new API URL

---

## 🔗 Integration with Other Services

### Update Frontend Configuration

Update `frontend/.env.production`:

```env
VITE_API_URL=http://your-ec2-ip:8080/api
# or
VITE_API_URL=http://quotation-service.elasticbeanstalk.com/api
```

### Connect to Product Service

If Product Service is also on AWS:

```properties
product.service.url=http://product-service-ec2-ip:8081/api/products
```

### Connect to Order Management Service

```properties
order.service.url=http://order-service-ec2-ip:8082
```

---

## 🆘 Troubleshooting

### Application Won't Start

**Check logs:**
```bash
sudo journalctl -u quotation-service -n 100
```

**Common issues:**
- Database connection failed → Check DB credentials and security group
- Port already in use → Change port or kill existing process
- Out of memory → Increase EC2 instance size

### Can't Connect to Database

**Test connection:**
```bash
mysql -h your-rds-endpoint -u admin -p
```

**Check:**
- Security group allows MySQL (3306)
- RDS is publicly accessible (for testing)
- Credentials are correct

### API Returns 404

**Check:**
- Application is running: `sudo systemctl status quotation-service`
- Port 8080 is open in security group
- URL is correct: `http://ip:8080/api/quotations`

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Spring Boot on AWS](https://spring.io/guides/gs/spring-boot-aws/)

---

**Your Quotation Service is ready for AWS deployment! ☁️🚀**

For questions or issues, refer to the troubleshooting section or AWS documentation.
