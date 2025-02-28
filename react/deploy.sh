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

# Build the project
print_status "Building project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed! Aborting deployment."
    exit 1
fi

# Deploy to server
print_status "Deploying to server..."
# rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:/var/www/mta.manager/html/public/
rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:/var/www/mta.manager/html/laravel/public/

if [ $? -ne 0 ]; then
    print_error "Deployment to server failed!"
    exit 1
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
