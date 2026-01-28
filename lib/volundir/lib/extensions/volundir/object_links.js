(() => {
  const entries = [];

  function save(message, level) {
    // console.log('[object_links][save] level: ', level, ' message: ', message);
    // console.log('[object_links][save] entries: ', entries);

    (async () => {
      if (globalThis.Coordinator && typeof Coordinator.getModule === 'function') {
        const logger = Coordinator.getModule('logger');

        console.log('[LOGGER][check] logger: ', logger);
        console.log('[LOGGER][check] Coordinator: ', Coordinator);

        if(logger && typeof logger[level] === 'function'){
          if(entries.length > 0 && logger.canImport()) {
            logger.importEntries(entries, 1);
          }
          // console.log(`[LOGGER][OK] Level: ${level} | message: `, message)

          return logger[level](message, 1);
        }
      }

      entries.push({ "message": message, "level": level});

      // console.log(`[LOGGER][FALLBACK] Level: ${level} | message: `, message);
    })();

    console.log('[object_links][save] entries: ', entries);
  }

  globalThis.log = {
    info(message) {
      save(message, 'info');
    },

    notice(message) {
      save(message, 'notice');
    },

    warn(message) {
      save(message, 'warn');
    },

    success(message) {
      save(message, 'success');
    },

    error(message) {
      save(message, 'error');
    },

    fatal(message) {
      save(message, 'fatal');
    },

    debugger(message) {
      save(message, 'debugger');
    }
  };
})();

log.info('Logger Interface loaded.');
