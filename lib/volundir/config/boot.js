await import('/lib/volundir/lib/extensions/string/string_plus.js');

import { LoggerModule } from '/lib/volundir/lib/modules/logger_module.js';
globalThis.Log          = new LoggerModule();

import { ObjectCoordinator } from '/lib/volundir/base/object_coordinator.js';
globalThis.Coordinator        = new ObjectCoordinator();

await Coordinator.loadEssentialModules();

await Coordinator.loadMiniApp('guilda');

await import('/lib/volundir/lib/adapters/output/handlers/console/console_handler.js');

Log.info('Booting Volundir ...');

// Load required Volundir Guilda Virtual Application
// await import('/vendor/mapps/guilda/index.js');

function registerServiceWorker() {
  // console.log(' [boot] Event load (or already loaded): serviceWorker...');
  navigator.serviceWorker.register('/service-worker.js')
    .then((reg) => Log.info(`Service Worker registered: `, reg))
    .catch((err) => Log.error(`Error registering Service Worker: ${err}`));
}

if ('serviceWorker' in navigator) {
  Log.info('Starting serviceWorker...');
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}
