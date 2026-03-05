# How to View Your Backend in AWS Console

## 🌐 Current Backend URL
**Working Backend:** http://18.204.16.14:8080/api

---

## 📊 View in AWS Console

### Step 1: Login to AWS Console
1. Go to https://console.aws.amazon.com
2. Sign in with your AWS account
3. Make sure you're in the **us-east-1** (N. Virginia) region (top right corner)

---

### Step 2: View ECS Service (Your Running Application)

1. **Go to ECS:**
   - Search for "ECS" in the top search bar
   - Click on "Elastic Container Service"

2. **View Your Cluster:**
   - Click on "Clusters" in the left menu
   - Click on **"quotation-cluster"**

3. **View Your Service:**
   - Under "Services" tab, click on **"quotation-service"**
   - Here you can see:
     - ✅ **Status**: Should be "ACTIVE"
     - ✅ **Running tasks**: Should be 1-2
     - ✅ **Desired tasks**: Should be 1

4. **View Running Tasks:**
   - Click on the "Tasks" tab
   - You'll see your running containers
   - Click on a task ID to see details
   - Under "Configuration" → "Network" you'll find the **Public IP**

5. **View Logs:**
   - Click on a task
   - Click on "Logs" tab
   - You'll see real-time application logs

**Direct Link:**
```
https://us-east-1.console.aws.amazon.com/ecs/v2/clusters/quotation-cluster/services/quotation-service
```

---

### Step 3: View RDS Database

1. **Go to RDS:**
   - Search for "RDS" in the top search bar
   - Click on "RDS"

2. **View Your Database:**
   - Click on "Databases" in the left menu
   - Click on **"quotation-db"**
   - Here you can see:
     - ✅ **Status**: Should be "Available"
     - ✅ **Endpoint**: quotation-db.cotiiqy2i9ps.us-east-1.rds.amazonaws.com
     - ✅ **Engine**: MySQL 8.0.40
     - ✅ **Size**: db.t3.micro

**Direct Link:**
```
https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#database:id=quotation-db
```

---

### Step 4: View Docker Images (ECR)

1. **Go to ECR:**
   - Search for "ECR" in the top search bar
   - Click on "Elastic Container Registry"

2. **View Your Repository:**
   - Click on **"quotation-service"**
   - You'll see all your Docker images with tags
   - Latest image should have tag "latest"

**Direct Link:**
```
https://us-east-1.console.aws.amazon.com/ecr/repositories/private/468284644046/quotation-service
```

---

### Step 5: View Logs (CloudWatch)

1. **Go to CloudWatch:**
   - Search for "CloudWatch" in the top search bar
   - Click on "CloudWatch"

2. **View Application Logs:**
   - Click on "Log groups" in the left menu
   - Click on **/ecs/quotation-service**
   - Click on any log stream to see logs
   - You can see real-time application logs here

**Direct Link:**
```
https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Fecs$252Fquotation-service
```

---

### Step 6: View Secrets (Secrets Manager)

1. **Go to Secrets Manager:**
   - Search for "Secrets Manager" in the top search bar
   - Click on "Secrets Manager"

2. **View Your Secrets:**
   - You'll see:
     - **quotation-db-url** - Database connection URL
     - **quotation-db-password** - Database password

**Direct Link:**
```
https://us-east-1.console.aws.amazon.com/secretsmanager/listsecrets?region=us-east-1
```

---

## 🔍 Quick Health Checks

### Check if Backend is Running
```bash
curl http://18.204.16.14:8080/api/quotations/products
```

### Check ECS Service Status
```bash
aws ecs describe-services --cluster quotation-cluster --services quotation-service --region us-east-1 --query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount}'
```

### Check Database Status
```bash
aws rds describe-db-instances --db-instance-identifier quotation-db --region us-east-1 --query 'DBInstances[0].{Status:DBInstanceStatus,Endpoint:Endpoint.Address}'
```

### View Recent Logs
```bash
aws logs tail /ecs/quotation-service --follow --region us-east-1
```

---

## 🐛 Troubleshooting in AWS Console

### Problem: Service Not Running

1. Go to ECS → Clusters → quotation-cluster → quotation-service
2. Check "Events" tab for error messages
3. Click on "Tasks" tab
4. If tasks are stopping, click on a stopped task
5. Look at "Stopped reason" for error details

### Problem: Can't Connect to Backend

1. **Check Task Status:**
   - Go to ECS → Tasks
   - Make sure at least 1 task is "RUNNING"

2. **Check Security Group:**
   - Go to EC2 → Security Groups
   - Find "quotation-service-sg"
   - Make sure port 8080 is open (0.0.0.0/0)

3. **Get Current IP:**
   - Go to ECS → Tasks → Click on running task
   - Under "Configuration" → "Network" → Copy "Public IP"
   - Update frontend/.env.production with new IP

### Problem: Database Connection Failed

1. **Check RDS Status:**
   - Go to RDS → Databases → quotation-db
   - Status should be "Available"

2. **Check Security Group:**
   - Click on the database
   - Under "Connectivity & security" → "VPC security groups"
   - Make sure ECS security group can access port 3306

---

## 📱 AWS Mobile App

You can also monitor your services using the AWS Console Mobile App:

1. Download "AWS Console" app from App Store or Google Play
2. Sign in with your AWS account
3. Navigate to ECS, RDS, CloudWatch to monitor your services

---

## 💡 Useful AWS Console Shortcuts

| Service | Direct Link |
|---------|-------------|
| ECS Service | https://us-east-1.console.aws.amazon.com/ecs/v2/clusters/quotation-cluster/services/quotation-service |
| RDS Database | https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#database:id=quotation-db |
| CloudWatch Logs | https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Fecs$252Fquotation-service |
| ECR Repository | https://us-east-1.console.aws.amazon.com/ecr/repositories/private/468284644046/quotation-service |
| Secrets Manager | https://us-east-1.console.aws.amazon.com/secretsmanager/listsecrets?region=us-east-1 |

---

## 🎯 Quick Actions

### Restart Service
```bash
aws ecs update-service --cluster quotation-cluster --service quotation-service --force-new-deployment --region us-east-1
```

### Scale Service
```bash
# Scale to 2 tasks
aws ecs update-service --cluster quotation-cluster --service quotation-service --desired-count 2 --region us-east-1

# Scale to 1 task
aws ecs update-service --cluster quotation-cluster --service quotation-service --desired-count 1 --region us-east-1
```

### Stop Service (to save costs)
```bash
aws ecs update-service --cluster quotation-cluster --service quotation-service --desired-count 0 --region us-east-1
```

### Get Current Public IP
```bash
aws ecs list-tasks --cluster quotation-cluster --service-name quotation-service --desired-status RUNNING --region us-east-1 --query 'taskArns[0]' --output text | ForEach-Object { $task = $_; $eni = aws ecs describe-tasks --cluster quotation-cluster --tasks $task --region us-east-1 --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text; aws ec2 describe-network-interfaces --network-interface-ids $eni --query 'NetworkInterfaces[0].Association.PublicIp' --output text --region us-east-1 }
```

---

**Your backend is running at:** http://18.204.16.14:8080 ✅
