
import { BaseModule } from '/lib/volundir/core/base_module.js';

export class Coordinator extends BaseModule {
  constructor(_modules) {
    super(_modules);

    // console.log('========> Coordinator _modules: ', this._modules);
  }

  register(name, _module) {
    // console.log('========> Coordinator register name: ', name, ' module: ', _module);

    this._modules[name] = _module;
    // console.log('========> Coordinator registered _modules: ', _modules);

    for (const [_name_, _module_] of Object.entries(this._modules)) {
      if (!Coordinator.hasOwnProperty(name)) {
        Coordinator[_name_] = _module_;
        this[_name_] = _module_;

      }
    }
  }

  get(name) {
    return this._modules[name];
  }
}
