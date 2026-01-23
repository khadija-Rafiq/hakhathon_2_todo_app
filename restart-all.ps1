# Kill existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "uvicorn" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Starting backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\practice\hackathoe-2-phase-2-3\backend'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 7860"

Start-Sleep -Seconds 3

Write-Host "Starting frontend..." -ForegroundColor Green  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\practice\hackathoe-2-phase-2-3\frontend'; npm run dev"

Write-Host "Both services starting..." -ForegroundColor Yellow
Write-Host "Backend: http://127.0.0.1:7860" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan