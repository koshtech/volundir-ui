await import('/lib/volundir/lib/extensions/string/string_plus.js');

import { LoggerModule } from '/lib/volundir/lib/modules/logger_module.js';

globalThis.Logger = new LoggerModule();

// Load required LocalStorage Handler
await import('/lib/volundir/lib/adapters/output/handlers/local_storage/local_storage_handler.js');

// Load optional Console Handler
// await import('/lib/volundir/lib/adapters/output/handlers/console/console_handler.js');

Logger.info('Booting Volundir ...');

// Required ObjectCoordinator
import { ObjectCoordinator } from '/lib/volundir/base/object_coordinator.js';
globalThis.Coordinator        = new ObjectCoordinator();

// Load load Essential Modules
await Coordinator.loadEssentialModules();

// Load optional Guilda Mini App
await Coordinator.loadMiniApp('guilda');

function registerServiceWorker() {
  // console.log(' [boot] Event load (or already loaded): serviceWorker...');
  navigator.serviceWorker.register('/service-worker.js')
    .then((reg) => Logger.success(`Service Worker registered: `, reg))
    .catch((err) => Logger.error(`Error registering Service Worker: ${err}`));
}

if ('serviceWorker' in navigator) {
  Logger.info('Starting serviceWorker...');
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}
