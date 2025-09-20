#!/bin/bash
# Repository cleanup script for UHAS Research Toolkits
# Removes old files, temporary data, and ensures clean deployment

set -euo pipefail

echo "🧹 Cleaning UHAS Research Toolkits Repository"
echo "=============================================="

# Remove system files
echo "📁 Removing system files..."
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true
find . -name "desktop.ini" -delete 2>/dev/null || true

# Remove temporary files
echo "🗑️  Removing temporary files..."
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.temp" -delete 2>/dev/null || true
find . -name "*~" -delete 2>/dev/null || true
find . -name "*.bak" -delete 2>/dev/null || true
find . -name "*.backup" -delete 2>/dev/null || true

# Remove IDE files
echo "💻 Removing IDE files..."
rm -rf .vscode/ .idea/ 2>/dev/null || true

# Remove log files
echo "📄 Removing log files..."
find . -name "*.log" -delete 2>/dev/null || true

# Remove any old build artifacts
echo "🔧 Removing build artifacts..."
rm -rf dist/ build/ .tmp/ coverage/ 2>/dev/null || true

# Remove node modules if any exist
echo "📦 Removing node modules..."
rm -rf node_modules/ 2>/dev/null || true

# Remove any data export files (security)
echo "🔒 Removing exported data files..."
rm -rf exports/ data-exports/ audio-recordings/ 2>/dev/null || true
find . -name "*.csv" -delete 2>/dev/null || true
find . -name "*.xlsx" -delete 2>/dev/null || true

# Remove redundant gitignore files
echo "📝 Cleaning gitignore files..."
find . -path "./.gitignore" -prune -o -name ".gitignore" -delete 2>/dev/null || true

echo ""
echo "✅ Repository cleaned successfully!"
echo "🔍 Repository structure:"
find . -type f -not -path './.git/*' | sort
echo ""
echo "📊 File count: $(find . -type f -not -path './.git/*' | wc -l)"