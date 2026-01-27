# 🚀 Quick Fix - Azure Environment Variable Setup

## ⚡ 3-Minute Fix

### 1️⃣ Azure Portal
```
https://portal.azure.com
→ Your Static Web App
→ Configuration
→ Application settings
→ + Add
```

### 2️⃣ Add This Variable
```
Name:  NEXT_PUBLIC_API_URL
Value: https://khadija-rafiq-todo-backend.hf.space
```

### 3️⃣ Save & Deploy
```
Click "Save" button
→ Push code to GitHub
→ Wait 5-10 minutes
→ Done! ✅
```

## 🧪 Test Karo

1. Open website
2. Login karo
3. Chatbot icon click karo
4. Message send karo: "Show me all my tasks"
5. Response aana chahiye! 🎉

## ❌ Agar Kaam Nahi Kar Raha

### Check 1: Environment Variable
```
Azure Portal → Configuration → Application settings
Variable name exactly "NEXT_PUBLIC_API_URL" hona chahiye
```

### Check 2: Browser Console
```
Press F12 → Console tab
"localhost:8000" NAHI dikhna chahiye
"https://khadija-rafiq-todo-backend.hf.space" dikhna chahiye
```

### Check 3: Backend Health
```
Open: https://khadija-rafiq-todo-backend.hf.space/health
Response: {"status": "ok"}
```

## 📱 Contact

Issue hai? Share karo:
- Browser console screenshot (F12)
- Network tab screenshot (F12 → Network)
- Azure configuration screenshot

---

**Files Changed:**
- ✅ `frontend/lib/utils.ts`
- ✅ `frontend/lib/api.ts`
- ✅ `frontend/staticwebapp.config.json` (NEW)

**Next Step:** Azure Portal mein environment variable add karo!
