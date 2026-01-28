(() => {
  const entries = [];

  function save(message, level) {
    (async () => {
      if (globalThis.Coordinator && typeof Coordinator.getModule === 'function') {
        const logger = Coordinator.getModule('logger');

        if(logger && typeof logger[level] === 'function'){
          if(entries.length > 0 && logger.canImport()) {
            logger.importEntries(entries, 1);
          }

          return logger[level](message, 1);
        }
      }

      entries.push({ "message": message, "level": level});
    })();
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
