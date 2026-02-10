import { BaseModule } from '/lib/volundir/base/base_module.js';
// const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class CacheModule extends BaseModule {
  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }
}
