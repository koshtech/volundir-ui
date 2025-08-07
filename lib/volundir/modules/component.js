import { Coordinator } from '/lib/volundir/core/coordinator.js';

class ComponentModule extends Coordinator  {
  constructor() {
    super();
  }
}

export const component = new ComponentModule();
