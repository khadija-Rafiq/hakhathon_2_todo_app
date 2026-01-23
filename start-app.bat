@echo off
REM Batch script to start the backend and frontend applications

echo Starting Todo Application...

REM Start the backend in a separate window
echo Starting backend on port 7860...
start cmd /k "cd /d backend && python -m uvicorn main:app --host 127.0.0.1 --port 7860"

REM Give the backend some time to start
timeout /t 5 /nobreak >nul

REM Check if backend is running
curl -s http://127.0.0.1:7860/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is running on http://127.0.0.1:7860
) else (
    echo ✗ Backend is not accessible on http://127.0.0.1:7860
    pause
    exit /b 1
)

REM Start the frontend
echo Starting frontend...
cd frontend
npm run dev