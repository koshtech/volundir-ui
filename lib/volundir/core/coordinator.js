export class Coordinator {
  constructor() {
    this.modules = {};
    console.log('========> Coordinator loaded.')
    console.log('========> Coordinator modules: ', this.modules);
  }

  register(name, _module) {
    console.log('========> Coordinator register name: ', name, ' module: ', _module);

    this.modules[name] = _module;
    _module.setParent(this.modules);

    console.log('========> Coordinator registered modules: ', this.modules);
  }

  get(name) {
    return this.modules[name];
  }
}
