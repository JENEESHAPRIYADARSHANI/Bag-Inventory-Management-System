# Quick GitHub Push Steps

## 🚨 BEFORE YOU PUSH - CRITICAL!

Your code has **REAL PASSWORDS** that must be removed first!

---

## ⚡ Quick Fix (Choose One Method)

### Method 1: Automatic (Recommended)
```bash
# Run the security script
secure-config.bat

# Or on Linux/Mac
chmod +x secure-config.sh
./secure-config.sh
```

### Method 2: Manual
Replace these passwords in your config files:

1. `Backend/quotation-service/src/main/resources/application.properties`
   - Change: `spring.datasource.password=Wr250x&@8052`
   - To: `spring.datasource.password=${DB_PASSWORD:root}`

2. `Backend/product-catalog-service/src/main/resources/application.yaml`
   - Change: `password: "@Abishek2001"`
   - To: `password: ${DB_PASSWORD:root}`

3. `Backend/logistics-Service/src/main/resources/application.yaml`
   - Change: `password: Nuskyny@1234`
   - To: `password: ${DB_PASSWORD:root}`

4. `Backend/Order-Management-Service/src/main/resources/application.properties`
   - Change: `spring.datasource.password=order123`
   - To: `spring.datasource.password=${DB_PASSWORD:root}`

5. `Backend/Order-Management-Service/src/main/resources/application.yaml`
   - Change: `password: password123`
   - To: `password: ${DB_PASSWORD:root}`

---

## 📤 Push to GitHub

### Step 1: Check Status
```bash
git status
```

### Step 2: Add Files
```bash
git add .
```

### Step 3: Commit
```bash
git commit -m "Complete quotation management system with secure configuration"
```

### Step 4: Push
```bash
# If first time
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# If already connected
git push origin main
```

---

## 🔧 Set Environment Variables Locally

After pushing, set your real passwords locally:

### Windows:
```cmd
set DB_PASSWORD=Wr250x&@8052
```

### Linux/Mac:
```bash
export DB_PASSWORD=Wr250x&@8052
```

### Or create `.env` file (not committed):
```
DB_PASSWORD=Wr250x&@8052
```

---

## ✅ Verification Checklist

- [ ] Passwords removed from all config files
- [ ] `.gitignore` file exists
- [ ] Tested locally with environment variables
- [ ] Committed changes
- [ ] Pushed to GitHub
- [ ] Verified on GitHub - no passwords visible

---

## 🆘 Common Issues

**Issue:** "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_URL
```

**Issue:** "Updates were rejected"
```bash
git pull origin main --rebase
git push origin main
```

**Issue:** "Large files"
```bash
# Remove target folders first
for /d /r . %d in (target) do @if exist "%d" rd /s /q "%d"
git add .
git commit -m "Remove build artifacts"
```

---

## 📞 Need More Help?

See detailed guide: `GITHUB_PUSH_GUIDE.md`
