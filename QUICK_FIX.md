# 🚀 Quick Fix - Azure Environment Variable Setup

## ⚡ CRITICAL: Do This First!

### Azure Portal Configuration (MUST DO!)

**Step 1: Open Azure Portal**
```
https://portal.azure.com
```

**Step 2: Find Your Static Web App**
- Search for your app name in the search bar
- Click on your Static Web App

**Step 3: Add Environment Variable**
```
Left Menu → Configuration → Application settings → + Add

Name:  NEXT_PUBLIC_API_URL
Value: https://khadija-rafiq-todo-backend.hf.space

Click "Save" button at the top!
```

**Step 4: Deploy Code**
```bash
git add .
git commit -m "Fix API URL configuration"
git push
```

**Step 5: Wait 5-10 Minutes**
- GitHub Actions will automatically deploy
- Check deployment status in Azure Portal

## 🧪 Test Karo

1. Open your website
2. Open Browser Console (Press F12)
3. Try to login
4. Console should show:
   ```
   ✅ Attempting login with API URL: https://khadija-rafiq-todo-backend.hf.space
   ```
   NOT:
   ```
   ❌ Attempting login with API URL: http://localhost:8000
   ```

## ❌ Agar Abhi Bhi localhost:8000 Dikhai De Raha Hai

### Solution 1: Clear Browser Cache
```
1. Press Ctrl + Shift + Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (Ctrl + F5)
```

### Solution 2: Hard Refresh
```
Press: Ctrl + Shift + R (Windows)
Or: Cmd + Shift + R (Mac)
```

### Solution 3: Check Azure Configuration
```
Azure Portal → Your App → Configuration

Verify:
✅ Variable name is exactly: NEXT_PUBLIC_API_URL
✅ Value is: https://khadija-rafiq-todo-backend.hf.space
✅ You clicked "Save" button
```

### Solution 4: Rebuild & Redeploy
```bash
# Make a small change to trigger rebuild
cd frontend
echo "# Updated" >> README.md
git add .
git commit -m "Trigger rebuild"
git push
```

## 📱 Files Changed

✅ `frontend/lib/auth.ts` - Fixed hardcoded localhost
✅ `frontend/lib/utils.ts` - Fixed API URL handling  
✅ `frontend/lib/api.ts` - Fixed all API calls
✅ `frontend/staticwebapp.config.json` - Fixed CSP issues

## 🆘 Still Not Working?

Share these screenshots:
1. Browser Console (F12 → Console tab)
2. Network Tab (F12 → Network tab → Try login)
3. Azure Configuration (Portal → Configuration → Application settings)

---

**Next Step:** Set environment variable in Azure Portal NOW!
