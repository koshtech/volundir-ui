import { Coordinator } from '/lib/volundir/core/coordinator.js';

class CacheModule extends Coordinator  {
  constructor() {
    super();
  }
}

export const cache = new CacheModule();
