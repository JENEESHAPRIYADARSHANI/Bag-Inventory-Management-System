@echo off
REM Order Management Service - AWS Deployment Script (Windows)
REM This script deploys the Order Management Service to AWS ECS Fargate

echo ==========================================
echo Order Management Service - AWS Deployment
echo ==========================================
echo.

REM Configuration
set AWS_REGION=us-east-1
set AWS_ACCOUNT_ID=468284644046
set ECR_REPO_NAME=order-management-service
set ECS_CLUSTER=quotation-cluster
set SERVICE_NAME=order-management-service
set TASK_FAMILY=order-service-task

echo Step 1: Building Maven application...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Maven build failed
    exit /b 1
)
echo [32mMaven build complete[0m
echo.

echo Step 2: Building Docker image...
docker build -t %ECR_REPO_NAME% .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker build failed
    exit /b 1
)
echo [32mDocker image built[0m
echo.

echo Step 3: Creating ECR repository (if not exists)...
aws ecr describe-repositories --repository-names %ECR_REPO_NAME% --region %AWS_REGION% 2>nul || aws ecr create-repository --repository-name %ECR_REPO_NAME% --region %AWS_REGION%
echo [32mECR repository ready[0m
echo.

echo Step 4: Logging into ECR...
for /f "tokens=*" %%i in ('aws ecr get-login-password --region %AWS_REGION%') do set ECR_PASSWORD=%%i
echo %ECR_PASSWORD% | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ECR login failed
    exit /b 1
)
echo [32mLogged into ECR[0m
echo.

echo Step 5: Tagging Docker image...
docker tag %ECR_REPO_NAME%:latest %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%ECR_REPO_NAME%:latest
echo [32mImage tagged[0m
echo.

echo Step 6: Pushing to ECR...
docker push %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%ECR_REPO_NAME%:latest
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker push failed
    exit /b 1
)
echo [32mImage pushed to ECR[0m
echo.

echo Step 7: Registering task definition...
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json --region %AWS_REGION%
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Task definition registration failed
    exit /b 1
)
echo [32mTask definition registered[0m
echo.

echo Step 8: Checking if service exists...
for /f "tokens=*" %%i in ('aws ecs describe-services --cluster %ECS_CLUSTER% --services %SERVICE_NAME% --region %AWS_REGION% --query "services[0].status" --output text 2^>nul') do set SERVICE_STATUS=%%i

if "%SERVICE_STATUS%"=="ACTIVE" (
    echo Service exists. Updating with force new deployment...
    aws ecs update-service --cluster %ECS_CLUSTER% --service %SERVICE_NAME% --task-definition %TASK_FAMILY% --force-new-deployment --region %AWS_REGION%
    echo [32mService updated[0m
) else (
    echo Service does not exist. Please create it manually using the guide.
    echo See DEPLOY_ORDER_SERVICE_TO_AWS.md for instructions.
)
echo.

echo ==========================================
echo [32mDeployment Complete![0m
echo ==========================================
echo.
echo Next steps:
echo 1. Wait 2-3 minutes for service to start
echo 2. Get the service IP address
echo 3. Update quotation-service with ORDER_SERVICE_URL
echo.
echo To get the IP address, run:
echo   get-service-ip.bat
echo.

pause
