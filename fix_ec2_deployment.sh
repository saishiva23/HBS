#!/bin/bash
# Fix EC2 Deployment - Java Version Issue

echo "========================================="
echo "Fixing EC2 Deployment - Java 21 Issue"
echo "========================================="
echo ""

# Step 1: Stop all containers
echo "Step 1: Stopping all containers..."
docker-compose -f docker-compose.freetier.yml down
echo "✓ Containers stopped"
echo ""

# Step 2: Remove old images
echo "Step 2: Removing old Docker images..."
docker rmi hotel-booking-backend:latest 2>/dev/null || true
docker rmi hotel-booking-frontend:latest 2>/dev/null || true
docker rmi hotel-booking-invoice:latest 2>/dev/null || true
echo "✓ Old images removed"
echo ""

# Step 3: Clean Docker cache
echo "Step 3: Cleaning Docker build cache..."
docker builder prune -f
echo "✓ Build cache cleaned"
echo ""

# Step 4: Pull latest code
echo "Step 4: Pulling latest code from GitHub..."
git pull origin main
echo "✓ Code updated"
echo ""

# Step 5: Verify Dockerfile has Java 21
echo "Step 5: Verifying Dockerfile..."
if grep -q "maven:3.9-eclipse-temurin-21" springboot_backend_jwt/Dockerfile; then
    echo "✓ Dockerfile has correct Java 21 version"
else
    echo "✗ Dockerfile needs update - fixing..."
    sed -i 's/maven:3.9-eclipse-temurin-17/maven:3.9-eclipse-temurin-21/g' springboot_backend_jwt/Dockerfile
    sed -i 's/eclipse-temurin:17-jre-alpine/eclipse-temurin:21-jre-alpine/g' springboot_backend_jwt/Dockerfile
    echo "✓ Dockerfile updated to Java 21"
fi
echo ""

# Step 6: Load environment variables
echo "Step 6: Loading environment variables..."
if [ -f .env.aws ]; then
    export $(cat .env.aws | xargs)
    echo "✓ Environment variables loaded"
else
    echo "✗ .env.aws not found! Please create it first."
    exit 1
fi
echo ""

# Step 7: Build with no cache
echo "Step 7: Building Docker images (no cache)..."
echo "This will take 10-15 minutes..."
docker-compose -f docker-compose.freetier.yml build --no-cache
echo "✓ Images built successfully"
echo ""

# Step 8: Start services
echo "Step 8: Starting all services..."
docker-compose -f docker-compose.freetier.yml up -d
echo "✓ Services started"
echo ""

# Step 9: Check status
echo "Step 9: Checking service status..."
sleep 5
docker-compose -f docker-compose.freetier.yml ps
echo ""

# Step 10: Show logs
echo "Step 10: Showing logs (Ctrl+C to exit)..."
echo "Waiting 30 seconds for services to start..."
sleep 30
docker-compose -f docker-compose.freetier.yml logs --tail=50

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Check your application at: http://YOUR_EC2_IP"
echo ""
echo "To view logs: docker-compose -f docker-compose.freetier.yml logs -f"
echo "To check status: docker-compose -f docker-compose.freetier.yml ps"
echo ""
