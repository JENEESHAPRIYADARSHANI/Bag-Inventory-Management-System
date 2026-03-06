# Terraform Outputs for Quotation Management Service

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

# Database Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
}

output "rds_port" {
  description = "RDS instance port"
  value       = aws_db_instance.main.port
}

output "database_name" {
  description = "Name of the database"
  value       = aws_db_instance.main.db_name
}

output "database_username" {
  description = "Database master username"
  value       = aws_db_instance.main.username
  sensitive   = true
}

# Secrets Manager Outputs
output "db_credentials_secret_arn" {
  description = "ARN of the database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "db_credentials_secret_name" {
  description = "Name of the database credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.name
}

# ECR Outputs
output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.main.repository_url
}

output "ecr_repository_name" {
  description = "Name of the ECR repository"
  value       = aws_ecr_repository.main.name
}

# ECS Outputs
output "ecs_cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.main.name
}

output "ecs_task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.main.arn
}

# Load Balancer Outputs
output "load_balancer_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "load_balancer_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.main.zone_id
}

output "load_balancer_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.main.arn
}

output "target_group_arn" {
  description = "ARN of the target group"
  value       = aws_lb_target_group.main.arn
}

# Application URLs
output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.main.dns_name}"
}

output "health_check_url" {
  description = "URL for health check endpoint"
  value       = "http://${aws_lb.main.dns_name}/api/quotations/products"
}

output "api_base_url" {
  description = "Base URL for API endpoints"
  value       = "http://${aws_lb.main.dns_name}/api"
}

# Security Group Outputs
output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "ID of the ECS tasks security group"
  value       = aws_security_group.ecs_tasks.id
}

output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

# IAM Outputs
output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution.arn
}

# CloudWatch Outputs
output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.main.name
}

output "cloudwatch_log_group_arn" {
  description = "ARN of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.main.arn
}

# Auto Scaling Outputs
output "autoscaling_target_resource_id" {
  description = "Resource ID of the auto scaling target"
  value       = aws_appautoscaling_target.ecs_target.resource_id
}

output "autoscaling_policy_arn" {
  description = "ARN of the auto scaling policy"
  value       = aws_appautoscaling_policy.ecs_policy.arn
}

# Environment Information
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "project_name" {
  description = "Project name"
  value       = var.project_name
}

# Connection Information for Frontend
output "frontend_env_config" {
  description = "Environment configuration for frontend"
  value = {
    VITE_API_URL = "http://${aws_lb.main.dns_name}/api"
    VITE_APP_ENVIRONMENT = var.environment
  }
}

# Database Connection String
output "database_connection_string" {
  description = "Database connection string (without password)"
  value       = "jdbc:mysql://${aws_db_instance.main.endpoint}:${aws_db_instance.main.port}/${aws_db_instance.main.db_name}?useSSL=true&serverTimezone=UTC"
  sensitive   = true
}

# Deployment Information
output "deployment_info" {
  description = "Key information for deployment"
  value = {
    ecr_repository_url = aws_ecr_repository.main.repository_url
    ecs_cluster_name   = aws_ecs_cluster.main.name
    ecs_service_name   = aws_ecs_service.main.name
    load_balancer_dns  = aws_lb.main.dns_name
    application_url    = "http://${aws_lb.main.dns_name}"
    health_check_url   = "http://${aws_lb.main.dns_name}/api/quotations/products"
  }
}