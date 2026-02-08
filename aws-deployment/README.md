# AWS Deployment for Hotel Booking System

Complete deployment configurations for deploying your Hotel Booking System to AWS.

## 🚀 Quick Start

**Choose your deployment strategy:**

### Option 1: Simple AWS (Recommended for Interviews)
- Cost: ~$50/month
- Setup: 2-3 hours
- Perfect for demos

📖 **[Read Simple Deployment Guide](simple/DEPLOYMENT_GUIDE.md)**

### Option 2: Kubernetes (Advanced)
- Cost: ~$150/month  
- Setup: 4-6 hours
- Production-grade

📖 **[Read Kubernetes Deployment Guide](kubernetes/DEPLOYMENT_GUIDE.md)** *(Coming soon)*

---

## 📁 What's Included

### Docker Configuration
- ✅ `springboot_backend_jwt/Dockerfile` - Spring Boot backend
- ✅ `HotelBookingInvoiceService/Dockerfile` - .NET invoice service  
- ✅ `frontend/Dockerfile` - React frontend with nginx
- ✅ `docker-compose.aws.yml` - Multi-container orchestration
- ✅ `.dockerignore` - Optimize build context

### AWS Configurations
- ✅ `simple/DEPLOYMENT_GUIDE.md` - Complete setup instructions
- ✅ `simple/ec2-setup.sh` - Automated EC2 configuration
- ✅ Application configs for production environment
- ✅ Environment variable templates

### Documentation
- ✅ `COST_ESTIMATE.md` - Detailed pricing breakdown
- ✅ `TEARDOWN_GUIDE.md` - Complete cleanup instructions

---

## 💰 Cost Summary

| Deployment | Monthly | 1 Week Demo | Best For |
|------------|---------|-------------|----------|
| **Simple AWS** | $50 | $10 | Interviews, Demos |
| **Kubernetes** | $170 | $40 | Production, Portfolio |

💡 Both can be completely torn down after your interview to avoid ongoing charges!

---

## 🎯 For Your Interview

### What You'll Demonstrate:
1. ✅ **3-tier architecture** deployed to cloud
2. ✅ **Docker containerization** of all services
3. ✅ **Managed database** (AWS RDS)
4. ✅ **Infrastructure as Code** with Docker Compose
5. ✅ **Production configurations** with environment variables

### Live Demo URL:
After deployment, your app will be accessible at:
```
http://YOUR_EC2_PUBLIC_IP
```

Backend APIs:
```
http://YOUR_EC2_PUBLIC_IP:8080/api  (Spring Boot)
http://YOUR_EC2_PUBLIC_IP:5000/api  (Invoice Service)
```

---

## 📋 Prerequisites

- AWS Account with billing enabled
- AWS CLI configured locally
- Docker installed (for testing builds)
- ~$10-50 budget depending on duration

---

## 🏗️ Architecture

### Simple AWS Deployment
```
┌─────────────────────────────────────┐
│  Frontend (React + Nginx)           │
│  Running on EC2 :80                 │
└─────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Backend Services on EC2            │
│  ├─ Spring Boot :8080               │
│  └─ .NET Invoice :5000              │
│     (Docker Compose)                │
└─────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  AWS RDS MySQL                      │
│  hotel_booking_db                   │
└─────────────────────────────────────┘
```

---

## 🚦 Deployment Steps (Summary)

**Simple AWS (2-3 hours):**
1. Create RDS MySQL instance (15 min)
2. Launch and configure EC2 (30 min)
3. Setup Docker environment (30 min)
4. Deploy application (30 min)
5. Test all features (30 min)

**Full instructions:** [Simple Deployment Guide](simple/DEPLOYMENT_GUIDE.md)

---

## 🧪 Testing Your Deployment

### Health Checks:
```bash
# Backend
curl http://YOUR_EC2_IP:8080/actuator/health

# Invoice Service
curl http://YOUR_EC2_IP:5000/health

# Frontend
curl http://YOUR_EC2_IP/health
```

### Full Application Test:
1. Browse hotels
2. Create booking (tests Spring Boot + MySQL)
3. Download invoice (tests .NET service)
4. Admin panel (tests role-based access)

---

## 🔧 Troubleshooting

### Build fails locally:
```bash
# Test individual Dockerfiles
docker build -t test-backend ./springboot_backend_jwt
docker build -t test-invoice ./HotelBookingInvoiceService  
docker build -t test-frontend ./frontend
```

### Can't connect to RDS:
```bash
# From EC2, test MySQL connection
mysql -h YOUR_RDS_ENDPOINT -u admin -p
```

### Services won't start:
```bash
# Check logs
docker-compose -f docker-compose.aws.yml logs -f backend
docker-compose -f docker-compose.aws.yml logs -f invoice-service
```

More help: See [Deployment Guide](simple/DEPLOYMENT_GUIDE.md#troubleshooting)

---

## 🗑️ Cleanup After Interview

**IMPORTANT:** Don't forget to delete resources!

Quick cleanup:
```bash
# On EC2
docker-compose -f docker-compose.aws.yml down -v

# In AWS Console:
1. Terminate EC2 instance
2. Delete RDS database (no snapshot)
3. Release Elastic IP
4. Delete security groups
```

**Full guide:** [TEARDOWN_GUIDE.md](TEARDOWN_GUIDE.md)

**This takes 10 minutes and prevents ongoing charges!**

---

## 📚 Additional Resources

- [Cost Estimate Details](COST_ESTIMATE.md)
- [Environment Variables Guide](simple/DEPLOYMENT_GUIDE.md#step-4-deploy-application-to-ec2)
- [AWS Free Tier Info](https://aws.amazon.com/free/)

---

## 💡 Interview Tips

**When explaining your deployment:**

1. **Start with architecture**: "I containerized all three services using Docker..."
2. **Highlight AWS services**: "Using RDS for managed database, EC2 for compute..."
3. **Explain orchestration**: "Docker Compose coordinates the backend services..."
4. **Show scalability awareness**: "For production, I could use EKS/Kubernetes or multiple EC2 instances with a load balancer..."
5. **Discuss CI/CD**: "This could integrate with GitHub Actions for automated deployments..."

**Key talking points:**
- Multi-stage Docker builds for optimized images
- Environment-based configuration (dev vs prod)
- Health checks and monitoring
- Security groups and network isolation
- Cost optimization strategies

---

## 🆘 Need Help?

Common issues and solutions in the deployment guide:
- [Database connection errors](simple/DEPLOYMENT_GUIDE.md#database-connection-errors)
- [Docker build failures](simple/DEPLOYMENT_GUIDE.md#services-wont-start)
- [CORS issues](simple/DEPLOYMENT_GUIDE.md#frontend-cant-reach-backend)

---

## ✅ Success Checklist

After deployment, verify:
- [ ] All containers running (`docker ps`)
- [ ] Backend health check returns 200
- [ ] Can login to frontend
- [ ] Can create booking
- [ ] Can download invoice
- [ ] Database has booking record
- [ ] Total AWS cost < $1/day

**You're ready for your interview! 🎉**
