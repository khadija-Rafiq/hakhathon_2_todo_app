# Phase IV Test Script
# This script tests the deployed application

Write-Host "🧪 Testing Phase IV Deployment" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Test 1: Check if Minikube is running
Write-Host "1. Testing Minikube status..." -ForegroundColor Yellow
$minikubeStatus = minikube status 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Minikube is running" -ForegroundColor Green
} else {
    Write-Host "❌ Minikube is not running" -ForegroundColor Red
    exit 1
}

# Test 2: Check if kubectl works
Write-Host "2. Testing kubectl connection..." -ForegroundColor Yellow
$nodes = kubectl get nodes --no-headers 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ kubectl is connected" -ForegroundColor Green
} else {
    Write-Host "❌ kubectl connection failed" -ForegroundColor Red
    exit 1
}

# Test 3: Check pods
Write-Host "3. Checking pod status..." -ForegroundColor Yellow
$pods = kubectl get pods --no-headers
if ($pods) {
    Write-Host "✅ Pods found:" -ForegroundColor Green
    kubectl get pods
} else {
    Write-Host "❌ No pods found" -ForegroundColor Red
}

# Test 4: Check services
Write-Host "4. Checking services..." -ForegroundColor Yellow
$services = kubectl get services --no-headers
if ($services) {
    Write-Host "✅ Services found:" -ForegroundColor Green
    kubectl get services
} else {
    Write-Host "❌ No services found" -ForegroundColor Red
}

# Test 5: Try to get service URLs
Write-Host "5. Getting service URLs..." -ForegroundColor Yellow
try {
    $frontendUrl = minikube service frontend-nodeport --url 2>$null
    $backendUrl = minikube service backend-nodeport --url 2>$null
    
    if ($frontendUrl) {
        Write-Host "✅ Frontend URL: $frontendUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend service not accessible" -ForegroundColor Red
    }
    
    if ($backendUrl) {
        Write-Host "✅ Backend URL: $backendUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend service not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not get service URLs" -ForegroundColor Red
}

# Test 6: Check Helm deployment
Write-Host "6. Checking Helm deployment..." -ForegroundColor Yellow
$helmList = helm list --no-headers 2>$null
if ($helmList) {
    Write-Host "✅ Helm deployments found:" -ForegroundColor Green
    helm list
} else {
    Write-Host "❌ No Helm deployments found" -ForegroundColor Red
}

Write-Host "`n📊 Test Summary:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

# Final recommendations
Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. If tests passed, access the URLs above" -ForegroundColor Cyan
Write-Host "2. If tests failed, run quick-fix.ps1" -ForegroundColor Cyan
Write-Host "3. Check PHASE4-MANUAL-GUIDE.md for detailed troubleshooting" -ForegroundColor Cyan

Write-Host "`n✅ Testing completed!" -ForegroundColor Green