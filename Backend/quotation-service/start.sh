#!/bin/bash

echo "========================================"
echo "Quotation Service - Quick Start"
echo "========================================"
echo ""

echo "Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    exit 1
fi
echo "Java found!"
echo ""

echo "Checking MySQL connection..."
if ! mysql -u root -p'Wr250x&@8052' -e "SELECT 1" &> /dev/null; then
    echo "WARNING: Cannot connect to MySQL"
    echo "Please ensure MySQL is running on localhost:3306"
    echo "Username: root"
    echo "Password: Wr250x&@8052"
    echo ""
    read -p "Press Enter to continue anyway (database will be created on first run)..."
fi
echo ""

echo "Building the application..."
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi
echo "Build successful!"
echo ""

echo "Starting Quotation Service..."
echo ""
echo "Application will be available at:"
echo "  - API: http://localhost:8080/api/quotations"
echo "  - User Interface: http://localhost:8080/customer.html"
echo "  - Admin Interface: http://localhost:8080/admin-dashboard.html"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

java -jar target/quotation-service-0.0.1-SNAPSHOT.jar
