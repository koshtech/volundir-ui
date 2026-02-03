// import { BaseModule } from '/lib/volundir/base/base_module.js';
const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class HubCacheModule extends BaseModule {
  // Statically loaded modules are resolved by default
  resolved = true;

  cachedHubs = {}

  constructor() {
    super();
  }

  iscached(hubName) {
    return this.cachedHubs.find_by_key(hubName) ? true : false;;
  }

  save(hubName, hubObject) {
    this.cachedHubs[hubName] = hubObject;

    return true;
  }

  get(hubName) {
    if(this.iscached(hubName)){
      return this.cachedHubs[hubName];
    }

    return null;
  }
}
