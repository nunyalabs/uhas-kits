// Root app.js for the Portal (wires the two toolkits with unified theme handling)
(function () {
  const THEME_KEY = 'portal.theme';
  const MODE_KEY = 'portal.mode';
  const THEMES = {
    'warm':        { start: '#f89b1b', end: '#d72c18', accent: '#e94435' },
    'medium-sky':  { start: '#87ceeb', end: '#4682b4', accent: '#87ceeb' },
    'deep-blue':   { start: '#1e3c72', end: '#2a5298', accent: '#1e3c72' },
    'cyan':        { start: '#00bcd4', end: '#0097a7', accent: '#00bcd4' },
    'leaf-green':  { start: '#8bc34a', end: '#4caf50', accent: '#8bc34a' },
  };

  function applyTheme(themeName) {
    const theme = THEMES[themeName] || THEMES['warm'];
    document.documentElement.style.setProperty('--bg-start', theme.start);
    document.documentElement.style.setProperty('--bg-end', theme.end);
    document.documentElement.style.setProperty('--accent-color', theme.accent || theme.start);
    localStorage.setItem(THEME_KEY, themeName);
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { 
      meta = document.createElement('meta'); 
      meta.setAttribute('name', 'theme-color'); 
      document.head.appendChild(meta); 
    }
    meta.setAttribute('content', theme.start);
  }

  function applyMode(mode) {
    const m = (mode === 'light' || mode === 'dark') ? mode : 'dark';
    document.body.setAttribute('data-mode', m);
    localStorage.setItem(MODE_KEY, m);
  }

  function bindThemeMenu() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    document.querySelectorAll('[data-theme]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        applyTheme(el.getAttribute('data-theme'));
      });
    });
    
    document.querySelectorAll('[data-mode]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        applyMode(el.getAttribute('data-mode'));
      });
    });

    const savedTheme = localStorage.getItem(THEME_KEY) || 'warm';
    const savedMode = localStorage.getItem(MODE_KEY) || 'dark';
    applyTheme(savedTheme);
    applyMode(savedMode);
  }

  function registerRootServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('Root SW registered', reg.scope);
            setupUpdateNotification(reg);
          })
          .catch(err => console.warn('Root SW registration failed', err));
      });
      
      // Listen for SW messages
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'SW_UPDATED') {
          showUpdateNotification();
        }
      });
    }
  }

  function setupUpdateNotification(registration) {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateNotification();
        }
      });
    });
  }

  function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
    updateBanner.style.cssText = 'z-index: 9999; max-width: 400px;';
    updateBanner.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-arrow-clockwise me-2"></i>
        <span class="me-auto">App updated! Refresh to get the latest version.</span>
        <button class="btn btn-sm btn-primary ms-2" onclick="window.location.reload()">Refresh</button>
        <button class="btn btn-sm btn-outline-secondary ms-1" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(updateBanner);
  }

  function setupInstallPrompts() {
    let deferredPrompt;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Standard install prompt for Android/Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton(deferredPrompt);
    });

    // iOS install instructions
    if (isIOS && !window.navigator.standalone) {
      setTimeout(() => showIOSInstallInstructions(), 2000);
    }

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      hideInstallButton();
      showInstallSuccessMessage();
    });
  }

  function showInstallButton(deferredPrompt) {
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.className = 'btn btn-success position-fixed';
    installBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; border-radius: 50px; padding: 12px 20px;';
    installBtn.innerHTML = '<i class="bi bi-download me-2"></i>Install App';
    
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
        hideInstallButton();
      }
    });
    
    document.body.appendChild(installBtn);
  }

  function showIOSInstallInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-phone me-2"></i>Install on iOS
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">To install this app on your iOS device:</p>
            <ol class="list-group list-group-flush">
              <li class="list-group-item d-flex align-items-center">
                <i class="bi bi-share me-3 text-primary"></i>
                Tap the Share button in Safari
              </li>
              <li class="list-group-item d-flex align-items-center">
                <i class="bi bi-plus-square me-3 text-primary"></i>
                Select "Add to Home Screen"
              </li>
              <li class="list-group-item d-flex align-items-center">
                <i class="bi bi-check-circle me-3 text-success"></i>
                Tap "Add" to install
              </li>
            </ol>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Maybe Later</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(modal);
    });
  }

  function hideInstallButton() {
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.remove();
  }

  function showInstallSuccessMessage() {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
    successAlert.style.cssText = 'z-index: 9999; max-width: 400px;';
    successAlert.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle-fill me-2"></i>
        <span>App installed successfully!</span>
      </div>
    `;
    
    document.body.appendChild(successAlert);
    setTimeout(() => successAlert.remove(), 5000);
  }

  function attachManifest() {
    if (!document.querySelector('link[rel="manifest"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindThemeMenu();
    attachManifest();
    registerRootServiceWorker();
    setupInstallPrompts();
  });
})();