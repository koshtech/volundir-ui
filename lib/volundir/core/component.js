import { Coordinator } from './coordinator.js';

export class Component extends Coordinator  {
  constructor() {
    super();
    console.log('================> Component Loaded.');
  }

  setModules(_modules) {
    this._modules = _modules;
  }

  test(){
    console.log('================> Test on Component.');
    console.log('================> Component registered _modules: ', this._modules);

    const display = this._modules['display'];
    display.test_2();
  }
}
