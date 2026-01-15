# Quick Fix Script for Phase IV Issues
# Run this script to resolve immediate problems

Write-Host "Quick Fix for Phase IV Issues" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Step 1: Stop and clean Minikube
Write-Host "Stopping and cleaning Minikube..." -ForegroundColor Yellow
minikube stop
minikube delete
Write-Host "Minikube cleaned" -ForegroundColor Green

# Step 2: Clean Docker system (free up space)
Write-Host "Cleaning Docker system..." -ForegroundColor Yellow
docker system prune -f
docker volume prune -f
docker image prune -a -f
Write-Host "Docker system cleaned" -ForegroundColor Green

# Step 3: Start fresh Minikube with more resources
Write-Host "Starting fresh Minikube..." -ForegroundColor Yellow
minikube start --driver=docker --memory=6144 --cpus=4 --disk-size=20g
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start Minikube. Trying with different settings..." -ForegroundColor Red
    minikube start --driver=docker --memory=4096 --cpus=2
}

# Step 4: Configure Docker environment
Write-Host "Configuring Docker environment..." -ForegroundColor Yellow
& minikube docker-env --shell powershell | Invoke-Expression

# Step 5: Test Docker connection
Write-Host "Testing Docker connection..." -ForegroundColor Yellow
docker ps
if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker is working" -ForegroundColor Green
} else {
    Write-Host "Docker connection failed" -ForegroundColor Red
}

# Step 6: Test kubectl connection
Write-Host "Testing kubectl connection..." -ForegroundColor Yellow
kubectl get nodes
if ($LASTEXITCODE -eq 0) {
    Write-Host "kubectl is working" -ForegroundColor Green
} else {
    Write-Host "kubectl connection failed" -ForegroundColor Red
}

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run: docker build -t todo-backend:latest ./backend" -ForegroundColor Cyan
Write-Host "2. Run: docker build -t todo-frontend:latest ./frontend" -ForegroundColor Cyan
Write-Host "3. Run: helm install todo-chatbot ./todo-chart" -ForegroundColor Cyan
Write-Host "4. Run: kubectl get pods" -ForegroundColor Cyan

Write-Host "Quick fix completed!" -ForegroundColor Green