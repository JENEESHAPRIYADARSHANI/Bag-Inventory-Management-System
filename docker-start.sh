#!/bin/bash

echo "========================================"
echo "  Starting Quotation Management System"
echo "  with Docker Compose"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo ""
    echo "Please review .env file and update if needed."
    echo ""
fi

echo "Starting services..."
echo "This may take 2-3 minutes on first run..."
echo ""

# Build and start services
docker-compose up --build

# Cleanup on exit
echo ""
echo "Stopping services..."
docker-compose down
