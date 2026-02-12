// const log = await File.loadClass('lib/volundir/lib/modules/logger_module.js');

// console.log('log ==> ', log);

// globalThis.Logger = log;

(() => {
  // const entries = [];

  // function save(message, level) {
  //   (async () => {
  //     if (globalThis.Coordinator && typeof Coordinator.getModule === 'function') {
  //       const logger = Coordinator.getModule('logger');

  //       if(logger && typeof logger[level] === 'function'){
  //         if(entries.length > 0 && logger.canImport()) {
  //           logger.importEntries(entries, 1);
  //         }

  //         return logger[level](message, 1);
  //       }
  //     }

  //     entries.push({ "message": message, "level": level});
  //   })();
  // }

  export const clickInterceptor = {
    info(message) {
      save(message, 'info');

      this.handleClick.bind(this);
    }
  };
})();
