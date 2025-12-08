Log.registerHandler((entry) => {
  if (GuildaPanel && typeof GuildaPanel.addLog === "function") {
    GuildaPanel.addLog(entry);
  }
});
