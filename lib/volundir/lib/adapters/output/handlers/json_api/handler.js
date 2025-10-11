VolundirLogger.registerHandler((entry) => {
  fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
});
