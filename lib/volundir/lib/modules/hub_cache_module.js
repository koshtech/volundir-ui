const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class HubCacheModule extends BaseModule {
  cachedHubs = {}

  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  isCached(hubName) {
    return this.cachedHubs.find_by_key(hubName) ? true : false;;
  }

  save(hubName, hubObject) {
    this.cachedHubs[hubName] = hubObject;

    return true;
  }

  get(hubName) {
    if(this.isCached(hubName)){
      return this.cachedHubs[hubName];
    }

    return null;
  }
}
