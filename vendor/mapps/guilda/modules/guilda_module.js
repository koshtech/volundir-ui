import { BaseModule } from '/lib/volundir/base/base_module.js';

// DevOps Runtime Layer


export class GuildaModule extends BaseModule {
  constructor() {
    super();

    this.requiredModules = ['render'];

    (async () => this.init())();
  }

  async init() {
    console.log(' ===> this: ', this);
  }


}
