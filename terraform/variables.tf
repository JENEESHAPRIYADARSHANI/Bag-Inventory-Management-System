# Terraform Variables for Quotation Management Service

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  default     = "development"
  
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "quotation-service"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for RDS instance (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS instance (GB)"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "quotation_db"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.db_password) >= 8
    error_message = "Database password must be at least 8 characters long."
  }
}

# ECS Configuration
variable "ecs_cpu" {
  description = "CPU units for ECS task (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 256
  
  validation {
    condition     = contains([256, 512, 1024, 2048, 4096], var.ecs_cpu)
    error_message = "ECS CPU must be one of: 256, 512, 1024, 2048, 4096."
  }
}

variable "ecs_memory" {
  description = "Memory for ECS task (MB)"
  type        = number
  default     = 512
  
  validation {
    condition = (
      (var.ecs_cpu == 256 && contains([512, 1024, 2048], var.ecs_memory)) ||
      (var.ecs_cpu == 512 && var.ecs_memory >= 1024 && var.ecs_memory <= 4096) ||
      (var.ecs_cpu == 1024 && var.ecs_memory >= 2048 && var.ecs_memory <= 8192) ||
      (var.ecs_cpu == 2048 && var.ecs_memory >= 4096 && var.ecs_memory <= 16384) ||
      (var.ecs_cpu == 4096 && var.ecs_memory >= 8192 && var.ecs_memory <= 30720)
    )
    error_message = "ECS memory must be compatible with the selected CPU value."
  }
}

variable "ecs_desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 2
  
  validation {
    condition     = var.ecs_desired_count >= 1 && var.ecs_desired_count <= 10
    error_message = "ECS desired count must be between 1 and 10."
  }
}

variable "ecs_min_capacity" {
  description = "Minimum number of ECS tasks for auto scaling"
  type        = number
  default     = 1
}

variable "ecs_max_capacity" {
  description = "Maximum number of ECS tasks for auto scaling"
  type        = number
  default     = 10
}

# Microservice URLs
variable "product_service_url" {
  description = "URL for the Product Service"
  type        = string
  default     = "http://localhost:8081/api/products"
}

variable "order_service_url" {
  description = "URL for the Order Service"
  type        = string
  default     = "http://localhost:8082/api/orders"
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}