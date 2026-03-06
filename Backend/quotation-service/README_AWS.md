# ☁️ AWS Cloud Integration - Quotation Service

Complete AWS deployment package for your Quotation Management Service.

---

## 📦 What's Included

This package contains everything you need to deploy your Quotation Service to AWS:

### 📄 Documentation
1. **AWS_QUICK_START.md** - Get started in 30 minutes
2. **AWS_DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
3. **README_AWS.md** - This file

### 🛠️ Scripts
1. **deploy-to-ec2.ps1** - Automated deployment script (Windows)
2. **setup-ec2-service.sh** - EC2 instance setup script (Linux)

---

## 🚀 Quick Start

### For Beginners (30 minutes)

Follow **AWS_QUICK_START.md** for step-by-step instructions:

1. Create EC2 instance
2. Connect to EC2
3. Setup environment
4. Deploy application
5. Test deployment

### For Experienced Users (15 minutes)

```powershell
# 1. Create EC2 instance (t2.micro, Amazon Linux 2023)
# 2. Configure security group (ports 22, 8080, 3306)
# 3. Upload and run setup script
scp -i "key.pem" setup-ec2-service.sh ec2-user@EC2-IP:/home/ec2-user/
ssh -i "key.pem" ec2-user@EC2-IP "chmod +x setup-ec2-service.sh && sudo ./setup-ec2-service.sh"

# 4. Deploy application
.\deploy-to-ec2.ps1 -EC2_IP "your-ip" -KEY_FILE "your-key.pem"
```

---

## 🎯 Deployment Options

### Option 1: EC2 with MySQL (Recommended for Learning)
- **Cost**: ~$8-10/month (free for 12 months)
- **Setup Time**: 30 minutes
- **Best For**: Development, testing, learning AWS
- **Guide**: AWS_QUICK_START.md

### Option 2: EC2 with RDS (Recommended for Production)
- **Cost**: ~$25-30/month (free tier available)
- **Setup Time**: 45 minutes
- **Best For**: Production, scalability
- **Guide**: AWS_DEPLOYMENT_GUIDE.md → Database Configuration

### Option 3: Elastic Beanstalk (Easiest Management)
- **Cost**: ~$30-40/month
- **Setup Time**: 20 minutes
- **Best For**: Easy management, auto-scaling
- **Guide**: AWS_DEPLOYMENT_GUIDE.md → Option 2

---

## 📋 Prerequisites

### Required
- ✅ AWS Account (create at https://aws.amazon.com)
- ✅ AWS CLI installed and configured
- ✅ Java 17+ installed locally
- ✅ Maven installed (or use mvnw)

### Optional
- SSH client (built-in on Windows 10+)
- Elastic Beanstalk CLI (for EB deployment)

---

## 🔧 Configuration

### Environment Variables

Your application needs these environment variables:

| Variable                    | Description           | Example                                    |
| --------------------------- | --------------------- | ------------------------------------------ |
| `DB_PASSWORD`               | Database password     | `Wr250x&@8052`                             |
| `SPRING_DATASOURCE_URL`     | Database URL          | `jdbc:mysql://localhost:3306/quotation_db` |
| `SPRING_DATASOURCE_USERNAME`| Database username     | `quotation_user`                           |
| `PRODUCT_SERVICE_URL`       | Product service URL   | `http://product-ip:8081/api/products`      |
| `ORDER_SERVICE_URL`         | Order service URL     | `http://order-ip:8082`                     |

### Security Groups

**Required Ports:**
- **22** (SSH): Your IP only
- **8080** (API): 0.0.0.0/0 (or specific IPs)
- **3306** (MySQL): EC2 security group only (if using RDS)

---

## 🧪 Testing Your Deployment

### 1. Health Check
```bash
curl http://YOUR-EC2-IP:8080/actuator/health
```

### 2. API Test
```bash
# Get all quotations
curl http://YOUR-EC2-IP:8080/api/quotations

# Get products
curl http://YOUR-EC2-IP:8080/api/quotations/products
```

### 3. Create Test Quotation
```bash
curl -X POST http://YOUR-EC2-IP:8080/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "1",
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "test@example.com",
    "phone": "+1234567890",
    "items": [{"productId": 1, "quantity": 10}]
  }'
```

---

## 🔄 Continuous Deployment

### Automated Deployment Script

Use `deploy-to-ec2.ps1` for easy redeployment:

```powershell
.\deploy-to-ec2.ps1 -EC2_IP "54.123.45.67" -KEY_FILE "my-key.pem"
```

This script will:
1. Build your application
2. Upload JAR to EC2
3. Restart the service
4. Verify deployment

### Manual Deployment

```powershell
# Build
.\mvnw.cmd clean package -DskipTests

# Upload
scp -i "key.pem" target/quotation-service-0.0.1-SNAPSHOT.jar ec2-user@EC2-IP:/home/ec2-user/

# Restart
ssh -i "key.pem" ec2-user@EC2-IP "sudo systemctl restart quotation-service"
```

---

## 📊 Monitoring

### View Logs
```bash
ssh -i "key.pem" ec2-user@EC2-IP "sudo journalctl -u quotation-service -f"
```

### Check Service Status
```bash
ssh -i "key.pem" ec2-user@EC2-IP "sudo systemctl status quotation-service"
```

### Monitor Resources
```bash
ssh -i "key.pem" ec2-user@EC2-IP "top"
```

---

## 💰 Cost Breakdown

### Free Tier (First 12 Months)
- EC2 t2.micro: **FREE** (750 hours/month)
- RDS db.t3.micro: **FREE** (750 hours/month)
- Data Transfer: **FREE** (15 GB/month)

### After Free Tier
- EC2 t2.micro: ~$8-10/month
- RDS db.t3.micro: ~$15/month
- Data Transfer: $0.09/GB
- **Total**: ~$25-30/month

### Cost Optimization
- Use t2.micro or t3.micro instances
- Stop instances when not in use
- Use MySQL on EC2 for development
- Monitor usage with AWS Cost Explorer

---

## 🔒 Security Best Practices

1. **Use Security Groups** - Restrict access by IP
2. **Use IAM Roles** - Instead of access keys
3. **Enable HTTPS** - Use Let's Encrypt or AWS Certificate Manager
4. **Regular Updates** - Keep OS and Java updated
5. **Backup Database** - Use RDS automated backups
6. **Monitor Logs** - Use CloudWatch for alerts

---

## 🆘 Troubleshooting

### Common Issues

**Service won't start:**
```bash
sudo journalctl -u quotation-service -n 100
```

**Can't connect to database:**
```bash
mysql -h localhost -u quotation_user -p quotation_db
```

**Port 8080 not accessible:**
- Check security group rules
- Verify service is running
- Check firewall: `sudo firewall-cmd --list-all`

**Out of memory:**
- Increase EC2 instance size
- Add swap space
- Optimize JVM settings

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Spring Boot on AWS](https://spring.io/guides/gs/spring-boot-aws/)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

## 🎓 Learning Path

1. **Start Here**: AWS_QUICK_START.md (30 min)
2. **Deep Dive**: AWS_DEPLOYMENT_GUIDE.md (2 hours)
3. **Practice**: Deploy to EC2
4. **Advanced**: Setup RDS, Load Balancer, Auto Scaling
5. **Production**: HTTPS, CloudWatch, Backups

---

## 📞 Support

**Need Help?**
- Check troubleshooting section
- Review AWS documentation
- Check service logs
- AWS Support: https://console.aws.amazon.com/support/

---

## ✅ Deployment Checklist

- [ ] AWS account created
- [ ] AWS CLI configured
- [ ] EC2 instance created
- [ ] Security groups configured
- [ ] Application built
- [ ] Setup script executed
- [ ] Application deployed
- [ ] Health check passed
- [ ] API endpoints tested
- [ ] Frontend updated with new URL
- [ ] Monitoring configured
- [ ] Backups enabled

---

**Ready to deploy? Start with AWS_QUICK_START.md! 🚀**

For detailed instructions, see AWS_DEPLOYMENT_GUIDE.md
