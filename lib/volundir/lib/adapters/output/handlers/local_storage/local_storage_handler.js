Log.registerHandler((entry) => {
  localStorage.setItem(`log:${entry.timestamp}`, JSON.stringify(entry));
});

console.log('=============> Log localStorage: ', Log);
