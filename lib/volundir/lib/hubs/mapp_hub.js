const BaseHub    = await File.import('lib/volundir/base/base_hub.js');
const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class mAppHub extends BaseHub {
  constructor() {
    super();

    // Hubs are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  get isLoaded(){
    return true
  }
}
