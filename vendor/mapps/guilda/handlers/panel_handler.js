// Guilda Panel Output Handler
export function panel_handler (entry) {
  Log.registerHandler((entry) => {
    if (window.GuildaPanel && typeof window.GuildaPanel.addLog === "function") {
      window.GuildaPanel.addLog(entry);
    }
  });
}

// export function panel_handler;
