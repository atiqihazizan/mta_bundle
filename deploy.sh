#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Server details
SERVER_USER="root"
SERVER_HOST="178.128.48.114"

# Print with color
print_status() {
    echo -e "${YELLOW}[*] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[✓] $1${NC}"
}

print_error() {
    echo -e "${RED}[✗] $1${NC}"
}

# Navigate to react directory and build the project
print_status "Navigating to react directory..."
cd react

print_status "Building project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed! Aborting deployment."
    cd ..
    exit 1
fi

cd ..

# Deploy to server with improved rsync parameters
print_status "Deploying to server..."
# Use SSH with explicit control options to prevent connection timeout
rsync -avzP --delete --timeout=120 -e "ssh -o ConnectTimeout=60 -o ServerAliveInterval=30 -o ServerAliveCountMax=10" api/public/dist/ $SERVER_USER@$SERVER_HOST:/var/www/mta.manager/html/laravel/public/dist/

if [ $? -ne 0 ]; then
    print_error "Deployment to server failed!"
    # Try an alternative method if rsync fails
    print_status "Trying alternative deployment method..."
    ssh -o ConnectTimeout=60 $SERVER_USER@$SERVER_HOST "mkdir -p /var/www/mta.manager/html/laravel/public/dist/"
    scp -r api/public/dist/* $SERVER_USER@$SERVER_HOST:/var/www/mta.manager/html/laravel/public/dist/
    
    if [ $? -ne 0 ]; then
        print_error "Alternative deployment also failed!"
        exit 1
    else
        print_success "Alternative deployment succeeded!"
    fi
else
    print_success "Deployment succeeded!"
fi

# Push changes if any
if [[ -n $(git status -s) ]]; then
    print_status "Pushing changes to remote..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    
    if [ $? -ne 0 ]; then
        print_error "Failed to push changes to remote!"
        exit 1
    fi
fi

print_success "Deployment completed successfully!"
