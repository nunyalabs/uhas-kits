# UHAS Research Toolkits

A Progressive Web Application containing research toolkits for health interventions.

## Repository Setup for GitHub Pages

This repository is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Deployment URL
- **Production Site**: https://nunyalabs.github.io/uhas-kits/
- **Repository**: https://github.com/nunyalabs/uhas-kits

### Setup Instructions

1. **Create New Repository**:
   ```bash
   # Create repository at: https://github.com/nunyalabs/uhas-kits
   # Initialize as public repository
   ```

2. **Push Code**:
   ```bash
   git remote set-url origin https://github.com/nunyalabs/uhas-kits.git
   git push -u origin main
   ```

3. **Configure GitHub Pages**:
   - Go to repository Settings → Pages
   - Set Source: "Deploy from GitHub Actions"
   - Workflow will auto-deploy on push to main

4. **Monitor Deployment**:
   - Check Actions tab for workflow progress
   - Site will be available at: https://nunyalabs.github.io/uhas-kits/

### Toolkits Included

- **Toolkit A**: Hypertension Research Tools
- **Toolkit B**: Co-Design & Adaptation Tools

### Development

The application uses:
- Progressive Web App (PWA) capabilities
- Service Worker for offline functionality  
- Responsive design for mobile and desktop
- Minified deployment for optimal performance

### Build Process

The GitHub Actions workflow automatically:
1. Minifies HTML, CSS, and JavaScript files
2. Optimizes assets for web deployment
3. Deploys to GitHub Pages
4. Configures proper routing and 404 handling