# 🚀 Complete AWS Deployment Guide - Quotation Management System

## 📋 Prerequisites
- AWS Account with CLI configured
- EC2 Key Pair (.pem file)
- S3 bucket for frontend hosting

## 🎯 Quick Deployment (30 minutes)

### Step 1: Create AWS Infrastructure

#### 1.1 Create EC2 Instance
```bash
# Go to AWS Console → EC2 → Launch Instance
Name: quotation-service
AMI: Amazon Linux 2023
Instance Type: t2.micro (Free tier)
Key Pair: Create new or use existing
Security Group: Allow SSH (22), HTTP (80), Custom TCP (8080)
```

#### 1.2 Create S3 Bucket for Frontend
```bash
# Go to AWS Console → S3 → Create Bucket
Bucket Name: quotation-frontend-[your-name]
Region: us-east-1
Public Access: Allow (for website hosting)
```

### Step 2: Deploy Backend to EC2

#### 2.1 Get EC2 Public IP
```bash
# From AWS Console → EC2 → Instances
# Copy the Public IPv4 address (e.g., 3.227.243.51)
```

#### 2.2 Deploy Backend
```powershell
# Run from Backend/quotation-service directory
.\deploy-to-aws.ps1 -EC2_IP "3.227.243.51" -KEY_FILE "path\to\your-key.pem"
```

### Step 3: Deploy Frontend to S3

#### 3.1 Deploy Frontend
```powershell
# Run from frontend directory
.\deploy-to-s3.ps1 -BUCKET_NAME "quotation-frontend-yourname" -BACKEND_URL "http://3.227.243.51:8080/api"
```

### Step 4: Test Deployment

#### 4.1 Test Backend API
```bash
# Health check
curl http://3.227.243.51:8080/actuator/health

# Get quotations
curl http://3.227.243.51:8080/api/quotations
```

#### 4.2 Test Frontend
```bash
# Open in browser
http://quotation-frontend-yourname.s3-website-us-east-1.amazonaws.com
```

## 🔧 Manual Deployment Steps

### Backend Manual Deployment

1. **Build JAR file:**
```bash
cd Backend/quotation-service
mvn clean package -DskipTests
```

2. **Upload to EC2:**
```bash
scp -i your-key.pem target/quotation-service-0.0.1-SNAPSHOT.jar ec2-user@YOUR-EC2-IP:/home/ec2-user/
scp -i your-key.pem setup-ec2-service.sh ec2-user@YOUR-EC2-IP:/home/ec2-user/
```

3. **Setup on EC2:**
```bash
ssh -i your-key.pem ec2-user@YOUR-EC2-IP
chmod +x setup-ec2-service.sh
sudo ./setup-ec2-service.sh
```

### Frontend Manual Deployment

1. **Update environment:**
```bash
# Edit frontend/.env.production
VITE_API_URL=http://YOUR-EC2-IP:8080/api
```

2. **Build and deploy:**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws s3 website s3://your-bucket-name --index-document index.html
```

## 🌐 Current System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (S3 + CF)     │───▶│   (EC2)         │───▶│   (RDS MySQL)   │
│   React App     │    │   Spring Boot   │    │   AWS Cloud     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 AWS Services Used

| Service | Purpose | Cost (Free Tier) |
|---------|---------|------------------|
| EC2 t2.micro | Backend hosting | FREE (12 months) |
| RDS MySQL | Database | Already configured |
| S3 | Frontend hosting | ~$1-2/month |
| CloudFront | CDN (optional) | FREE tier available |

## 🔍 Monitoring & Maintenance

### Check Service Status
```bash
ssh -i your-key.pem ec2-user@YOUR-EC2-IP
sudo systemctl status quotation-service
sudo journalctl -u quotation-service -f
```

### Update Deployment
```bash
# Rebuild and redeploy
.\deploy-to-aws.ps1 -EC2_IP "YOUR-IP" -KEY_FILE "your-key.pem"
```

### Backup Database
```bash
# RDS automated backups are enabled by default
# Manual snapshot: AWS Console → RDS → Snapshots
```

## 🚨 Troubleshooting

### Backend Issues
- **Service won't start**: Check Java installation and logs
- **Database connection**: Verify RDS security group allows EC2
- **Port 8080 blocked**: Check EC2 security group

### Frontend Issues
- **S3 access denied**: Check bucket policy and public access
- **API calls fail**: Verify CORS configuration and backend URL

### Common Solutions
```bash
# Restart backend service
sudo systemctl restart quotation-service

# Check backend logs
sudo journalctl -u quotation-service -n 50

# Test API directly
curl http://localhost:8080/actuator/health
```

## 🎉 Success Criteria

✅ Backend API responds at: `http://YOUR-EC2-IP:8080/api/quotations`
✅ Frontend loads at: `http://your-bucket.s3-website-us-east-1.amazonaws.com`
✅ Database operations work (create, read, update quotations)
✅ Admin and user interfaces function correctly

## 📞 Support

- AWS Documentation: https://docs.aws.amazon.com/
- Spring Boot on AWS: https://spring.io/guides/gs/spring-boot-aws/
- React S3 Deployment: https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html

---

**🎯 Your Quotation Management System is now running on AWS Cloud!**