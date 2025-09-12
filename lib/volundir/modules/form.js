import { Coordinator } from '/lib/volundir/core/coordinator.js';

class FormModule extends Coordinator  {
  constructor() {
    super();
  }
}

export const form = new FormModule();
