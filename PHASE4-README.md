# Phase IV: Local Kubernetes Deployment

## 🎯 Objective
Deploy the Todo Chatbot on a local Kubernetes cluster using Minikube and Helm Charts with AI-assisted DevOps tools.

## 🛠️ Technology Stack
- **Containerization**: Docker (Docker Desktop)
- **Docker AI**: Gordon (Docker AI Agent)
- **Orchestration**: Kubernetes (Minikube)
- **Package Manager**: Helm Charts
- **AI DevOps**: kubectl-ai, Kagent

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```powershell
# Run the automated setup script
.\phase4-setup.ps1
```

### Option 2: Quick Fix (If having issues)
```powershell
# Fix common issues first
.\quick-fix.ps1

# Then test the deployment
.\test-deployment.ps1
```

### Option 3: Manual Setup
Follow the detailed guide in `PHASE4-MANUAL-GUIDE.md`

## 📋 Prerequisites

### Required Tools
- Docker Desktop 4.53+ (with Gordon enabled)
- Minikube
- kubectl
- Helm 3.x
- kubectl-ai (optional)
- Kagent (optional)

### System Requirements
- Windows 10/11
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space
- Virtualization enabled in BIOS

## 🔧 Installation Steps

### 1. Install Prerequisites
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install tools
choco install docker-desktop minikube kubernetes-cli kubernetes-helm
```

### 2. Enable Docker AI (Gordon)
1. Open Docker Desktop
2. Go to Settings → Beta features
3. Toggle on "Docker AI"
4. Restart Docker Desktop

### 3. Install kubectl-ai
```powershell
# Download and install kubectl-ai
# (Already included in the project directory)
.\add_kubectl_ai_to_path.ps1
```

## 🐳 Docker AI Commands (Gordon)

```powershell
# Check Gordon capabilities
docker ai "What can you do?"

# Build images with AI assistance
docker ai "Build a production-ready image for my FastAPI backend"
docker ai "Optimize my Next.js frontend Docker image"

# Troubleshoot issues
docker ai "Why is my container failing to start?"
docker ai "How can I reduce my image size?"
```

## ☸️ Kubernetes AI Commands

### Using kubectl-ai
```powershell
# Deploy applications
kubectl-ai "deploy the todo frontend with 2 replicas"
kubectl-ai "scale the backend to handle more load"

# Troubleshooting
kubectl-ai "check why the pods are failing"
kubectl-ai "show me resource usage for all pods"
kubectl-ai "fix the service connectivity issues"

# Monitoring
kubectl-ai "show me the health of my cluster"
kubectl-ai "list all resources in the default namespace"
```

### Using Kagent (Advanced)
```powershell
# Cluster analysis
kagent "analyze the cluster health"
kagent "optimize resource allocation"
kagent "suggest improvements for my deployment"

# Performance tuning
kagent "identify bottlenecks in my application"
kagent "recommend scaling strategies"
```

## 📊 Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Next.js)     │    │   (FastAPI)     │
│   Port: 3000    │    │   Port: 7860    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌─────────────────┐
         │   PostgreSQL    │
         │   Port: 5432    │
         └─────────────────┘
```

## 🔍 Monitoring and Debugging

### Check Deployment Status
```powershell
# Quick status check
kubectl get all

# Detailed pod information
kubectl describe pods

# View logs
kubectl logs -f deployment/todo-chatbot-todo-chatbot-frontend
kubectl logs -f deployment/todo-chatbot-todo-chatbot-backend
```

### Access Applications
```powershell
# Get service URLs
minikube service frontend-nodeport --url
minikube service backend-nodeport --url

# Open in browser
minikube service frontend-nodeport
```

### Kubernetes Dashboard
```powershell
# Open Kubernetes dashboard
minikube dashboard
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Docker Desktop Not Starting
```powershell
# Restart Docker Desktop service
Restart-Service -Name "com.docker.service" -Force
```

#### 2. Minikube Connection Issues
```powershell
# Reset Minikube
minikube delete
minikube start --driver=docker --memory=4096 --cpus=2
```

#### 3. Image Pull Errors
```powershell
# Use Minikube's Docker daemon
& minikube docker-env --shell powershell | Invoke-Expression

# Rebuild images
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
```

#### 4. Pod Stuck in Pending
```powershell
# Check resource constraints
kubectl describe nodes
kubectl top nodes
```

## 📈 Scaling and Optimization

### Manual Scaling
```powershell
# Scale frontend
kubectl scale deployment todo-chatbot-todo-chatbot-frontend --replicas=3

# Scale backend
kubectl scale deployment todo-chatbot-todo-chatbot-backend --replicas=2
```

### Auto-scaling (HPA)
```powershell
# Enable metrics server
minikube addons enable metrics-server

# Create HPA
kubectl autoscale deployment todo-chatbot-todo-chatbot-frontend --cpu-percent=50 --min=1 --max=5
```

## 🧪 Testing

### Automated Testing
```powershell
# Run deployment tests
.\test-deployment.ps1
```

### Manual Testing
1. Access frontend URL
2. Register a new user
3. Create, update, and delete tasks
4. Test chat functionality
5. Verify backend API endpoints

## 📚 Additional Resources

- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [Helm Charts Guide](https://helm.sh/docs/chart_template_guide/)
- [kubectl-ai GitHub](https://github.com/sozercan/kubectl-ai)
- [Docker AI Documentation](https://docs.docker.com/desktop/features/docker-ai/)

## 🎉 Success Criteria

✅ Minikube cluster running
✅ Docker images built successfully
✅ Helm chart deployed
✅ All pods in Running state
✅ Services accessible via NodePort
✅ Frontend application loads
✅ Backend API responds
✅ Database connectivity working
✅ Chat functionality operational

## 🔄 Cleanup

```powershell
# Remove Helm deployment
helm uninstall todo-chatbot

# Stop Minikube
minikube stop

# Delete Minikube cluster (optional)
minikube delete

# Clean Docker images
docker system prune -a -f
```

---

**Phase IV Status**: ✅ Ready for deployment
**Next Phase**: Phase V - Cloud Deployment (AWS EKS)