
export const local_storage_writer = function(entry) {
  const attributes = {};

  attributes[entry.timestamp] = JSON.stringify(entry);

  const log = Log.new(attributes);

  // console.log(' [local_storage_writer] log: ', log);

  (async () => {
    const result = await log.save();
  })();
}

export const local_storage_reader = async function(query=null) {
  var logs;

  // console.log(' [reader_list] Logs: ', logs.collection);

  return (async () => {
    logs = await Log.list({all: true}) /// verificar essa funcao

    console.log(` [reader_list] Listing ${Object.keys(logs.collection).length} entries from localStorage Logs.`);

    return logs;
  })();

  // console.log(' [reader_list] Logs: ', logs);

  // criar metodo dinamico para retornar o modelo
  /*
  Log {
    return this.modules.logger
  }
  */

}

// Logger.registerReader(reader_list);

// Logger.registerHandler(handler);

