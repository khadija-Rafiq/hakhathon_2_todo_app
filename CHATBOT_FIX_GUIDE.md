# 🔧 Chatbot Fix - Complete Guide (Urdu)

## ❌ Problem Kya Thi?

Aapki Azure deployment mein chatbot kaam nahi kar raha tha aur ye errors aa rahe the:
1. **401 Error**: "User not found"
2. **API URL Issue**: Code `localhost:8000` use kar raha tha production mein
3. **404 Errors**: Unnecessary routes missing

## ✅ Solution - Kya Fix Kiya?

### 1. Code Changes (Already Done ✓)

#### File 1: `frontend/lib/utils.ts`
**Problem**: Hardcoded `localhost:8000` fallback tha
**Fix**: Environment variable ko properly use karne ke liye update kiya

```typescript
// BEFORE (Wrong ❌)
return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// AFTER (Correct ✅)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error('API URL is not configured');
}
return apiUrl;
```

#### File 2: `frontend/lib/api.ts`
**Problem**: Hardcoded `API_URL` constant
**Fix**: `getApiUrl()` function use karne ke liye update kiya

```typescript
// BEFORE (Wrong ❌)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
fetch(`${API_URL}/api/...`)

// AFTER (Correct ✅)
import { getApiUrl } from '@/lib/utils';
fetch(`${getApiUrl()}/api/...`)
```

#### File 3: `frontend/staticwebapp.config.json` (NEW)
Azure Static Web Apps ke liye configuration file add ki

### 2. Azure Portal Configuration (AAPKO KARNA HAI 👇)

#### Step-by-Step Instructions:

**Step 1: Azure Portal Open Karo**
1. Browser mein jao: https://portal.azure.com
2. Login karo apne account se
3. Search bar mein apni Static Web App ka naam search karo
4. Apni app par click karo

**Step 2: Configuration Section Mein Jao**
1. Left sidebar mein **"Configuration"** option dhundo
2. Us par click karo
3. **"Application settings"** tab select karo

**Step 3: Environment Variable Add Karo**
1. **"+ Add"** button par click karo (ya **"New application setting"**)
2. Ye details enter karo:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://khadija-rafiq-todo-backend.hf.space
   ```
3. **"OK"** button par click karo
4. **"Save"** button par click karo (top par hoga)

**Step 4: Deployment Trigger Karo**

**Option A - GitHub se Automatic (Recommended)**
1. Apne GitHub repository mein jao
2. Ye files commit aur push karo:
   ```bash
   git add .
   git commit -m "Fix chatbot API URL configuration"
   git push
   ```
3. GitHub Actions automatically deploy karega (5-10 minutes lagenge)

**Option B - Manual Build (Agar GitHub Actions nahi hai)**
1. Local machine par:
   ```bash
   cd frontend
   npm run build
   ```
2. Azure Portal mein manually upload karo

### 3. Verification - Check Karo Sab Kaam Kar Raha Hai

**Step 1: Deployment Complete Hone Ka Wait Karo**
- Azure Portal mein "Deployments" section check karo
- Latest deployment "Succeeded" show karna chahiye

**Step 2: Website Open Karo**
- Apni Azure Static Web App URL open karo
- Example: `https://ambitious-wave-0d38b6c1e.azurestaticapps.net`

**Step 3: Browser Console Check Karo**
1. Website par F12 press karo (Developer Tools open hoga)
2. "Console" tab select karo
3. Koi red errors nahi hone chahiye
4. Ye message dikhna chahiye:
   ```
   Attempting login with API URL: https://khadija-rafiq-todo-backend.hf.space
   ```

**Step 4: Chatbot Test Karo**
1. Login karo apne account se
2. Dashboard par jao
3. Chatbot icon par click karo (💬 ya 🤖)
4. Koi message type karo, jaise:
   - "Show me all my tasks"
   - "Add a task to buy groceries"
   - "What are my pending tasks?"
5. Response aana chahiye (2-3 seconds mein)

## 🐛 Common Issues & Solutions

### Issue 1: "API URL is not configured" Error

**Symptoms:**
- Chatbot open nahi ho raha
- Console mein error: "API URL is not configured"

**Solution:**
1. Azure Portal mein Configuration check karo
2. Environment variable exactly `NEXT_PUBLIC_API_URL` hona chahiye (case-sensitive!)
3. Value mein `https://` include hona chahiye
4. Save karne ke baad redeploy karo

### Issue 2: "User not found" (401 Error)

**Symptoms:**
- Chatbot open ho raha hai
- Message send karne par "User not found" error

**Possible Causes:**
1. **Token expired**: Logout karke phir login karo
2. **Backend issue**: Backend (HuggingFace) down ho sakta hai
3. **Database issue**: Neon database connection issue

**Solution:**
1. Logout karo aur phir login karo
2. Backend check karo: https://khadija-rafiq-todo-backend.hf.space/health
3. Response `{"status": "ok"}` hona chahiye

### Issue 3: CORS Errors

**Symptoms:**
- Console mein "CORS policy" error
- Network tab mein requests fail ho rahe hain

**Solution:**
Backend already configured hai, but agar issue hai to:
1. Backend `.env` file mein check karo
2. HuggingFace Space restart karo

### Issue 4: 404 Errors for Routes

**Symptoms:**
- Console mein multiple 404 errors
- Routes like `/features/index.txt` missing

**Solution:**
- Ye errors ignore kar sakte ho (Next.js ka default behavior hai)
- Ya `staticwebapp.config.json` already fix kar diya hai

## 📋 Complete Checklist

Deployment ke baad ye sab check karo:

- [ ] Azure Portal mein `NEXT_PUBLIC_API_URL` set hai
- [ ] GitHub Actions deployment successful hai
- [ ] Website load ho rahi hai
- [ ] Login/Signup kaam kar raha hai
- [ ] Dashboard tasks show ho rahe hain
- [ ] Chatbot icon visible hai
- [ ] Chatbot open ho raha hai
- [ ] Chatbot messages send ho rahe hain
- [ ] Chatbot responses aa rahe hain
- [ ] Browser console mein koi red errors nahi hain

## 🔍 Debugging Tips

### Browser Console Check Karo
```
F12 press karo → Console tab
```
Ye messages dikhne chahiye:
- ✅ "Attempting login with API URL: https://khadija-rafiq-todo-backend.hf.space"
- ✅ "Login successful"
- ✅ "Response status: 200"

Ye messages NAHI dikhne chahiye:
- ❌ "localhost:8000"
- ❌ "API URL is not configured"
- ❌ "CORS policy"

### Network Tab Check Karo
```
F12 press karo → Network tab
```
1. Chatbot message send karo
2. Network tab mein `/api/{user_id}/chat` request dhundo
3. Status Code `200` hona chahiye
4. Response mein proper message hona chahiye

### Azure Logs Check Karo
```
Azure Portal → Your Static Web App → Monitoring → Log stream
```
Real-time logs dekh sakte ho

## 📞 Support

Agar abhi bhi issue hai to:

1. **Browser Console Screenshot** lo (F12 → Console tab)
2. **Network Tab Screenshot** lo (F12 → Network tab)
3. **Azure Configuration Screenshot** lo (Configuration → Application settings)
4. Ye sab share karo for debugging

## 🎉 Success!

Agar sab kuch kaam kar raha hai to:
- ✅ Chatbot properly configured hai
- ✅ Environment variables set hain
- ✅ Azure deployment successful hai
- ✅ Backend connection working hai

Congratulations! 🎊

---

**Modified Files:**
1. `frontend/lib/utils.ts` - API URL handling
2. `frontend/lib/api.ts` - Removed hardcoded URLs
3. `frontend/staticwebapp.config.json` - Azure config (NEW)
4. `frontend/CHATBOT_FIX_GUIDE.md` - This file (NEW)
5. `frontend/AZURE_DEPLOYMENT.md` - Deployment instructions (NEW)

**Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
