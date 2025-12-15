// console.log(' ==============>>>>> guildaApp load ');

// if enabled by configuration
import { PanelController } from '/vendor/mapps/guilda/controllers/panel_controller.js';

export const GuildaPanel  = new PanelController();
globalThis.GuildaPanel = GuildaPanel;

// if enabled by configuration
await import('/vendor/mapps/guilda/handlers/panel_handler.js');

import { GuildaModule } from '/vendor/mapps/guilda/modules/guilda_module.js';
const guilda_module = new GuildaModule();

// console.log(' ===> GuildaPanel guilda_module: ', guilda_module);

// GuildaPanel.modules['guilda_module'] = guilda_module;

// console.log(' ===> GuildaPanel: ', GuildaPanel);

// globalThis.Guilda = new GuildaModule();
export const guilda = {
  "handlers": [],
  "models": [],
  "controllers": [GuildaPanel],
  "modules": [guilda_module],
  "extensions": []
};


// GuildaPanel.init();

// Global instance (singleton)
// globalThis.Guilda = new GuildaModule();
