#!/bin/bash

echo "🚀 UHAS Toolkits Deployment Setup"
echo "=================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Run 'git init' first"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo ""

# Check required files
echo "Checking required files..."
required_files=("index.html" "manifest.json" "app.js" "sw.js" ".github/workflows/deploy-gh-pages.yml")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo ""
    echo "❌ Missing required files. Please ensure all files are present."
    exit 1
fi

echo ""
echo "🔧 Repository Setup Steps:"
echo ""

echo "1. Create new repository at: https://github.com/nunyalabs/uhas-kits"
echo "   - Set as public repository"
echo "   - Don't initialize with README (we have our own)"
echo ""

echo "2. Update remote URL and push:"
echo "   git remote set-url origin https://github.com/nunyalabs/uhas-kits.git"
echo "   git add ."
echo "   git commit -m \"🚀 Initial deployment of UHAS Research Toolkits\""  
echo "   git push -u origin main"
echo ""

echo "3. Configure GitHub Pages:"
echo "   - Go to repository Settings → Pages"
echo "   - Set Source: 'Deploy from GitHub Actions'"
echo "   - Save configuration"
echo ""

echo "4. Monitor deployment:"
echo "   - Check Actions tab: https://github.com/nunyalabs/uhas-kits/actions"
echo "   - Wait for workflow completion (3-5 minutes)"
echo "   - Access site: https://nunyalabs.github.io/uhas-kits/"
echo ""

echo "🎯 Ready for deployment!"
echo ""

# Check current git status
echo "Current git status:"
git status --porcelain | head -10

echo ""
echo "Run the git commands above to deploy to the new repository."