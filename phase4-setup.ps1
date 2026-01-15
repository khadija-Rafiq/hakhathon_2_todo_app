# Phase IV: Local Kubernetes Deployment Setup Script
# This script automates the setup of Todo Chatbot on Minikube

Write-Host "🚀 Phase IV: Todo Chatbot Kubernetes Deployment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$prerequisites = @(
    @{Name="docker"; DisplayName="Docker"},
    @{Name="minikube"; DisplayName="Minikube"},
    @{Name="kubectl"; DisplayName="kubectl"},
    @{Name="helm"; DisplayName="Helm"}
)

$missingPrereqs = @()
foreach ($prereq in $prerequisites) {
    if (Test-Command $prereq.Name) {
        Write-Host "✅ $($prereq.DisplayName) is installed" -ForegroundColor Green
    } else {
        Write-Host "❌ $($prereq.DisplayName) is missing" -ForegroundColor Red
        $missingPrereqs += $prereq.DisplayName
    }
}

if ($missingPrereqs.Count -gt 0) {
    Write-Host "❌ Missing prerequisites: $($missingPrereqs -join ', ')" -ForegroundColor Red
    Write-Host "Please install missing tools and run again." -ForegroundColor Red
    exit 1
}

# Step 1: Clean up existing resources
Write-Host "🧹 Cleaning up existing resources..." -ForegroundColor Yellow
try {
    kubectl delete deployment --all --ignore-not-found=true
    kubectl delete service --all --ignore-not-found=true
    kubectl delete pod --all --ignore-not-found=true --force --grace-period=0
    helm uninstall todo-chatbot --ignore-not-found 2>$null
} catch {
    Write-Host "⚠️ Some cleanup operations failed (this is normal)" -ForegroundColor Yellow
}

# Step 2: Start Docker Desktop if not running
Write-Host "🐳 Checking Docker Desktop..." -ForegroundColor Yellow
$dockerStatus = docker version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop is not running. Please start Docker Desktop and wait for it to be ready." -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker Desktop is running" -ForegroundColor Green

# Step 3: Start Minikube
Write-Host "🎯 Starting Minikube..." -ForegroundColor Yellow
minikube start --driver=docker --memory=4096 --cpus=2
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Minikube" -ForegroundColor Red
    exit 1
}

# Step 4: Configure Docker environment for Minikube
Write-Host "🔧 Configuring Docker environment..." -ForegroundColor Yellow
& minikube docker-env --shell powershell | Invoke-Expression

# Step 5: Build Docker images
Write-Host "🏗️ Building Docker images..." -ForegroundColor Yellow

# Build backend image
Write-Host "Building backend image..." -ForegroundColor Cyan
Set-Location backend
docker build -t todo-backend:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build backend image" -ForegroundColor Red
    exit 1
}

# Build frontend image
Write-Host "Building frontend image..." -ForegroundColor Cyan
Set-Location ../frontend
docker build -t todo-frontend:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build frontend image" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Step 6: Deploy with Helm
Write-Host "📦 Deploying with Helm..." -ForegroundColor Yellow
helm install todo-chatbot ./todo-chart
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy with Helm" -ForegroundColor Red
    exit 1
}

# Step 7: Wait for pods to be ready
Write-Host "⏳ Waiting for pods to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod --all --timeout=300s

# Step 8: Expose services
Write-Host "🌐 Exposing services..." -ForegroundColor Yellow
kubectl expose deployment todo-chatbot-todo-chatbot-frontend --type=NodePort --port=3000 --name=frontend-nodeport --dry-run=client -o yaml | kubectl apply -f -
kubectl expose deployment todo-chatbot-todo-chatbot-backend --type=NodePort --port=7860 --name=backend-nodeport --dry-run=client -o yaml | kubectl apply -f -

# Step 9: Get service URLs
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host "📊 Service Status:" -ForegroundColor Yellow
kubectl get pods
kubectl get services

Write-Host "`n🌐 Access URLs:" -ForegroundColor Yellow
$frontendUrl = minikube service frontend-nodeport --url
$backendUrl = minikube service backend-nodeport --url

Write-Host "Frontend: $frontendUrl" -ForegroundColor Cyan
Write-Host "Backend: $backendUrl" -ForegroundColor Cyan

Write-Host "`n🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "kubectl get pods                    # Check pod status" -ForegroundColor Gray
Write-Host "kubectl logs <pod-name>             # View pod logs" -ForegroundColor Gray
Write-Host "kubectl describe pod <pod-name>     # Pod details" -ForegroundColor Gray
Write-Host "minikube dashboard                  # Open Kubernetes dashboard" -ForegroundColor Gray
Write-Host "helm list                           # List Helm releases" -ForegroundColor Gray

Write-Host "`n✅ Phase IV deployment completed successfully!" -ForegroundColor Green