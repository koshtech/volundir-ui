// Handler padrão → console
Logger.registerHandler((entry) => {
  console.group(` [${entry.level.toUpperCase()}] ${entry.message}`);
  console.log('Context:', entry);
  console.groupEnd();
});
