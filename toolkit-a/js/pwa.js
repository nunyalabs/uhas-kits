// pwa.js - service worker registration and install prompt
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Unregister legacy per-toolkit SWs then register root SW
      navigator.serviceWorker.getRegistrations?.().then(regs => {
        regs.forEach(reg => {
          const url = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || '';
          if (url.endsWith('/toolkit-a/sw.js') || url.endsWith('/toolkit-b/sw.js')) {
            reg.unregister().catch(() => {});
          }
        });
      }).catch(() => {});

      navigator.serviceWorker.register('../sw.js')
        .then(reg => console.log('Root SW registered', reg.scope))
        .catch(err => console.log('Root SW registration failed', err));
    });
  }
}

export function setupInstallPrompt() {
  let deferredPrompt;
  const installButton = document.createElement('button');
  installButton.textContent = 'Install App';
  installButton.className = 'btn btn-gradient btn-primary position-fixed bottom-0 end-0 m-3';
  installButton.style.display = 'none';
  document.body.appendChild(installButton);
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
    installButton.addEventListener('click', () => {
      installButton.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => { deferredPrompt = null; });
    }, { once: true });
  });
}
