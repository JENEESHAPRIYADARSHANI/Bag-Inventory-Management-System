# 💾 Save Your Changes and Pull from Main

## Your Situation
You need to pull code from the main branch, but you want to keep all your current changes.

---

## 🎯 Best Approach: Commit Your Changes First

### Step 1: Check What Changed
```bash
git status
```

This shows all files you've modified.

### Step 2: Add All Your Changes
```bash
git add .
```

This stages all your changes for commit.

### Step 3: Commit Your Changes
```bash
git commit -m "feat: connect order service and prepare AWS deployment"
```

### Step 4: Pull from Main
```bash
git pull origin main
```

If there are conflicts, Git will tell you which files need to be merged.

### Step 5: Push Your Changes
```bash
git push origin your-branch-name
```

Replace `your-branch-name` with your actual branch name.

---

## 🔀 Alternative: Stash Your Changes

If you don't want to commit yet:

### Step 1: Stash Your Changes
```bash
git stash save "my work in progress"
```

This temporarily saves your changes.

### Step 2: Pull from Main
```bash
git pull origin main
```

### Step 3: Apply Your Changes Back
```bash
git stash pop
```

This brings back your changes on top of the new code.

---

## 📋 What You've Changed

Based on our work, here are the files that have been modified or created:

### Modified Files:
- `Backend/quotation-service/src/main/resources/application.properties`
- `Backend/quotation-service/ecs-task-definition.json` (if you updated it)
- `frontend/.env.development`
- `frontend/.env.production`
- `frontend/src/services/quotationApi.ts`

### New Files Created:
- `Backend/Order-Management-Service/Dockerfile`
- `Backend/Order-Management-Service/.dockerignore`
- `Backend/Order-Management-Service/ecs-task-definition.json`
- `Backend/Order-Management-Service/src/main/java/com/starbag/Order_Management_Service/config/CorsConfig.java`
- `Backend/Order-Management-Service/deploy-to-aws.bat`
- `Backend/Order-Management-Service/deploy-to-aws.sh`
- `Backend/Order-Management-Service/get-service-ip.bat`
- `Backend/Order-Management-Service/get-service-ip.sh`
- Multiple documentation files (*.md)

---

## 🚀 Recommended Workflow

### Option 1: Commit Everything (Recommended)
```bash
# 1. Check status
git status

# 2. Add all changes
git add .

# 3. Commit with descriptive message
git commit -m "feat: add order service integration and AWS deployment configs

- Fixed order.service.url configuration
- Added Order Service deployment files
- Created CORS configuration for Order Service
- Added deployment scripts and documentation
- Updated quotation service to connect to order service"

# 4. Pull latest from main
git pull origin main

# 5. Resolve conflicts if any (Git will tell you)

# 6. Push your changes
git push origin your-branch-name
```

### Option 2: Create a New Branch for Your Work
```bash
# 1. Create and switch to new branch
git checkout -b feature/order-service-integration

# 2. Add all changes
git add .

# 3. Commit
git commit -m "feat: order service integration and AWS deployment"

# 4. Push to new branch
git push origin feature/order-service-integration

# 5. Pull main into your branch
git pull origin main

# 6. Resolve conflicts if any
```

---

## ⚠️ Handling Merge Conflicts

If you get conflicts when pulling:

### Step 1: Git Will Show Conflict Files
```
CONFLICT (content): Merge conflict in Backend/quotation-service/src/main/resources/application.properties
```

### Step 2: Open Conflicted Files
Look for conflict markers:
```
<<<<<<< HEAD
your changes
=======
changes from main
>>>>>>> main
```

### Step 3: Resolve Conflicts
- Keep your changes
- Keep their changes
- Or merge both

### Step 4: Mark as Resolved
```bash
git add Backend/quotation-service/src/main/resources/application.properties
```

### Step 5: Complete the Merge
```bash
git commit -m "merge: resolved conflicts with main"
```

---

## 📝 Quick Commands

### Save and Pull (Simple)
```bash
git add .
git commit -m "save my work"
git pull origin main
```

### Save and Pull (With Stash)
```bash
git stash
git pull origin main
git stash pop
```

### Check What You Changed
```bash
git status
git diff
```

### See Your Commit History
```bash
git log --oneline
```

---

## 🔍 Before You Pull

### Check Your Current Branch
```bash
git branch
```

The branch with `*` is your current branch.

### Check Remote Branches
```bash
git branch -r
```

### Check if You're Up to Date
```bash
git fetch origin
git status
```

---

## 💡 Best Practices

### 1. Always Commit Before Pulling
This makes it easier to resolve conflicts.

### 2. Use Descriptive Commit Messages
```bash
# Good
git commit -m "feat: add order service integration"

# Bad
git commit -m "changes"
```

### 3. Pull Frequently
Don't wait too long to pull from main.

### 4. Create Feature Branches
Work on features in separate branches, not directly on main.

---

## 🆘 If Something Goes Wrong

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Abort a Merge
```bash
git merge --abort
```

### Discard All Local Changes
```bash
git reset --hard origin/main
```
⚠️ Warning: This will delete all your changes!

---

## 📊 Workflow Diagram

```
Your Current State
    ↓
git add . (stage changes)
    ↓
git commit -m "message" (save changes)
    ↓
git pull origin main (get latest code)
    ↓
Resolve conflicts (if any)
    ↓
git push origin your-branch (share your work)
```

---

## ✅ Step-by-Step Checklist

- [ ] Check current branch: `git branch`
- [ ] Check what changed: `git status`
- [ ] Stage changes: `git add .`
- [ ] Commit changes: `git commit -m "descriptive message"`
- [ ] Pull from main: `git pull origin main`
- [ ] Resolve conflicts (if any)
- [ ] Test your code still works
- [ ] Push changes: `git push origin your-branch`

---

## 🎯 Quick Start

**If you want to save everything and pull:**

```bash
git add .
git commit -m "feat: order service integration and deployment configs"
git pull origin main
```

**If there are conflicts, Git will tell you which files to fix.**

---

## 📞 Need Help?

### See What Will Be Pulled
```bash
git fetch origin
git log HEAD..origin/main --oneline
```

### See Differences
```bash
git fetch origin
git diff HEAD..origin/main
```

### Create Backup Branch (Just in Case)
```bash
git branch backup-$(date +%Y%m%d)
```

This creates a backup of your current state.

---

## 🎉 You're Ready!

Choose your approach:
1. **Commit first** (recommended) - Saves your work permanently
2. **Stash** - Temporary save, good for quick pulls

Then pull from main and continue working!

