console.log(' ==============>>>>> guildaApp load ');

import { GuildaModule } from '/vendor/mapps/guilda/modules/guilda_module.js';

// globalThis.Guilda = new GuildaModule();

// if enabled by configuration
import { panel_handler } from '/vendor/mapps/guilda/handlers/panel_handler.js';

// if enabled by configuration
import { PanelController } from '/vendor/mapps/guilda/controllers/panel_controller.js';

export const mApp = {
  "controllers": [PanelController],
  "modules": [GuildaModule],
  "models": [],
  "handlers": [panel_handler]
};
