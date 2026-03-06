# 🚀 AWS Quick Start - Quotation Service

Get your Quotation Service running on AWS in 30 minutes!

---

## 📋 What You'll Need

- AWS Account (free tier available)
- AWS CLI installed and configured
- Your quotation service code
- 30 minutes of time

---

## ⚡ Quick Deploy Steps

### Step 1: Create EC2 Instance (5 minutes)

1. Go to **AWS Console → EC2 → Launch Instance**
2. Configure:
   ```
   Name: quotation-service
   AMI: Amazon Linux 2023
   Instance type: t2.micro (Free tier)
   Key pair: Create new → Download .pem file
   ```
3. **Security Group** - Add rules:
   ```
   SSH (22): Your IP
   Custom TCP (8080): Anywhere (0.0.0.0/0)
   MySQL (3306): Your IP (if using RDS)
   ```
4. Click **Launch Instance**
5. Wait 2 minutes for instance to start
6. Copy **Public IPv4 address**

### Step 2: Connect to EC2 (2 minutes)

**Windows PowerShell:**
```powershell
# Fix permissions on key file
icacls "your-key.pem" /inheritance:r
icacls "your-key.pem" /grant:r "%username%:R"

# Connect
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP
```

### Step 3: Setup EC2 (5 minutes)

**On EC2 instance:**
```bash
# Upload and run setup script
# (First, upload the setup script from your local machine)
```

**On your local machine:**
```powershell
scp -i "your-key.pem" Backend/quotation-service/setup-ec2-service.sh ec2-user@YOUR-EC2-IP:/home/ec2-user/
```

**Back on EC2:**
```bash
chmod +x setup-ec2-service.sh
sudo ./setup-ec2-service.sh
```

This script will:
- ✅ Install Java 17
- ✅ Install MySQL
- ✅ Create database
- ✅ Setup systemd service

### Step 4: Build and Deploy (10 minutes)

**On your local machine:**

```powershell
# Navigate to quotation service
cd C:\Users\user\Documents\GitHub\Bag-Inventory-Management-System\Backend\quotation-service

# Build JAR
.\mvnw.cmd clean package -DskipTests

# Upload to EC2
scp -i "your-key.pem" target/quotation-service-0.0.1-SNAPSHOT.jar ec2-user@YOUR-EC2-IP:/home/ec2-user/

# Start service
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP "sudo systemctl start quotation-service"
```

### Step 5: Test Deployment (3 minutes)

```powershell
# Test health endpoint
curl http://YOUR-EC2-IP:8080/actuator/health

# Test API
curl http://YOUR-EC2-IP:8080/api/quotations
```

**Expected response:**
```json
{
  "status": "UP"
}
```

### Step 6: Update Frontend (5 minutes)

Update your frontend configuration:

**File:** `frontend/.env.production`
```env
VITE_API_URL=http://YOUR-EC2-IP:8080/api
```

Rebuild and deploy frontend:
```powershell
cd frontend
npm run build
```

---

## 🎯 You're Done!

Your Quotation Service is now running on AWS!

**Access your API at:**
```
http://YOUR-EC2-IP:8080/api/quotations
```

---

## 🔧 Useful Commands

### Check Service Status
```bash
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP "sudo systemctl status quotation-service"
```

### View Logs
```bash
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP "sudo journalctl -u quotation-service -f"
```

### Restart Service
```bash
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP "sudo systemctl restart quotation-service"
```

### Redeploy After Changes
```powershell
# Build
.\mvnw.cmd clean package -DskipTests

# Upload
scp -i "your-key.pem" target/quotation-service-0.0.1-SNAPSHOT.jar ec2-user@YOUR-EC2-IP:/home/ec2-user/

# Restart
ssh -i "your-key.pem" ec2-user@YOUR-EC2-IP "sudo systemctl restart quotation-service"
```

---

## 🚨 Troubleshooting

### Service Won't Start

**Check logs:**
```bash
sudo journalctl -u quotation-service -n 100
```

**Common issues:**
- Database not running: `sudo systemctl start mysqld`
- Wrong password: Check DB_PASSWORD in service file
- Port in use: `sudo lsof -i :8080`

### Can't Connect from Browser

**Check security group:**
1. Go to EC2 → Security Groups
2. Find your instance's security group
3. Ensure port 8080 is open to 0.0.0.0/0

### Database Connection Failed

**Test MySQL:**
```bash
mysql -u quotation_user -p quotation_db
# Password: Wr250x&@8052
```

**If fails, recreate database:**
```bash
sudo mysql -u root -p
```
```sql
DROP DATABASE IF EXISTS quotation_db;
CREATE DATABASE quotation_db;
CREATE USER 'quotation_user'@'localhost' IDENTIFIED BY 'Wr250x&@8052';
GRANT ALL PRIVILEGES ON quotation_db.* TO 'quotation_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 💰 Cost

**Free Tier (First 12 months):**
- EC2 t2.micro: 750 hours/month FREE
- Data transfer: 15 GB/month FREE

**After free tier:**
- ~$8-10/month for t2.micro instance

---

## 📚 Next Steps

1. ✅ **Setup RDS** for production database (see AWS_DEPLOYMENT_GUIDE.md)
2. ✅ **Add HTTPS** with Let's Encrypt or AWS Certificate Manager
3. ✅ **Setup CloudWatch** for monitoring
4. ✅ **Configure Auto Scaling** for high availability
5. ✅ **Add Load Balancer** for multiple instances

---

## 🆘 Need Help?

- Check **AWS_DEPLOYMENT_GUIDE.md** for detailed instructions
- View logs: `sudo journalctl -u quotation-service -f`
- AWS Support: https://console.aws.amazon.com/support/

---

**Congratulations! Your Quotation Service is live on AWS! 🎉**
