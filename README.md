# UHAS Digital Toolkits Portal

A Progressive Web App (PWA) portal for University of Health and Allied Sciences digital research toolkits.

## 🏗️ Architecture

### Portal Structure
```
kits/
├── index.html          # Main portal page
├── app.js             # Portal logic with theme management & PWA features
├── sw.js              # Shared service worker for all toolkits
├── manifest.json      # Unified PWA manifest
├── assets/            # Shared images and logos
├── toolkit-a/         # Hypertension Research Toolkit
└── toolkit-b/         # Co-Design & Platform Adaptation Toolkit
```

### Unified PWA Features
- **Single Service Worker**: Root-level `sw.js` handles caching for all toolkits
- **Shared Manifest**: Single `manifest.json` with shortcuts to each toolkit
- **Cross-Platform Install**: Support for iOS and Android installation prompts
- **Offline-First**: Comprehensive caching strategy for complete offline experience
- **Theme Consistency**: Unified theme system across portal and toolkits

## 🎯 Toolkits

### Toolkit A: Hypertension Research
**Purpose**: Digital N-of-1 trial participant management for hypertension research

**Features**:
- Participant screening and eligibility assessment
- Individual interviews (IDI) with audio recording
- Focus group discussions (FGD) management
- Participant data management and exports
- Dashboard with real-time metrics

**Tech Stack**: ES6 modules, IndexedDB via Dexie, Web Audio API

### Toolkit B: Co-Design & Platform Adaptation
**Purpose**: Workshop facilitation and platform customization tracking

**Features**:
- Workshop planning and preparation checklists
- Session facilitation tools
- Trial setup activities management
- Feedback collection and analysis
- Platform customization tracking
- Comprehensive reporting

**Tech Stack**: Vanilla JavaScript, localStorage, Bootstrap 5

## 🚀 PWA Capabilities

### Installation
- **Android/Chrome**: Automatic install prompt with custom UI
- **iOS Safari**: Guided installation instructions modal
- **Desktop**: Standard PWA installation via browser

### Offline Experience
- **Precaching**: Core app assets cached on first visit
- **Runtime Caching**: Dynamic content cached as accessed
- **Network Strategies**:
  - Navigation: Network-first with cache fallback
  - Static Assets: Cache-first with network fallback
  - Data: Stale-while-revalidate for optimal UX

### Update Management
- Automatic service worker updates
- User notification for available updates
- Seamless update application

## 🎨 Theming

### Available Themes
- **Warm** (default): Orange to red gradient
- **Medium Sky**: Light to medium blue
- **Deep Blue**: Dark blue professional theme
- **Cyan**: Teal/cyan modern theme
- **Leaf Green**: Nature-inspired green theme

### Theme Persistence
- Themes saved to localStorage
- Consistent across portal and toolkits
- CSS custom properties for dynamic theming

## 📱 Mobile Optimization

### Responsive Design
- Mobile-first Bootstrap 5 layout
- Touch-friendly navigation
- Optimized for various screen sizes

### Touch Interactions
- Swipe navigation between toolkit sections
- Touch-optimized forms and controls
- Mobile-specific UI adjustments

## 🔧 Development

### File Structure
Each toolkit maintains its own:
- `index.html`: Toolkit entry point
- `app.js`: Main application logic
- `style.css`: Toolkit-specific styles
- `js/`: Modular JavaScript files

### Shared Resources
- Service worker handles all toolkit caching
- Manifest provides unified app identity
- Assets folder contains logos and images
- Portal manages global theme state

### Build Process
No build step required - pure web standards:
- ES6 modules for modern browsers
- Progressive enhancement for features
- Graceful degradation for older browsers

## 📊 Caching Strategy

### Precached Assets
- Portal files (index.html, app.js)
- Both toolkit entry points and core files
- Essential images and logos
- CDN assets (Bootstrap, icons)

### Runtime Caching
- Dynamic content cached on access
- API responses with stale-while-revalidate
- User data persisted in localStorage/IndexedDB

### Cache Management
- Automatic cleanup of old cache versions
- Efficient storage usage
- Background sync for data persistence

## 🔒 Data Management

### Toolkit A (Hypertension Research)
- **Storage**: IndexedDB via Dexie
- **Data Types**: Participants, interviews, audio recordings
- **Export**: CSV and JSON formats
- **Privacy**: Local-only storage, no external transmission

### Toolkit B (Co-Design & Adaptation)
- **Storage**: localStorage with JSON serialization
- **Data Types**: Workshops, activities, feedback, customizations
- **Export**: Excel, HTML reports, JSON
- **Backup**: Manual export/import functionality

## 🌐 Browser Support

### Modern Browsers (Full Experience)
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Features by Browser
- **Service Workers**: All modern browsers
- **Install Prompts**: Chrome/Edge (automatic), iOS Safari (guided)
- **Audio Recording**: Chrome, Firefox, Safari with user permission
- **IndexedDB**: Universal support

## 📈 Performance

### Optimization Strategies
- Lazy loading of toolkit-specific modules
- Efficient caching reduces network requests
- Minimal initial bundle size
- Progressive loading of features

### Metrics Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🚦 Getting Started

### Local Development
1. Serve from a web server (not file://)
2. HTTPS required for service worker registration
3. Modern browser with developer tools

### Deployment
1. Upload all files maintaining directory structure
2. Ensure server supports HTTPS
3. Configure proper MIME types for manifest.json
4. Test PWA installation on target devices

## 📋 Maintenance

### Regular Tasks
- Monitor browser console for errors
- Test PWA installation across devices
- Verify offline functionality
- Update cache version when deploying changes

### Updates
- Increment service worker VERSION constant
- Test update notification flow
- Verify data persistence across updates

---

**University of Health and Allied Sciences**  
Digital Solutions Team  
© 2025