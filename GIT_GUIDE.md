# 📝 Git Workflow Guide

Panduan lengkap untuk version control menggunakan Git pada project Goat Milk Monitor.

---

## 🚀 Initial Setup

### 1. Initialize Git Repository (if not already done)

```bash
git init
```

### 2. Configure Git (First Time Only)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Optional: Set default branch name to main
git config --global init.defaultBranch main
```

### 3. Check Git Status

```bash
git status
```

---

## 📦 First Commit

### Add All Files

```bash
# Stage all files
git add .

# Or stage specific files
git add src/pages/index.astro
git add package.json
```

### Create Initial Commit

```bash
git commit -m "Initial commit: Setup Astro project with Tailwind CSS and Chart.js"
```

### Commit Message Template

```bash
git commit -m "feat: Add dashboard with monitoring features

- Added Chart component for data visualization
- Added Card component for statistics display
- Integrated Tailwind CSS for styling
- Added 3 demo pages: dashboard, charts, components"
```

---

## 🌿 Branching Strategy

### Create New Branch

```bash
# Create and switch to new branch
git checkout -b feature/add-authentication

# Or use newer syntax
git switch -c feature/add-authentication
```

### Branch Naming Convention

- **Feature**: `feature/feature-name`
- **Bug Fix**: `fix/bug-description`
- **Hotfix**: `hotfix/critical-issue`
- **Documentation**: `docs/update-readme`
- **Refactor**: `refactor/component-cleanup`

### Switch Between Branches

```bash
# Switch to existing branch
git checkout main
git switch main

# List all branches
git branch -a
```

---

## 💾 Common Git Commands

### Check Status

```bash
# See what files have changed
git status

# Short format
git status -s
```

### Add Files

```bash
# Add all files
git add .

# Add specific file
git add src/pages/new-page.astro

# Add all files in a directory
git add src/components/

# Add files interactively
git add -p
```

### Commit Changes

```bash
# Commit with message
git commit -m "Add new feature"

# Commit with detailed message
git commit -m "feat: Add user authentication" -m "Implemented login, logout, and session management"

# Add and commit in one step (only for tracked files)
git commit -am "Update dashboard layout"
```

### View History

```bash
# View commit history
git log

# View history (pretty format)
git log --oneline --graph --decorate

# View last 5 commits
git log -5

# View commits by author
git log --author="Your Name"
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- filename.astro
git restore filename.astro

# Unstage file (keep changes)
git reset HEAD filename.astro
git restore --staged filename.astro

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - DANGEROUS!
git reset --hard HEAD~1
```

---

## 🔄 Working with Remote Repository

### Connect to GitHub/GitLab

```bash
# Add remote repository
git remote add origin https://github.com/username/goat-milk-monitor.git

# Verify remote
git remote -v

# Change remote URL
git remote set-url origin https://github.com/username/new-repo.git
```

### Push to Remote

```bash
# Push to main branch
git push -u origin main

# Push current branch
git push

# Push all branches
git push --all

# Force push (use with caution!)
git push --force
```

### Pull from Remote

```bash
# Pull latest changes
git pull

# Pull from specific branch
git pull origin main

# Fetch without merging
git fetch origin
```

### Clone Repository

```bash
# Clone repository
git clone https://github.com/username/goat-milk-monitor.git

# Clone specific branch
git clone -b develop https://github.com/username/goat-milk-monitor.git
```

---

## 🔀 Merging and Rebasing

### Merge Branch

```bash
# Switch to target branch
git checkout main

# Merge feature branch
git merge feature/new-feature

# Merge with no fast-forward (creates merge commit)
git merge --no-ff feature/new-feature
```

### Rebase Branch

```bash
# Rebase current branch onto main
git rebase main

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Continue after resolving conflicts
git rebase --continue

# Abort rebase
git rebase --abort
```

### Resolve Conflicts

```bash
# 1. Git will mark conflicts in files
# 2. Edit files to resolve conflicts
# 3. Mark as resolved
git add conflicted-file.astro

# 4. Continue merge/rebase
git commit  # for merge
git rebase --continue  # for rebase
```

---

## 🏷️ Tagging Releases

### Create Tag

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 9fceb02 -m "Release version 1.0.0"
```

### Push Tags

```bash
# Push single tag
git push origin v1.0.0

# Push all tags
git push --tags
```

### List and Delete Tags

```bash
# List all tags
git tag

# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

---

## 🔍 Useful Git Commands

### Stash Changes

```bash
# Stash current changes
git stash

# Stash with message
git stash save "Work in progress on dashboard"

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply and remove stash
git stash pop

# Apply specific stash
git stash apply stash@{2}

# Delete stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

### View Differences

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged

# Show changes between branches
git diff main feature/new-feature

# Show changes in specific file
git diff src/pages/index.astro
```

### Cherry Pick

```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Cherry pick multiple commits
git cherry-pick abc123 def456
```

### Clean Untracked Files

```bash
# Show what would be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd
```

---

## 📋 Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
git commit -m "feat(dashboard): Add milk production chart"

git commit -m "fix(chart): Fix chart not rendering on mobile devices"

git commit -m "docs(readme): Update installation instructions"

git commit -m "style(components): Format code with Prettier"

git commit -m "refactor(card): Simplify Card component logic"

git commit -m "chore(deps): Update Astro to v5.15.1"
```

---

## 🚦 Workflow Examples

### Feature Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-export

# 2. Make changes
# ... edit files ...

# 3. Stage and commit
git add .
git commit -m "feat: Add data export functionality"

# 4. Push to remote
git push -u origin feature/add-export

# 5. Create Pull Request on GitHub/GitLab
# 6. After review, merge to main
# 7. Delete feature branch
git branch -d feature/add-export
git push origin --delete feature/add-export
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix the bug
# ... edit files ...

# 3. Commit
git commit -am "fix: Resolve critical production bug"

# 4. Merge back to main
git checkout main
git merge hotfix/critical-bug

# 5. Tag the release
git tag -a v1.0.1 -m "Hotfix release 1.0.1"

# 6. Push everything
git push origin main --tags

# 7. Clean up
git branch -d hotfix/critical-bug
```

### Keep Fork Updated

```bash
# 1. Add upstream remote
git remote add upstream https://github.com/original/goat-milk-monitor.git

# 2. Fetch upstream changes
git fetch upstream

# 3. Merge upstream changes
git checkout main
git merge upstream/main

# 4. Push to your fork
git push origin main
```

---

## 🔐 .gitignore

The project already has a `.gitignore` file. Here's what's ignored:

```gitignore
# Build output
dist/

# Generated types
.astro/

# Dependencies
node_modules/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment variables
.env
.env.production

# macOS
.DS_Store

# IDE
.idea/
```

### Add More to .gitignore

```bash
# Add to .gitignore
echo ".vscode/settings.json" >> .gitignore
echo "*.log" >> .gitignore
```

---

## 🛠️ Git Configuration

### Useful Aliases

```bash
# Add to ~/.gitconfig or run these commands

git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --decorate --all'
```

### Use Aliases

```bash
git st          # Instead of: git status
git co main     # Instead of: git checkout main
git br          # Instead of: git branch
git ci -m "msg" # Instead of: git commit -m "msg"
git visual      # Pretty log graph
```

---

## 🐛 Troubleshooting

### Detached HEAD State

```bash
# Create a new branch from current state
git checkout -b recovery-branch

# Or discard changes and go back to main
git checkout main
```

### Merge Conflicts

```bash
# 1. See which files have conflicts
git status

# 2. Open conflicted files and resolve
# Look for: <<<<<<< HEAD, =======, >>>>>>>

# 3. After resolving, add files
git add resolved-file.astro

# 4. Complete the merge
git commit
```

### Accidentally Committed to Wrong Branch

```bash
# 1. Copy commit hash
git log

# 2. Switch to correct branch
git checkout correct-branch

# 3. Cherry-pick the commit
git cherry-pick abc123

# 4. Go back and remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

### Undo Pushed Commit

```bash
# Revert creates a new commit that undoes changes
git revert abc123
git push origin main

# Force push (dangerous, avoid if others are using the branch)
git reset --hard HEAD~1
git push --force origin main
```

---

## 📚 Best Practices

### Do's ✅

- ✅ Commit often with meaningful messages
- ✅ Pull before you push
- ✅ Use branches for features
- ✅ Review changes before committing
- ✅ Keep commits atomic (one logical change)
- ✅ Write descriptive commit messages
- ✅ Use .gitignore properly

### Don'ts ❌

- ❌ Don't commit sensitive data (.env files)
- ❌ Don't commit node_modules or dist
- ❌ Don't force push to shared branches
- ❌ Don't commit commented-out code
- ❌ Don't make huge commits
- ❌ Don't rewrite published history

---

## 🔗 Quick Reference

### Essential Commands

```bash
git init                    # Initialize repository
git clone <url>             # Clone repository
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push                    # Push to remote
git pull                    # Pull from remote
git branch                  # List branches
git checkout -b <branch>    # Create and switch branch
git merge <branch>          # Merge branch
git log                     # View history
```

### Getting Help

```bash
git help <command>
git <command> --help
```

---

## 📖 Resources

- [Pro Git Book](https://git-scm.com/book/en/v2)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Happy Version Controlling! 🎉**

Made with ❤️ for Goat Milk Monitor project