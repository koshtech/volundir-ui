const BaseHub = await File.import('lib/volundir/base/base_hub.js');

if (typeof BaseModule == 'undefined') {
  let BaseModule = await File.import('lib/volundir/base/base_module.js');
}

export class ModuleHub extends BaseHub {
  #loaded = false;

  constructor() {
    super();

    // Hubs are resolved and ready by default
    this.resolved = true;
    this.ready    = true;

    this.isLoaded = true;
  }
}
