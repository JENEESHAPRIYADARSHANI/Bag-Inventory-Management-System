# GitHub Push Guide - Security & Best Practices

## ⚠️ CRITICAL: Sensitive Data Found!

Your code contains **REAL PASSWORDS** that must be removed before pushing to GitHub!

### 🔴 Passwords Found in Your Code:

1. **Backend/quotation-service/src/main/resources/application.properties**
   - Password: `Wr250x&@8052`

2. **Backend/product-catalog-service/src/main/resources/application.yaml**
   - Password: `@Abishek2001`

3. **Backend/logistics-Service/src/main/resources/application.yaml**
   - Password: `Nuskyny@1234`

4. **Backend/Order-Management-Service/src/main/resources/application.properties**
   - Password: `order123`

5. **Backend/Order-Management-Service/src/main/resources/application.yaml**
   - Password: `password123`

---

## 🛡️ Step 1: Secure Your Configuration Files

### Option A: Use Environment Variables (Recommended)

Replace hardcoded passwords with environment variables:

**Before:**
```properties
spring.datasource.password=Wr250x&@8052
```

**After:**
```properties
spring.datasource.password=${DB_PASSWORD:defaultPassword}
```

### Option B: Use application-local.properties (Not Committed)

Create separate files for local development that are ignored by Git:

1. Create `application-local.properties` with your real passwords
2. Update main `application.properties` to use placeholders
3. Add `application-local.properties` to `.gitignore` (already done)

---

## 📝 Step 2: Update Configuration Files

### For quotation-service

**File:** `Backend/quotation-service/src/main/resources/application.properties`

Change:
```properties
spring.datasource.password=Wr250x&@8052
```

To:
```properties
spring.datasource.password=${DB_PASSWORD:root}
```

### For product-catalog-service

**File:** `Backend/product-catalog-service/src/main/resources/application.yaml`

Change:
```yaml
password: "@Abishek2001"
```

To:
```yaml
password: ${DB_PASSWORD:root}
```

### For logistics-Service

**File:** `Backend/logistics-Service/src/main/resources/application.yaml`

Change:
```yaml
password: Nuskyny@1234
```

To:
```yaml
password: ${DB_PASSWORD:root}
```

### For Order-Management-Service

**Files:** Both `application.properties` and `application.yaml`

Change:
```properties
spring.datasource.password=order123
```

To:
```properties
spring.datasource.password=${DB_PASSWORD:root}
```

---

## 🗑️ Step 3: Remove Unnecessary Files

### Delete target folders (build artifacts):
```bash
# Windows
for /d /r . %d in (target) do @if exist "%d" rd /s /q "%d"

# Linux/Mac
find . -name "target" -type d -exec rm -rf {} +
```

### Delete node_modules (if needed):
```bash
# Windows
for /d /r . %d in (node_modules) do @if exist "%d" rd /s /q "%d"

# Linux/Mac
find . -name "node_modules" -type d -exec rm -rf {} +
```

---

## 📋 Step 4: Create Environment Setup Guide

Create a file for other developers to set up their environment:

**File:** `.env.example` (in each service folder)
```properties
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quotation_db
DB_USERNAME=root
DB_PASSWORD=your_password_here

# Application Configuration
SERVER_PORT=8080
```

---

## 🚀 Step 5: Push to GitHub

### If this is a NEW repository:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: Quotation Management System"

# 4. Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push to GitHub
git push -u origin main
```

### If repository ALREADY EXISTS:

```bash
# 1. Check current status
git status

# 2. Add all changes
git add .

# 3. Commit with message
git commit -m "Update: Complete quotation and order management system"

# 4. Pull latest changes (if any)
git pull origin main --rebase

# 5. Push to GitHub
git push origin main
```

---

## 🔍 Step 6: Verify Before Pushing

### Check what will be committed:
```bash
git status
```

### Check for sensitive data:
```bash
# Search for password in staged files
git grep -i "password" $(git diff --cached --name-only)

# Search for common sensitive patterns
git grep -E "(password|secret|api_key|token).*=.*[^$]" $(git diff --cached --name-only)
```

### View changes:
```bash
git diff --cached
```

---

## ⚡ Quick Commands Reference

```bash
# Check git status
git status

# Add specific file
git add path/to/file

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- path/to/file
```

---

## 📚 Create README for Setup Instructions

Add this section to your README.md:

```markdown
## Environment Setup

### Database Configuration

Create a `.env` file or set environment variables:

```bash
export DB_PASSWORD=your_password
export DB_USERNAME=root
export DB_HOST=localhost
```

### Windows:
```cmd
set DB_PASSWORD=your_password
set DB_USERNAME=root
set DB_HOST=localhost
```

### Or update application.properties locally:
Copy `application.properties` to `application-local.properties` and update with your credentials.
```

---

## 🔐 Security Checklist

Before pushing, ensure:

- [ ] All passwords replaced with environment variables
- [ ] No API keys or tokens in code
- [ ] `.gitignore` file is present and configured
- [ ] `target/` folders are not included
- [ ] `node_modules/` folders are not included
- [ ] No `.env` files with real credentials
- [ ] Database credentials use placeholders
- [ ] Sensitive configuration files are in `.gitignore`

---

## 🆘 If You Already Pushed Passwords

If you accidentally pushed passwords to GitHub:

### 1. Change ALL passwords immediately
- Change database passwords
- Change any API keys
- Change any other credentials

### 2. Remove from Git history (Advanced)
```bash
# Install BFG Repo-Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove passwords from history
bfg --replace-text passwords.txt

# Force push (WARNING: This rewrites history)
git push --force
```

### 3. Consider the repository compromised
- Rotate all credentials
- Review access logs
- Consider making repository private

---

## 📞 Need Help?

Common issues:

**Issue:** `fatal: remote origin already exists`
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

**Issue:** `rejected - non-fast-forward`
```bash
git pull origin main --rebase
git push origin main
```

**Issue:** Large files rejected
```bash
# Remove large files from staging
git reset path/to/large/file
```

---

## ✅ Final Steps

1. ✅ Remove all passwords from configuration files
2. ✅ Update files to use environment variables
3. ✅ Verify `.gitignore` is working
4. ✅ Test locally with environment variables
5. ✅ Commit and push to GitHub
6. ✅ Verify on GitHub that no passwords are visible
7. ✅ Add setup instructions to README

---

**Remember:** Never commit passwords, API keys, or sensitive data to version control!
