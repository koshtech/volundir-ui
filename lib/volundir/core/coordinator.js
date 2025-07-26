export class Coordinator {
  constructor() {
    this._modules = {};
    console.log('========> Coordinator loaded.')
    console.log('========> Coordinator _modules: ', this._modules);
  }

  register(name, _module) {
    console.log('========> Coordinator register name: ', name, ' module: ', _module);

    this._modules[name] = _module;
    _module.setModules(this._modules);

    console.log('========> Coordinator registered _modules: ', this._modules);
  }

  get(name) {
    return this._modules[name];
  }
}
