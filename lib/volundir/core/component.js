import { Coordinator } from './coordinator.js';

export class Component extends Coordinator  {
  constructor() {
    super();
    console.log('================> Component Loaded.');
  }

  setParent(parent) {
    this.parent = parent;
  }

  test(){
    console.log('================> Test on Component.');
    console.log('================> Component registered parent: ', this.parent);

    const display = this.parent['display'];
    display.test_2();
  }
}
