(() => {
  const entries = [];

  function save(entry, level) {
    // console.log('[object_links][save] level: ', level, ' entry: ', entry);
    // console.log('[object_links][save] entries: ', entries);

    (async () => {
      if (globalThis.Coordinator && typeof Coordinator.getModule === 'function') {
        const logger = Coordinator.getModule('logger');

        console.log('[LOGGER][check] logger: ', logger);
        console.log('[LOGGER][check] Coordinator: ', Coordinator);

        if(logger && typeof logger.info === 'function'){
          console.log(`[LOGGER][OK] Level: ${level} | entry: `, entry)

          return logger?.[level]?.(entry);
        }
      }

      entries.push(entry);

      console.log(`[LOGGER][FALLBACK] Level: ${level} | entry: `, entry);
    })();

    // console.log('[object_links][save] entries: ', entries);
  }

  globalThis.log = {
    info(entry) {
      save(entry, 'info');
    },

    notice(entry) {
      save(entry, 'notice');
    },

    warn(entry) {
      save(entry, 'warn');
    },

    success(entry) {
      save(entry, 'success');
    },

    error(entry) {
      save(entry, 'error');
    },

    fatal(entry) {
      save(entry, 'fatal');
    },

    debugger(entry) {
      save(entry, 'debugger');
    }
  };
})();

log.info('Logger interface test on load in object_links', 'info');
