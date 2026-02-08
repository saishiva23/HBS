#!/bin/bash

# Hotel Booking System - EC2 Setup Script
# This script installs all dependencies on a fresh Ubuntu EC2 instance

set -e  # Exit on error

echo "======================================"
echo "Hotel Booking System - EC2 Setup"
echo "======================================"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose already installed"
fi

# Install Git
echo "📥 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install git -y
    echo "✅ Git installed successfully"
else
    echo "✅ Git already installed"
fi

# Install MySQL client (for testing RDS connection)
echo "🗄️ Installing MySQL client..."
if ! command -v mysql &> /dev/null; then
    sudo apt install mysql-client -y
    echo "✅ MySQL client installed successfully"
else
    echo "✅ MySQL client already installed"
fi

# Install useful utilities
echo "🛠️ Installing utilities..."
sudo apt install -y htop curl wget nano vim net-tools

# Print versions
echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "Installed versions:"
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"
echo "Git: $(git --version)"
echo "MySQL client: $(mysql --version | head -n1)"
echo ""
echo "⚠️  IMPORTANT: You must logout and login again for Docker group changes to take effect!"
echo ""
echo "Next steps:"
echo "1. Logout: exit"
echo "2. Login again: ssh -i your-key.pem ubuntu@YOUR_EC2_IP"
echo "3. Clone your repository"
echo "4. Configure .env.aws with your RDS endpoint"
echo "5. Run: docker-compose -f docker-compose.aws.yml up -d"
echo ""
