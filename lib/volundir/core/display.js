import { Coordinator } from './coordinator.js';

export class Display extends Coordinator {
  constructor() {
    super();
    console.log('================> Display Loaded.');
  }

  setParent(parent) {
    this.parent = parent;
  }

  test(){
    console.log('================> Test.');
  }

  test_2(){
    console.log('================> Test from Component on Display.');
  }
}
