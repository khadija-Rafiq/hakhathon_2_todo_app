# Running the Todo Application

This guide explains how to properly run the Todo application to avoid "Failed to fetch" errors and ensure all UI elements (including Add and Cancel buttons) are visible.

## Prerequisites

- Node.js 18+ installed
- Python 3.13+ installed
- UV package manager (`pip install uv`)
- Ensure backend dependencies are installed: `uv pip install -e .` in the `backend/` directory

## Starting the Applications

### Method 1: Using the provided scripts

Windows users can run either:
- Double-click `start-app.bat` to start both backend and frontend
- Or run `start-app.ps1` in PowerShell (may require enabling script execution: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`)

### Method 2: Manual startup

1. **Start the backend server:**
   ```bash
   cd backend
   python -m uvicorn main:app --host 127.0.0.1 --port 7860
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## API Configuration

The frontend expects the backend to be available at `http://127.0.0.1:7860`. This is configured in:

1. `frontend/lib/api.ts` - Default fallback URL
2. `frontend/.env.local` - Environment variable (created during setup)

If you need to change the backend URL, update the `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://your-backend-url:port
```

## Troubleshooting

### "Failed to fetch" errors:
- Verify the backend is running on port 7860
- Check that `http://127.0.0.1:7860/health` returns a successful response
- Ensure the frontend's API URL matches the backend URL
- Check browser console for CORS errors

### Missing "Add" and "Cancel" buttons:
- This is typically caused by JavaScript errors from failed API calls
- Fix the backend connectivity first
- Check browser console for error messages

### Backend not starting:
- Verify Python dependencies are installed
- Check that port 7860 is available
- Ensure database connection is configured correctly

## Testing the Connection

You can test the backend connection manually:
1. Visit `http://127.0.0.1:7860/health` in your browser - should return `{"status": "ok"}`
2. Visit `http://127.0.0.1:7860/docs` to access the API documentation

Once both applications are running and connected, the recurring task form with Add and Cancel buttons should display properly.