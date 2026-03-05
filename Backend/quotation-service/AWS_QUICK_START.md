# AWS Quick Start - Quotation Service

## 🚀 Deploy in 5 Minutes

### Prerequisites
- AWS Account
- AWS CLI installed and configured
- Docker installed

---

## Option 1: Automated Deployment (Recommended)

### Windows:
```bash
cd Backend/quotation-service
deploy-to-aws.bat
```

### Linux/Mac:
```bash
cd Backend/quotation-service
chmod +x deploy-to-aws.sh
./deploy-to-aws.sh
```

The script will:
1. ✅ Create RDS MySQL database
2. ✅ Build and push Docker image to ECR
3. ✅ Store credentials in Secrets Manager
4. ✅ Create ECS cluster and service
5. ✅ Deploy your application

**Time:** ~10-15 minutes (first time)

---

## Option 2: Manual Deployment

### Step 1: Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: us-east-1
# Enter output format: json
```

### Step 2: Run Deployment Script
```bash
./deploy-to-aws.sh
```

### Step 3: Access Your Service
```bash
# Get service public IP
aws ecs list-tasks --cluster quotation-cluster --service-name quotation-service

# Test health endpoint
curl http://YOUR-PUBLIC-IP:8080/actuator/health
```

---

## Verify Deployment

### Check Service Status
```bash
aws ecs describe-services \
    --cluster quotation-cluster \
    --services quotation-service \
    --query 'services[0].status'
```

### View Logs
```bash
aws logs tail /ecs/quotation-service --follow
```

### Test API
```bash
# Health check
curl http://YOUR-IP:8080/actuator/health

# Get products
curl http://YOUR-IP:8080/api/quotations/products
```

---

## Common Issues

### Issue: AWS CLI not configured
**Solution:**
```bash
aws configure
```

### Issue: Docker not running
**Solution:** Start Docker Desktop

### Issue: Permission denied
**Solution:** 
```bash
chmod +x deploy-to-aws.sh
```

### Issue: Database connection failed
**Solution:** Wait 2-3 minutes for database to initialize

---

## Cost

### Free Tier (First 12 months)
- RDS: 750 hours/month
- ECS: 50 GB storage
- **Cost: $0/month**

### After Free Tier
- **Cost: ~$30-40/month**

---

## Update Deployment

To update your service with new code:

```bash
# Rebuild and push image
./deploy-to-aws.sh

# Or manually
docker build -t quotation-service .
docker push YOUR-ECR-REPO:latest

# Force new deployment
aws ecs update-service \
    --cluster quotation-cluster \
    --service quotation-service \
    --force-new-deployment
```

---

## Cleanup

To delete all resources:

```bash
# Delete service
aws ecs delete-service --cluster quotation-cluster --service quotation-service --force

# Delete cluster
aws ecs delete-cluster --cluster quotation-cluster

# Delete database
aws rds delete-db-instance --db-instance-identifier quotation-db --skip-final-snapshot

# Delete ECR repository
aws ecr delete-repository --repository-name quotation-service --force
```

---

## Next Steps

1. ✅ Deploy to AWS
2. ⏭️ Setup custom domain
3. ⏭️ Enable HTTPS
4. ⏭️ Configure auto-scaling
5. ⏭️ Setup monitoring

---

**Need help?** Read the full guide: `AWS_DEPLOYMENT_GUIDE.md`
