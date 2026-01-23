# PowerShell script to start the backend and frontend applications

Write-Host "Starting Todo Application..." -ForegroundColor Green

# Start the backend in the background
Write-Host "Starting backend on port 7860..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "Set-Location '$(Resolve-Path ./backend)'; python -m uvicorn main:app --host 127.0.0.1 --port 7860"

# Give the backend some time to start
Start-Sleep -Seconds 5

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:7860/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Backend is running on http://127.0.0.1:7860" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Backend is not accessible on http://127.0.0.1:7860" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start the frontend
Write-Host "Starting frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run dev