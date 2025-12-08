console.log(' ==============>>>>> guildaApp load ');

// if enabled by configuration
import { PanelController } from '/vendor/mapps/guilda/controllers/panel_controller.js';

export const GuildaPanel  = new PanelController();
globalThis.GuildaPanel = GuildaPanel;

// if enabled by configuration
await import('/vendor/mapps/guilda/handlers/panel_handler.js');

import { GuildaModule } from '/vendor/mapps/guilda/modules/guilda_module.js';


// globalThis.Guilda = new GuildaModule();
export const guilda = {
  "handlers": [],
  "models": [],
  "controllers": [GuildaPanel],
  "modules": [new GuildaModule]
};


// GuildaPanel.init();

// Global instance (singleton)
// globalThis.Guilda = new GuildaModule();
