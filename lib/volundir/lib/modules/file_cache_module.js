import { BaseCache } from '/lib/volundir/base/base_cache.js';

export class FileCacheModule extends BaseCache {
  #cache = {}

  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }
}
