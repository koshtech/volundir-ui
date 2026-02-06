await import('/lib/volundir/lib/extensions/string/string_plus.js');
await import('/lib/volundir/lib/extensions/object/object_plus.js');
await import('/lib/volundir/lib/extensions/array/array_plus.js');
await import('/lib/volundir/lib/extensions/volundir/file_wrappers.js');
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

const LoggerModule = await File.import('lib/volundir/lib/modules/logger_module.js');
globalThis.Logger = new LoggerModule();

 // console.log(' [Volundir][boot] Logger:', Logger);
 // console.log(' [Volundir][boot] File:', File);

// throw new Error(' [Volundir][boot]: emergency stop!') // Terminates the program

// import { AuthModule } from '/lib/volundir/lib/modules/auth_module.js';
// console.log('boot AuthModule:', AuthModule);
// globalThis.Auth = new AuthModule();

// Required ObjectCoordinator
const ObjectCoordinator = await File.import('lib/volundir/base/object_coordinator.js');
globalThis.Coordinator  = new ObjectCoordinator();

// Load load Essential Modules
await Coordinator.loadEssentialModules();

// Load optional Guilda Mini App
// await Coordinator.loadMiniApp('guilda', null, false);

function registerServiceWorker() {
  navigator.serviceWorker.register('/service-worker.js');
    // .then((reg) => Logger.success(`Service Worker registered: ${reg}`))
    // .catch((err) => Logger.error(`Error registering Service Worker: ${err}`));
}

if ('serviceWorker' in navigator) {
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}
