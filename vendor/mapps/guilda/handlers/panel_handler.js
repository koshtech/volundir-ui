Logger.registerHandler('guida_panel_handler', (entry) => {
  if (GuildaPanel && typeof GuildaPanel.addLog === "function") {
    GuildaPanel.addLog(entry);
  }
});
