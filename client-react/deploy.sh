#!/bin/bash

# React Client Deployment Script
echo "🚀 Starting React Client Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to build and run development environment
dev_deploy() {
    print_step "Building and running development environment..."
    docker-compose up -d frontend-dev
    
    print_status "✅ Development server is running at: http://localhost:3000"
    print_status "To view logs: docker-compose logs -f frontend-dev"
    print_status "To stop: docker-compose down"
}

# Function to build and run production environment
prod_deploy() {
    print_step "Building and running production environment..."
    docker-compose up -d frontend-prod
    
    print_status "✅ Production server is running at: http://localhost"
    print_status "To view logs: docker-compose logs -f frontend-prod"
    print_status "To stop: docker-compose down"
}

# Function to build Docker image only
build_only() {
    print_step "Building Docker image..."
    docker build -t youtube-clone-frontend .
    print_status "✅ Docker image built successfully!"
}

# Function to clean up
cleanup() {
    print_step "Cleaning up containers and images..."
    docker-compose down
    docker system prune -f
    print_status "✅ Cleanup completed!"
}

# Main menu
echo
echo "Choose deployment option:"
echo "1) Development deployment (port 3000)"
echo "2) Production deployment (port 80)"
echo "3) Build Docker image only"
echo "4) Cleanup containers and images"
echo "5) Exit"
echo

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        dev_deploy
        ;;
    2)
        prod_deploy
        ;;
    3)
        build_only
        ;;
    4)
        cleanup
        ;;
    5)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice. Please select 1-5."
        exit 1
        ;;
esac

echo
print_status "Deployment script completed!"
