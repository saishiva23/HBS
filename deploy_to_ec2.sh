#!/bin/bash
# Deployment Script for EC2: 52.66.52.254
# Hotel Booking System - Multi-Backend Deployment

set -e  # Exit on error

echo "=========================================="
echo "Hotel Booking System - EC2 Deployment"
echo "EC2 IP: 52.66.52.254"
echo "=========================================="
echo ""

# Step 1: Install Docker
echo "Step 1: Installing Docker..."
sudo apt update
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
echo "✅ Docker installed"
echo ""

# Step 2: Install Docker Compose
echo "Step 2: Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
echo "✅ Docker Compose installed"
echo ""

# Step 3: Install Git
echo "Step 3: Installing Git..."
sudo apt install git -y
echo "✅ Git installed"
echo ""

# Step 4: Verify installations
echo "Step 4: Verifying installations..."
docker --version
docker-compose --version
git --version
echo "✅ All tools installed successfully"
echo ""

echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "IMPORTANT: You need to logout and login again for Docker permissions to take effect."
echo ""
echo "After re-login, run the deployment script:"
echo "  cd ~/HBS"
echo "  bash deploy_app.sh"
echo ""
echo "To logout, type: exit"
echo "To login again: ssh -i \"hbs-server-key.pem\" ubuntu@52.66.52.254"
