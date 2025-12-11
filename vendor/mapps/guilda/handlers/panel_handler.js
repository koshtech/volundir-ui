Logger.registerHandler((entry) => {
  if (GuildaPanel && typeof GuildaPanel.addLog === "function") {
    console.log(' ===> GuildaPanel.addLog: ', entry);
    GuildaPanel.addLog(entry);
  }
});
