# Quotation Service - Cloud Deployment Guide

## Overview
This guide explains how to deploy the Quotation Service microservice to cloud platforms.

---

## Prerequisites
- Cloud account (AWS/Azure/GCP/Heroku)
- Docker installed
- Cloud CLI tools installed
- Database ready (MySQL)

---

## Deployment Options

### Option 1: Heroku (Easiest)

#### Step 1: Install Heroku CLI
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login and Create App
```bash
heroku login
heroku create your-quotation-service
```

#### Step 3: Add MySQL Database
```bash
heroku addons:create jawsdb:kitefin
```

#### Step 4: Deploy
```bash
# Set to container stack
heroku stack:set container

# Deploy
git push heroku main
```

#### Step 5: Set Environment Variables
```bash
heroku config:set SPRING_PROFILES_ACTIVE=cloud
```

---

### Option 2: AWS (Production)

#### Step 1: Create ECR Repository
```bash
aws ecr create-repository --repository-name quotation-service
```

#### Step 2: Build and Push Docker Image
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t quotation-service .

# Tag
docker tag quotation-service:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest

# Push
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/quotation-service:latest
```

#### Step 3: Create RDS MySQL Database
```bash
aws rds create-db-instance \
    --db-instance-identifier quotation-db \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password YOUR_PASSWORD \
    --allocated-storage 20
```

#### Step 4: Deploy to ECS
```bash
# Create cluster
aws ecs create-cluster --cluster-name quotation-cluster

# Create task definition (use provided JSON)
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service \
    --cluster quotation-cluster \
    --service-name quotation-service \
    --task-definition quotation-task \
    --desired-count 1
```

---

### Option 3: Google Cloud Run

#### Step 1: Build and Push
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/quotation-service
```

#### Step 2: Deploy
```bash
gcloud run deploy quotation-service \
    --image gcr.io/YOUR_PROJECT/quotation-service \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

---

## Environment Variables

Set these environment variables in your cloud platform:

```
SPRING_PROFILES_ACTIVE=cloud
DATABASE_URL=jdbc:mysql://your-db-host:3306/quotation_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
PRODUCT_SERVICE_URL=http://product-service-url/api/products
ORDER_SERVICE_URL=http://order-service-url/api/orders
```

---

## Health Check Endpoint

Your cloud platform should monitor:
```
GET /actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

---

## Scaling

### Heroku
```bash
heroku ps:scale web=2
```

### AWS ECS
```bash
aws ecs update-service \
    --cluster quotation-cluster \
    --service quotation-service \
    --desired-count 3
```

### Google Cloud Run
Automatically scales based on traffic

---

## Monitoring

### View Logs

**Heroku:**
```bash
heroku logs --tail
```

**AWS:**
```bash
aws logs tail /ecs/quotation-service --follow
```

**GCP:**
```bash
gcloud logging read "resource.type=cloud_run_revision"
```

---

## Cost Estimates

### Heroku
- Free tier: Limited hours
- Hobby: $7/month
- Database: $10/month
**Total: ~$17/month**

### AWS
- ECS Fargate: ~$15/month
- RDS MySQL: ~$15/month
**Total: ~$30/month**

### Google Cloud
- Cloud Run: Pay per use (~$5-10/month)
- Cloud SQL: ~$15/month
**Total: ~$20-25/month**

---

## Troubleshooting

### Application Won't Start
1. Check logs
2. Verify database connection
3. Check environment variables
4. Verify Docker image builds locally

### Database Connection Failed
1. Check DATABASE_URL format
2. Verify database is accessible
3. Check firewall rules
4. Verify credentials

### High Response Time
1. Check database performance
2. Increase instance size
3. Enable caching
4. Optimize queries

---

## Security Checklist

- [ ] Use HTTPS
- [ ] Store secrets in environment variables
- [ ] Enable database encryption
- [ ] Configure firewall rules
- [ ] Use IAM roles (AWS)
- [ ] Enable audit logging
- [ ] Regular security updates

---

## Next Steps

1. Choose cloud platform
2. Create account
3. Setup database
4. Deploy application
5. Configure domain (optional)
6. Setup monitoring
7. Configure auto-scaling

---

**Your microservice is ready for cloud deployment!** ☁️
