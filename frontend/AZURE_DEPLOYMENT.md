# Azure Static Web Apps Deployment Fix

## Problem
Chatbot nahi chal raha tha kyunki:
1. Environment variable properly load nahi ho raha tha
2. Code mein `localhost:8000` hardcoded tha

## Solution Applied

### 1. Code Changes
- ✅ `lib/utils.ts` - getApiUrl() function ko fix kiya
- ✅ `lib/api.ts` - Hardcoded API_URL ko getApiUrl() se replace kiya
- ✅ `staticwebapp.config.json` - Azure configuration file add ki

### 2. Azure Portal Configuration

#### Step 1: Azure Portal mein jao
1. https://portal.azure.com par jao
2. Apni Static Web App ko select karo

#### Step 2: Environment Variables Set karo
1. Left sidebar mein **"Configuration"** par click karo
2. **"Application settings"** tab mein jao
3. **"+ Add"** button par click karo
4. Ye environment variable add karo:

```
Name: NEXT_PUBLIC_API_URL
Value: https://khadija-rafiq-todo-backend.hf.space
```

5. **"Save"** button par click karo

#### Step 3: Redeploy karo
Option 1 - GitHub se automatic:
- GitHub repository mein koi bhi change push karo (ya workflow manually trigger karo)

Option 2 - Manual build:
```bash
cd frontend
npm run build
```

### 3. Verify Deployment

Deployment ke baad ye check karo:

1. **Browser Console** mein errors check karo (F12 press karo)
2. **Network Tab** mein API calls check karo
3. Chatbot test karo:
   - Dashboard se chatbot icon par click karo
   - Koi message send karo (e.g., "Show me all my tasks")
   - Response aana chahiye

### 4. Common Issues & Solutions

#### Issue: "API URL is not configured" error
**Solution:** 
- Azure Portal mein environment variable properly set hai ya nahi check karo
- Variable name exactly `NEXT_PUBLIC_API_URL` hona chahiye (case-sensitive)

#### Issue: CORS errors
**Solution:**
Backend mein CORS properly configured hona chahiye:
```python
# backend/main.py mein ye hona chahiye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ya specific Azure URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Issue: 404 errors for routes
**Solution:**
- `staticwebapp.config.json` file properly configured hai (already done)

### 5. Backend Configuration Check

Backend (HuggingFace Space) mein ye environment variables set hone chahiye:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `OPENROUTER_API_KEY` - AI chatbot ke liye (agar use kar rahe ho)

### 6. Testing Checklist

- [ ] Login/Signup kaam kar raha hai
- [ ] Tasks create/read/update/delete ho rahe hain
- [ ] Chatbot open ho raha hai
- [ ] Chatbot messages send ho rahe hain
- [ ] Chatbot responses aa rahe hain
- [ ] No console errors

## Files Modified
1. `frontend/lib/utils.ts` - API URL handling fix
2. `frontend/lib/api.ts` - Hardcoded URL removed
3. `frontend/staticwebapp.config.json` - Azure config added (NEW)
4. `frontend/AZURE_DEPLOYMENT.md` - This file (NEW)

## Next Steps
1. Azure Portal mein environment variable set karo
2. Code ko GitHub par push karo
3. Automatic deployment hone do
4. Test karo!

## Support
Agar koi issue ho to:
1. Browser console check karo (F12)
2. Network tab mein API calls check karo
3. Azure Portal mein Logs check karo (Monitoring > Log stream)
