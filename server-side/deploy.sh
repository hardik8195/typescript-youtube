#!/bin/bash

# Backend Server Deployment Script
echo "🚀 Starting Backend Server Deployment..."

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

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating template..."
    cat > .env << EOF
# MongoDB Cloud Configuration
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/youtube-clone?retryWrites=true&w=majority

# JWT Authentication
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret_here
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=40d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
NODE_ENV=production
PORT=8080
EOF
    print_warning "Please update the .env file with your actual MongoDB Cloud and Cloudinary credentials before continuing."
    read -p "Press Enter to continue after updating .env file..."
fi

# Function to build and run development environment
dev_deploy() {
    print_step "Building and running development environment..."
    docker-compose up -d backend-dev
    
    print_status "✅ Development server is running at: http://localhost:8080"
    print_status "API endpoints available at: http://localhost:8080/api/v1"
    print_status "To view logs: docker-compose logs -f backend-dev"
    print_status "To stop: docker-compose down"
}

# Function to build and run production environment
prod_deploy() {
    print_step "Building and running production environment..."
    docker-compose up -d backend-prod nginx
    
    print_status "✅ Production server is running!"
    print_status "API endpoints available at: http://localhost/api/v1"
    print_status "Direct backend access: http://localhost:8080/api/v1"
    print_status "To view logs: docker-compose logs -f backend-prod"
    print_status "To stop: docker-compose down"
}

# Function to build Docker image only
build_only() {
    print_step "Building Docker image..."
    docker build -t youtube-clone-backend .
    print_status "✅ Docker image built successfully!"
}

# Function to test MongoDB connection
test_mongodb() {
    print_step "Testing MongoDB connection..."
    if docker-compose exec backend-prod node -e "
        const mongoose = require('mongoose');
        mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => { console.log('✅ MongoDB connection successful'); process.exit(0); })
            .catch(err => { console.error('❌ MongoDB connection failed:', err.message); process.exit(1); });
    "; then
        print_status "✅ MongoDB connection test passed!"
    else
        print_error "❌ MongoDB connection test failed!"
        print_warning "Please check your MONGODB_URL in the .env file"
    fi
}

# Function to clean up
cleanup() {
    print_step "Cleaning up containers and images..."
    docker-compose down
    docker system prune -f
    print_status "✅ Cleanup completed!"
}

# Function to show logs
show_logs() {
    print_step "Showing container logs..."
    docker-compose logs -f
}

# Main menu
echo
echo "Choose deployment option:"
echo "1) Development deployment (port 8080)"
echo "2) Production deployment (with nginx)"
echo "3) Build Docker image only"
echo "4) Test MongoDB connection"
echo "5) Show logs"
echo "6) Cleanup containers and images"
echo "7) Exit"
echo

read -p "Enter your choice (1-7): " choice

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
        test_mongodb
        ;;
    5)
        show_logs
        ;;
    6)
        cleanup
        ;;
    7)
        print_status "Exiting..."
        exit 0
        ;;
    *)
        print_error "Invalid choice. Please select 1-7."
        exit 1
        ;;
esac

echo
print_status "Deployment script completed!"
