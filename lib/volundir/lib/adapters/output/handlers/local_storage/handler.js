VolundirLogger.registerHandler((entry) => {
  localStorage.setItem(`log:${entry.timestamp}`, JSON.stringify(entry));
});
