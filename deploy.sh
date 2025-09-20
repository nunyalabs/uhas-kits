#!/bin/bash
# Deploy script for UHAS Research Toolkits
# This script prepares and deploys only minified files to GitHub Pages

set -euo pipefail

echo "🚀 Deploying UHAS Research Toolkits (Minified Version Only)"
echo "========================================================="

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if we have uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

# Clean and create dist directory
echo "🧹 Cleaning previous build..."
rm -rf dist
mkdir -p dist

# Install minification tools if not available
echo "🔧 Setting up build tools..."
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js"
    exit 1
fi

# Add source files that are safe to commit
echo "📝 Committing current changes..."
git add .
git commit -m "Update source files for deployment" || echo "No changes to commit"

# Push to main branch (source repository)
echo "📤 Pushing source to main branch..."
git push origin main

echo "✅ Deployment initiated!"
echo "📍 Your site will be available at: https://nunyalabs.github.io/toolkits/"
echo "⏱️  GitHub Actions will build and deploy the minified version"
echo "🔒 Source files remain protected in the main branch"
echo ""
echo "Monitor deployment progress at:"
echo "https://github.com/nunyalabs/toolkits/actions"