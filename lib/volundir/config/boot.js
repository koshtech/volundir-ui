if ('serviceWorker' in navigator) {
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}

await import('/lib/volundir/lib/extensions/string/string_plus.js');
await import('/lib/volundir/lib/extensions/array/array_plus.js');
await import('/lib/volundir/lib/extensions/volundir/log_wrappers.js');

// import { MessageQueue }    from '/lib/volundir/base/event_message_queue.js';
// import { MessageStore }    from '/lib/volundir/base/event_store.js';
// import { MessageEventBus } from '/lib/volundir/base/event_bus.js';

// MessageStore.subscribe(state => {
//   console.log('Estado mudou:', state);
// });

// MessageStore.setState({ loading: true });
// MessageStore.setState({ user: { id: 1, name: 'Kosh' } });

// MessageQueue.enqueue(async () => {
//   MessageStore.setState({ loading: true });
// });

// MessageQueue.enqueue(async () => {
//   MessageEventBus.emit('log', 'Primeiro evento');
// });

// MessageQueue.enqueue(async () => {
//   MessageStore.setState({ loading: false });
// });

// MessageStore.subscribe(phase => {
//   console.log('InitPhase changed:', phase);
// });

import { LoggerModule } from '/lib/volundir/lib/modules/logger_module.js';
globalThis.Logger = new LoggerModule();

// Required ObjectCoordinator
import { ObjectCoordinator } from '/lib/volundir/base/object_coordinator.js';
globalThis.Coordinator = new ObjectCoordinator();

// Load load Essential Modules
await Coordinator.loadEssentialModules();

// Load optional Guilda Mini App
await Coordinator.loadMiniApp('guilda', null, false);

function registerServiceWorker() {
  navigator.serviceWorker.register('/service-worker.js');
    // .then((reg) => Logger.success(`Service Worker registered: ${reg}`))
    // .catch((err) => Logger.error(`Error registering Service Worker: ${err}`));
}
