import { BaseModule } from '/lib/volundir/base/base_module.js';

// DevOps Runtime Layer


export class GuildaModule extends BaseModule {
  constructor() {
    super();

    this.requiredHandlers    = [];
    this.requiredControllers = ['panel_controller'];
    this.requiredModules     = ['render'];

    // (async () => this.init())();
  }

  async init() {
    console.log(' ===> GuildaModule started! this: ', this);

    await this.controllers.panel_controller.init();
  }
}
