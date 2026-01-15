# Phase IV: Manual Deployment Guide

## 🚨 Current Issues and Solutions

### Issue 1: Docker Desktop Not Running
**Error**: `Error response from daemon: Docker Desktop is unable to start`

**Solution**:
1. Open Docker Desktop application
2. Wait for it to fully start (green status)
3. If it fails to start, restart your computer and try again

### Issue 2: Disk Space Issues
**Error**: `There is not enough space on the disk`

**Solution**:
```powershell
# Clean Docker system
docker system prune -f
docker volume prune -f
docker image prune -a -f

# Clean Minikube
minikube delete
```

### Issue 3: Minikube Connectivity Issues
**Error**: `net/http: TLS handshake timeout`

**Solution**:
```powershell
# Stop and restart Minikube
minikube stop
minikube start --driver=docker --memory=4096 --cpus=2
```

## 📋 Step-by-Step Manual Process

### Step 1: Prerequisites Check
```powershell
# Check if tools are installed
docker --version
minikube version
kubectl version --client
helm version
```

### Step 2: Start Docker Desktop
1. Open Docker Desktop
2. Wait for it to show "Engine running" status
3. Test: `docker ps`

### Step 3: Clean and Start Minikube
```powershell
# Clean previous setup
minikube delete
minikube start --driver=docker --memory=4096 --cpus=2

# Configure Docker environment
& minikube docker-env --shell powershell | Invoke-Expression
```

### Step 4: Build Docker Images
```powershell
# Build backend image
cd backend
docker build -t todo-backend:latest .

# Build frontend image
cd ../frontend
docker build -t todo-frontend:latest .

cd ..
```

### Step 5: Deploy with Helm
```powershell
# Install the Helm chart
helm install todo-chatbot ./todo-chart

# Check deployment status
kubectl get pods
kubectl get services
```

### Step 6: Expose Services
```powershell
# Expose frontend
kubectl expose deployment todo-chatbot-todo-chatbot-frontend --type=NodePort --port=3000 --name=frontend-nodeport

# Expose backend
kubectl expose deployment todo-chatbot-todo-chatbot-backend --type=NodePort --port=7860 --name=backend-nodeport
```

### Step 7: Access Applications
```powershell
# Get service URLs
minikube service frontend-nodeport --url
minikube service backend-nodeport --url
```

## 🔧 Troubleshooting Commands

### Check Pod Status
```powershell
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Check Services
```powershell
kubectl get services
kubectl describe service <service-name>
```

### Check Minikube Status
```powershell
minikube status
minikube logs
```

### Restart Everything
```powershell
# If everything fails, restart from scratch
minikube delete
docker system prune -f
minikube start --driver=docker --memory=4096 --cpus=2
```

## 🎯 Expected Results

After successful deployment, you should see:
- 2 frontend pods running
- 1 backend pod running
- Services accessible via NodePort
- Applications working at the provided URLs

## 🚀 Quick Commands for kubectl-ai (if available)

```powershell
# Install kubectl-ai first
kubectl-ai "show me all pods and their status"
kubectl-ai "scale the frontend to 3 replicas"
kubectl-ai "check why pods are failing"
kubectl-ai "show me service endpoints"
```

## 📊 Success Indicators

✅ `kubectl get nodes` shows Ready status
✅ `kubectl get pods` shows all pods Running
✅ `kubectl get services` shows services with endpoints
✅ Frontend URL loads the application
✅ Backend URL shows API documentation

## 🆘 If All Else Fails

1. Restart your computer
2. Start Docker Desktop
3. Run the quick-fix.ps1 script
4. Follow the manual steps above

Remember: The key is to ensure Docker Desktop is running properly before starting Minikube!