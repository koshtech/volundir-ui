import { Coordinator } from './coordinator.js';

export class Component extends Coordinator  {
  constructor() {
    // this.modules = {};
    super();
    console.log('================> Component Loaded.');
  }

  setParent(parent) {
    this.parent = parent;
  }

  test(){
    console.log('================> Test on Component.');
    console.log('================> Component registered parent: ', this.parent);

    // const display = new this.modules['display'];

    // display.test_2();
    // this.modules['display'].test_2();

    const display = this.parent.get('display');
    display.test_2();
  }
}
