# 🚀 Deploy to AWS NOW - Quick Instructions

## ⚡ 5-Minute AWS Deployment

### Prerequisites
- AWS Account
- EC2 Key Pair (.pem file)

### Step 1: Create EC2 Instance (2 minutes)
1. Go to [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click "Launch Instance"
3. Configure:
   - **Name**: `quotation-service`
   - **AMI**: Amazon Linux 2023
   - **Instance Type**: t2.micro (Free tier)
   - **Key Pair**: Select existing or create new
   - **Security Group**: Allow SSH (22) and Custom TCP (8080)
4. Launch and wait for "Running" status
5. **Copy the Public IPv4 address** (e.g., `3.227.243.51`)

### Step 2: Deploy Backend (2 minutes)
```powershell
# Run this command (replace with your values)
cd Backend/quotation-service
.\deploy-to-aws.ps1 -EC2_IP "3.227.243.51" -KEY_FILE "C:\path\to\your-key.pem"
```

### Step 3: Deploy Frontend (1 minute)
```powershell
# Create S3 bucket first, then run:
cd frontend
.\deploy-to-s3.ps1 -BUCKET_NAME "quotation-app-yourname" -BACKEND_URL "http://3.227.243.51:8080/api"
```

## 🎯 That's it! Your system is now on AWS!

### Access Your Application
- **API**: `http://YOUR-EC2-IP:8080/api/quotations`
- **Frontend**: `http://your-bucket.s3-website-us-east-1.amazonaws.com`
- **Health Check**: `http://YOUR-EC2-IP:8080/actuator/health`

### Test It Works
```bash
# Test API
curl http://YOUR-EC2-IP:8080/api/quotations

# Should return JSON with quotations
```

## 🔧 Manual Steps (if scripts don't work)

### Backend Manual
1. Build: `mvn clean package -DskipTests`
2. Upload: `scp -i key.pem target/*.jar ec2-user@IP:/home/ec2-user/`
3. SSH: `ssh -i key.pem ec2-user@IP`
4. Run: `java -jar quotation-service-0.0.1-SNAPSHOT.jar`

### Frontend Manual
1. Update `.env.production`: `VITE_API_URL=http://YOUR-IP:8080/api`
2. Build: `npm run build`
3. Upload: `aws s3 sync dist/ s3://bucket-name`

## 💰 Cost
- **Free Tier**: $0/month for 12 months
- **After Free Tier**: ~$10-15/month

## 🆘 Need Help?
- Check `AWS_DEPLOYMENT_COMPLETE_GUIDE.md` for detailed instructions
- AWS Support: https://console.aws.amazon.com/support/

---
**🎉 Your Quotation Management System is AWS Cloud Ready!**