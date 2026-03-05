@echo off
REM AWS Deployment Script for Quotation Service (Windows)

echo =========================================
echo   AWS Deployment - Quotation Service
echo =========================================
echo.

REM Configuration
set AWS_REGION=us-east-1
set CLUSTER_NAME=quotation-cluster
set SERVICE_NAME=quotation-service
set REPOSITORY_NAME=quotation-service
set DB_INSTANCE_ID=quotation-db

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: AWS CLI is not installed
    echo Install from: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker is not installed
    pause
    exit /b 1
)

REM Check AWS credentials
echo Checking AWS credentials...
aws sts get-caller-identity >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: AWS credentials not configured
    echo Run: aws configure
    pause
    exit /b 1
)

REM Get AWS Account ID
for /f "tokens=*" %%i in ('aws sts get-caller-identity --query Account --output text') do set AWS_ACCOUNT_ID=%%i
echo AWS Account ID: %AWS_ACCOUNT_ID%
echo.

REM Step 1: Create RDS Database
echo Step 1: Creating RDS MySQL Database...
set /p CREATE_RDS="Create new RDS instance? (y/n): "

if /i "%CREATE_RDS%"=="y" (
    set /p DB_PASSWORD="Enter database password: "
    
    aws rds create-db-instance ^
        --db-instance-identifier %DB_INSTANCE_ID% ^
        --db-instance-class db.t3.micro ^
        --engine mysql ^
        --engine-version 8.0.35 ^
        --master-username admin ^
        --master-user-password "%DB_PASSWORD%" ^
        --allocated-storage 20 ^
        --backup-retention-period 7 ^
        --publicly-accessible ^
        --region %AWS_REGION% 2>nul
    
    echo Database creation initiated
    echo Waiting for database to be available...
    
    aws rds wait db-instance-available ^
        --db-instance-identifier %DB_INSTANCE_ID% ^
        --region %AWS_REGION%
    
    for /f "tokens=*" %%i in ('aws rds describe-db-instances --db-instance-identifier %DB_INSTANCE_ID% --query "DBInstances[0].Endpoint.Address" --output text --region %AWS_REGION%') do set DB_ENDPOINT=%%i
    
    echo Database available at: %DB_ENDPOINT%
) else (
    set /p DB_ENDPOINT="Enter existing database endpoint: "
    set /p DB_PASSWORD="Enter database password: "
)
echo.

REM Step 2: Create ECR Repository
echo Step 2: Creating ECR Repository...
aws ecr create-repository ^
    --repository-name %REPOSITORY_NAME% ^
    --region %AWS_REGION% 2>nul

set ECR_REPO=%AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%REPOSITORY_NAME%
echo ECR Repository: %ECR_REPO%
echo.

REM Step 3: Build and Push Docker Image
echo Step 3: Building and pushing Docker image...

REM Login to ECR
echo Logging in to ECR...
for /f "tokens=*" %%i in ('aws ecr get-login-password --region %AWS_REGION%') do set ECR_PASSWORD=%%i
echo %ECR_PASSWORD% | docker login --username AWS --password-stdin %ECR_REPO%

REM Build image
echo Building Docker image...
docker build -t %REPOSITORY_NAME% .

REM Tag image
docker tag %REPOSITORY_NAME%:latest %ECR_REPO%:latest

REM Push image
echo Pushing image to ECR...
docker push %ECR_REPO%:latest

echo Image pushed successfully
echo.

REM Step 4: Store Secrets
echo Step 4: Storing database credentials...

aws secretsmanager create-secret ^
    --name quotation-db-url ^
    --description "Database URL for quotation service" ^
    --secret-string "jdbc:mysql://%DB_ENDPOINT%:3306/quotation_db" ^
    --region %AWS_REGION% 2>nul

if %ERRORLEVEL% NEQ 0 (
    aws secretsmanager update-secret ^
        --secret-id quotation-db-url ^
        --secret-string "jdbc:mysql://%DB_ENDPOINT%:3306/quotation_db" ^
        --region %AWS_REGION%
)

aws secretsmanager create-secret ^
    --name quotation-db-password ^
    --description "Database password" ^
    --secret-string "%DB_PASSWORD%" ^
    --region %AWS_REGION% 2>nul

if %ERRORLEVEL% NEQ 0 (
    aws secretsmanager update-secret ^
        --secret-id quotation-db-password ^
        --secret-string "%DB_PASSWORD%" ^
        --region %AWS_REGION%
)

echo Secrets stored
echo.

REM Step 5: Create ECS Cluster
echo Step 5: Creating ECS Cluster...
aws ecs create-cluster ^
    --cluster-name %CLUSTER_NAME% ^
    --region %AWS_REGION% 2>nul

echo ECS Cluster created
echo.

REM Step 6: Register Task Definition
echo Step 6: Registering task definition...
aws ecs register-task-definition ^
    --cli-input-json file://ecs-task-definition.json ^
    --region %AWS_REGION%

echo Task definition registered
echo.

REM Step 7: Create/Update Service
echo Step 7: Deploying ECS Service...

REM Get default VPC and subnets
for /f "tokens=*" %%i in ('aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region %AWS_REGION%') do set VPC_ID=%%i
for /f "tokens=*" %%i in ('aws ec2 describe-subnets --filters "Name=vpc-id,Values=%VPC_ID%" --query "Subnets[0].SubnetId" --output text --region %AWS_REGION%') do set SUBNET_ID=%%i

REM Create security group
aws ec2 create-security-group ^
    --group-name quotation-service-sg ^
    --description "Security group for quotation service" ^
    --vpc-id %VPC_ID% ^
    --region %AWS_REGION% 2>nul

for /f "tokens=*" %%i in ('aws ec2 describe-security-groups --filters "Name=group-name,Values=quotation-service-sg" --query "SecurityGroups[0].GroupId" --output text --region %AWS_REGION%') do set SG_ID=%%i

REM Allow inbound traffic
aws ec2 authorize-security-group-ingress ^
    --group-id %SG_ID% ^
    --protocol tcp ^
    --port 8080 ^
    --cidr 0.0.0.0/0 ^
    --region %AWS_REGION% 2>nul

REM Create service
aws ecs create-service ^
    --cluster %CLUSTER_NAME% ^
    --service-name %SERVICE_NAME% ^
    --task-definition quotation-service-task ^
    --desired-count 1 ^
    --launch-type FARGATE ^
    --network-configuration "awsvpcConfiguration={subnets=[%SUBNET_ID%],securityGroups=[%SG_ID%],assignPublicIp=ENABLED}" ^
    --region %AWS_REGION% 2>nul

if %ERRORLEVEL% NEQ 0 (
    aws ecs update-service ^
        --cluster %CLUSTER_NAME% ^
        --service %SERVICE_NAME% ^
        --force-new-deployment ^
        --region %AWS_REGION%
)

echo ECS Service deployed
echo.

echo =========================================
echo   Deployment Complete!
echo =========================================
echo.
echo Service Information:
echo   Cluster: %CLUSTER_NAME%
echo   Service: %SERVICE_NAME%
echo   Region: %AWS_REGION%
echo.
echo View logs:
echo   aws logs tail /ecs/%SERVICE_NAME% --follow
echo.
echo Check service status:
echo   aws ecs describe-services --cluster %CLUSTER_NAME% --services %SERVICE_NAME%
echo.
pause
