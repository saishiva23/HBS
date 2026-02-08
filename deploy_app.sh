#!/bin/bash
# Application Deployment Script
# EC2 IP: 52.66.52.254

set -e  # Exit on error

echo "=========================================="
echo "Deploying Hotel Booking System"
echo "=========================================="
echo ""

# Check if .env.aws exists
if [ ! -f .env.aws ]; then
    echo "❌ Error: .env.aws file not found!"
    echo ""
    echo "Please create .env.aws file with the following content:"
    echo ""
    echo "RDS_ENDPOINT=your-rds-endpoint.rds.amazonaws.com"
    echo "DB_USERNAME=admin"
    echo "DB_PASSWORD=your-password"
    echo "JWT_SECRET=617b7c292a0698a897e6ff73324285be2ca049857c8802e26a4cce2214d899c4"
    echo "FRONTEND_URL=http://52.66.52.254"
    echo "EC2_PUBLIC_IP=52.66.52.254"
    echo "INVOICE_SERVICE_URL=http://invoice-service:5000"
    echo ""
    echo "To create the file, run:"
    echo "  cp .env.aws.example .env.aws"
    echo "  nano .env.aws"
    exit 1
fi

# Load environment variables
echo "Step 1: Loading environment variables..."
export $(cat .env.aws | xargs)
echo "✅ Environment loaded"
echo ""

# Choose compose file
echo "Step 2: Selecting Docker Compose file..."
if [ -f docker-compose.aws.yml ]; then
    export COMPOSE_FILE=docker-compose.aws.yml
    echo "✅ Using docker-compose.aws.yml"
elif [ -f docker-compose.freetier.yml ]; then
    export COMPOSE_FILE=docker-compose.freetier.yml
    echo "✅ Using docker-compose.freetier.yml"
else
    echo "❌ Error: No docker-compose file found!"
    exit 1
fi
echo ""

# Build images
echo "Step 3: Building Docker images..."
echo "⏳ This will take 10-15 minutes. Please wait..."
docker-compose -f $COMPOSE_FILE build
echo "✅ Images built successfully"
echo ""

# Start services
echo "Step 4: Starting all services..."
docker-compose -f $COMPOSE_FILE up -d
echo "✅ Services started"
echo ""

# Wait for services to initialize
echo "Step 5: Waiting for services to initialize (30 seconds)..."
sleep 30
echo ""

# Check status
echo "Step 6: Checking service status..."
docker-compose -f $COMPOSE_FILE ps
echo ""

# Test services
echo "Step 7: Testing services..."
echo ""

echo "Testing Backend..."
if curl -s http://localhost:8080/actuator/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend might still be starting..."
fi

echo "Testing Invoice Service..."
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Invoice Service is running"
else
    echo "⚠️  Invoice Service might still be starting..."
fi

echo "Testing Frontend..."
if curl -s http://localhost > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "⚠️  Frontend might still be starting..."
fi
echo ""

echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "Your application is now live at:"
echo ""
echo "  Frontend:        http://52.66.52.254"
echo "  Backend API:     http://52.66.52.254:8080"
echo "  Invoice Service: http://52.66.52.254:5000"
echo ""
echo "Test in your browser: http://52.66.52.254"
echo ""
echo "Useful commands:"
echo "  View logs:       docker-compose -f $COMPOSE_FILE logs -f"
echo "  Check status:    docker-compose -f $COMPOSE_FILE ps"
echo "  Restart:         docker-compose -f $COMPOSE_FILE restart"
echo "  Stop:            docker-compose -f $COMPOSE_FILE stop"
echo ""
