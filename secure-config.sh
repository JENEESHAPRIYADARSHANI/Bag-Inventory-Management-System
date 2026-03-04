#!/bin/bash

echo "========================================"
echo "Securing Configuration Files"
echo "========================================"
echo ""

echo "This script will replace hardcoded passwords with environment variables."
echo ""
echo "WARNING: Make sure you have a backup before proceeding!"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "Updating quotation-service..."
sed -i 's/spring.datasource.password=.*/spring.datasource.password=${DB_PASSWORD:root}/' Backend/quotation-service/src/main/resources/application.properties

echo "Updating product-catalog-service..."
sed -i 's/password: "@Abishek2001"/password: ${DB_PASSWORD:root}/' Backend/product-catalog-service/src/main/resources/application.yaml

echo "Updating logistics-Service..."
sed -i 's/password: Nuskyny@1234/password: ${DB_PASSWORD:root}/' Backend/logistics-Service/src/main/resources/application.yaml

echo "Updating Order-Management-Service properties..."
sed -i 's/spring.datasource.password=.*/spring.datasource.password=${DB_PASSWORD:root}/' Backend/Order-Management-Service/src/main/resources/application.properties

echo "Updating Order-Management-Service yaml..."
sed -i 's/password: password123/password: ${DB_PASSWORD:root}/' Backend/Order-Management-Service/src/main/resources/application.yaml

echo ""
echo "========================================"
echo "Configuration files secured!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Review the changes in each file"
echo "2. Set environment variable: export DB_PASSWORD=your_password"
echo "3. Test your application locally"
echo "4. Commit and push to GitHub"
echo ""
