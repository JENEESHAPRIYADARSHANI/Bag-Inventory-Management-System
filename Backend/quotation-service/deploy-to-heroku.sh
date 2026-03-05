#!/bin/bash

# Heroku Deployment Script for Quotation Service

echo "========================================="
echo "  Deploying Quotation Service to Heroku"
echo "========================================="
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Error: Heroku CLI is not installed"
    echo "Install from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku
echo "Step 1: Logging in to Heroku..."
heroku login

# Create app
echo ""
echo "Step 2: Creating Heroku app..."
read -p "Enter app name (e.g., my-quotation-service): " APP_NAME
heroku create $APP_NAME

# Add MySQL database
echo ""
echo "Step 3: Adding MySQL database..."
heroku addons:create jawsdb:kitefin -a $APP_NAME

# Set to container stack
echo ""
echo "Step 4: Setting container stack..."
heroku stack:set container -a $APP_NAME

# Set environment variables
echo ""
echo "Step 5: Setting environment variables..."
heroku config:set SPRING_PROFILES_ACTIVE=cloud -a $APP_NAME

# Deploy
echo ""
echo "Step 6: Deploying application..."
git push heroku main

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
echo "Your application is available at:"
echo "  https://$APP_NAME.herokuapp.com"
echo ""
echo "View logs:"
echo "  heroku logs --tail -a $APP_NAME"
echo ""
echo "Test health endpoint:"
echo "  curl https://$APP_NAME.herokuapp.com/actuator/health"
echo ""
