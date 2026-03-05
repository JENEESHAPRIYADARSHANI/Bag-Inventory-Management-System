#!/bin/bash

# Save Your Changes and Pull from Main

echo "=========================================="
echo "Save Changes and Pull from Main"
echo "=========================================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Show what changed
echo "Files changed:"
git status --short
echo ""

# Ask user for confirmation
read -p "Do you want to commit these changes? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Get commit message
    echo "Enter commit message (or press Enter for default):"
    read COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="feat: order service integration and AWS deployment configs"
    fi
    
    # Add all changes
    echo "Adding all changes..."
    git add .
    
    # Commit
    echo "Committing changes..."
    git commit -m "$COMMIT_MSG"
    
    echo "✅ Changes committed!"
    echo ""
    
    # Pull from main
    echo "Pulling from main..."
    git pull origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Pull successful!"
        echo ""
        echo "Next steps:"
        echo "1. Test your code: mvn clean install"
        echo "2. Push your changes: git push origin $CURRENT_BRANCH"
    else
        echo "⚠️ Merge conflicts detected!"
        echo ""
        echo "To resolve:"
        echo "1. Open conflicted files"
        echo "2. Resolve conflicts"
        echo "3. Run: git add ."
        echo "4. Run: git commit -m 'merge: resolved conflicts'"
    fi
else
    echo "Cancelled. Your changes are not committed."
    echo ""
    echo "To save changes later:"
    echo "  git add ."
    echo "  git commit -m 'your message'"
    echo "  git pull origin main"
fi

echo ""
echo "=========================================="
