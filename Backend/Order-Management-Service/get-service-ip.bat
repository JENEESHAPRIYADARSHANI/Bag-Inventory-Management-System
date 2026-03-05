@echo off
REM Get Order Management Service IP Address

set AWS_REGION=us-east-1
set ECS_CLUSTER=quotation-cluster
set SERVICE_NAME=order-management-service

echo Getting Order Management Service IP address...
echo.

REM Get task ARN
for /f "tokens=*" %%i in ('aws ecs list-tasks --cluster %ECS_CLUSTER% --service-name %SERVICE_NAME% --desired-status RUNNING --region %AWS_REGION% --query "taskArns[0]" --output text') do set TASK_ARN=%%i

if "%TASK_ARN%"=="None" (
    echo [31mNo running tasks found for service: %SERVICE_NAME%[0m
    echo.
    echo Please check:
    echo 1. Service is created and running
    echo 2. Service name is correct: %SERVICE_NAME%
    echo 3. Cluster name is correct: %ECS_CLUSTER%
    exit /b 1
)

echo Task ARN: %TASK_ARN%
echo.

REM Get network interface ID
for /f "tokens=*" %%i in ('aws ecs describe-tasks --cluster %ECS_CLUSTER% --tasks %TASK_ARN% --region %AWS_REGION% --query "tasks[0].attachments[0].details[?name==`networkInterfaceId`].value" --output text') do set ENI_ID=%%i

echo Network Interface ID: %ENI_ID%
echo.

REM Get public IP
for /f "tokens=*" %%i in ('aws ec2 describe-network-interfaces --network-interface-ids %ENI_ID% --query "NetworkInterfaces[0].Association.PublicIp" --output text --region %AWS_REGION%') do set PUBLIC_IP=%%i

echo ==========================================
echo [32mOrder Management Service IP Address:[0m
echo ==========================================
echo.
echo   http://%PUBLIC_IP%:8082
echo.
echo ==========================================
echo.
echo Test the service:
echo   curl http://%PUBLIC_IP%:8082/orders
echo.
echo Update quotation-service environment:
echo   ORDER_SERVICE_URL=http://%PUBLIC_IP%:8082
echo.

pause
