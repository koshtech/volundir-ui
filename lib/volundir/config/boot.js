// console.log(' [boot] Booting Volundir from app.js...');

function registerServiceWorker() {
  // console.log(' [boot] Event load (or already loaded): serviceWorker...');
  navigator.serviceWorker.register('/service-worker.js')
    .then((reg) => console.log(' [boot] Service Worker registered: ', reg))
    .catch((err) => console.error(' [boot] Error registering Service Worker', err));
}

if ('serviceWorker' in navigator) {
  console.log(' [boot] Starting serviceWorker...');
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}
