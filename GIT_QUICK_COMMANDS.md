# 🚀 Git Quick Commands - Save and Pull

## ⚡ Super Quick (3 Commands)

```bash
git add .
git commit -m "feat: order service integration"
git pull origin main
```

---

## 📋 What Each Command Does

### `git add .`
Stages all your changes (prepares them for commit)

### `git commit -m "message"`
Saves your changes with a description

### `git pull origin main`
Gets the latest code from the main branch

---

## 🎯 Common Scenarios

### Scenario 1: Save Everything and Pull
```bash
git add .
git commit -m "save my work"
git pull origin main
```

### Scenario 2: Save Specific Files
```bash
git add Backend/quotation-service/src/main/resources/application.properties
git commit -m "fix: update order service URL"
git pull origin main
```

### Scenario 3: Temporary Save (Stash)
```bash
git stash
git pull origin main
git stash pop
```

### Scenario 4: Create New Branch for Your Work
```bash
git checkout -b feature/my-changes
git add .
git commit -m "my changes"
git push origin feature/my-changes
```

---

## 🔍 Check Before You Pull

### See What Changed
```bash
git status
```

### See Detailed Changes
```bash
git diff
```

### See Your Current Branch
```bash
git branch
```

---

## ⚠️ If You Get Conflicts

### Step 1: Git Will Tell You
```
CONFLICT (content): Merge conflict in file.txt
```

### Step 2: Open the File
Look for:
```
<<<<<<< HEAD
your changes
=======
changes from main
>>>>>>> main
```

### Step 3: Fix It
Choose which code to keep, then remove the markers.

### Step 4: Mark as Resolved
```bash
git add file.txt
git commit -m "merge: resolved conflicts"
```

---

## 🛠️ Useful Commands

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Discard All Local Changes
```bash
git reset --hard origin/main
```
⚠️ Warning: This deletes your changes!

### See Commit History
```bash
git log --oneline
```

### Create Backup Branch
```bash
git branch backup-my-work
```

---

## 📊 Your Workflow

```
1. git status          (check what changed)
2. git add .           (stage changes)
3. git commit -m "msg" (save changes)
4. git pull origin main (get latest)
5. git push origin branch (share your work)
```

---

## 🎯 Use the Helper Scripts

### Windows:
```bash
save-and-pull.bat
```

### Linux/Mac:
```bash
chmod +x save-and-pull.sh
./save-and-pull.sh
```

These scripts will guide you through the process!

---

## ✅ Quick Checklist

- [ ] `git status` - See what changed
- [ ] `git add .` - Stage changes
- [ ] `git commit -m "message"` - Save changes
- [ ] `git pull origin main` - Get latest code
- [ ] Resolve conflicts (if any)
- [ ] `git push origin branch` - Share your work

---

## 💡 Pro Tips

1. **Commit often** - Small commits are easier to manage
2. **Pull frequently** - Stay up to date with the team
3. **Use descriptive messages** - Future you will thank you
4. **Create branches** - Keep main clean

---

## 🆘 Emergency Commands

### I Made a Mistake!
```bash
git reflog  # See all your actions
git reset --hard HEAD@{1}  # Go back one step
```

### I Want to Start Over
```bash
git stash  # Save current work
git reset --hard origin/main  # Reset to main
git stash pop  # Get your work back
```

### I Need Help
```bash
git status  # Always start here
```

---

## 🎉 You're Ready!

**To save and pull right now:**

```bash
git add .
git commit -m "feat: order service integration and deployment"
git pull origin main
```

**Or use the helper script:**

```bash
# Windows
save-and-pull.bat

# Linux/Mac
./save-and-pull.sh
```

