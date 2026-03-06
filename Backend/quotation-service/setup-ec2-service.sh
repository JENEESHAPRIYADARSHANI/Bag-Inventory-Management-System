#!/bin/bash
# EC2 Setup Script for Quotation Service

echo "🚀 Setting up Quotation Service on EC2..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Java 17
echo "☕ Installing Java 17..."
sudo yum install java-17-amazon-corretto -y

# Verify Java installation
java -version

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/quotation-service
sudo chown ec2-user:ec2-user /opt/quotation-service

# Copy JAR file
echo "📋 Moving JAR file..."
cp /home/ec2-user/quotation-service-0.0.1-SNAPSHOT.jar /opt/quotation-service/

# Create systemd service file
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/quotation-service.service > /dev/null <<EOF
[Unit]
Description=Quotation Management Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/quotation-service
ExecStart=/usr/bin/java -jar quotation-service-0.0.1-SNAPSHOT.jar
Environment="SPRING_PROFILES_ACTIVE=cloud"
Environment="SERVER_PORT=8080"
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
echo "🔄 Starting service..."
sudo systemctl daemon-reload
sudo systemctl enable quotation-service
sudo systemctl start quotation-service

# Check service status
echo "📊 Service status:"
sudo systemctl status quotation-service --no-pager

# Wait for service to start
echo "⏳ Waiting for service to start..."
sleep 15

# Test health endpoint
echo "🧪 Testing health endpoint..."
curl -f http://localhost:8080/actuator/health || echo "Service may still be starting..."

echo "✅ Setup completed!"
echo "🌐 Service should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
echo "📋 To check logs: sudo journalctl -u quotation-service -f"
echo "📋 To restart: sudo systemctl restart quotation-service"