const handler = function(entry) {
  const attributes = {}

  attributes[entry.timestamp] = JSON.stringify(entry)

  const log = Log.new(attributes)

  log.save()
}

const reader_list = async function() {
  const logs = await Log.list({all: true}) /// verificar essa funcao

  // console.log(' =====> reader_list logs: ', logs);

  // criar metodo dinamico para retornar o modelo

  /*
  Log {
    return this.modules.logger
  }

  */


  return logs;
}

Logger.registerReader(reader_list);

Logger.registerHandler(handler);

