export class BaseModule {
  constructor(_modules) {
    // console.log(` [base_module] ${this.constructor.name} loaded.`);
    this._modules = _modules || this._modules || {};

    if(_modules) {
      this.setAllLoadedModules();
    }
  }

  setModule(_name, _module) {
    this[_name] = _module;
  }

  setModules(_module, _modules) {
    for (const [name_, module_] of Object.entries(_modules)) {
      _module.setModule(name_, module_);
    }

    _module._modules = _modules;
  }

  setAllLoadedModules(){
    // console.log(' [base_module] setAllLoadedModules');
    for (const [name_, _module] of Object.entries(this._modules)) {
      _module.setModules(_module, this._modules);
    }
  }

  setControllerLoadedModules(){
    // console.log(' [base_module] setAllLoadedModules');
    // console.log('               Called from:', this.constructor.name);

    for (const [_name, _module] of Object.entries(this._modules)) {
      this.setModule(_name, _module);
    }
  }

  test(){
    // console.log(' > Test results: ', this);

    return true;
  }

  async autoLoad(_modules = {}, parent = null) {
    const _autoLoadModules = this.autoLoadModules();
    const _allModules      = Object.keys(_modules).length > 0 ? _modules : _autoLoadModules;

    // console.log(' Received modules: ', _allModules);

    if (typeof _allModules !== 'object' || Array.isArray(_allModules)) {
      console.error(' _modules must be an object/hash.');
      return;
    }

    for (const name of Object.keys(_allModules)) {
      if (!_autoLoadModules[name]) {
        console.warn(` '${name}' not found in permitted autoLoad modules and will be skipped.`);
        continue;
      }

      this.modulesToLoad[name] = _autoLoadModules[name]
    };

    // console.log(' Load modules: ', this.modulesToLoad);
    this.set_text('.loading-title', 'Loading system module...');

    for (const name of Object.keys(this.modulesToLoad)) {
      this.set_text('.loading-item', `...${this.capitalize(name)}`);
      // console.log(` Loading module: '${name}' file: ${this.modulesToLoad[name]}...`);

      try {
        const mod = await import(`/lib/volundir/${this.modulesToLoad[name]}`);

        const className = Object.keys(mod)[0];
        this.importedModules[name] = mod[className];

        const loadingClass = this.importedModules[name];

        this.loadedModules[name] = new loadingClass();
      } catch (err) {
        if (err.message.indexOf('is not a constructor') >= 0) {
          console.error(` Error Load module  ${name}: ${err.message}`);
        }
      }
    }

    // console.log(' Loaded modules: ', this.loadedModules);
    this.set_text('.loading-title', 'Registering system modules...');

    for (const name of Object.keys(this.loadedModules)) {
      this.set_text('.loading-item', `...${this.capitalize(name)}`);
      // console.log(` Registering module '${name}'...`);

      this.register(name, this.loadedModules[name]);

      this[name] = this.loadedModules[name];

      // Object.defineProperty(this, className, {
      //   value: this.loadedModules[name],
      //   writable: true,
      //   enumerable: true,
      //   configurable: true
      // });

      // console.log('==========> Created method for _module: ', name);
    }

    this.set_text('.loading-title', 'Validating system module...');
    for (const name of Object.keys(this.loadedModules)) {
      this.set_text('.loading-item', `...${this.capitalize(name)}`);
      // console.log(` Validating module ${name}...`);

      this.setModules(this.loadedModules[name], this.loadedModules);
      this.loadedModules[name].test();
    }

    this.set_text('.loading-title', 'System Modules load...');
    this.set_text('.loading-item', 'Completed');
  }

  autoLoadModules () {
    // console.log(' Reading autoLoad configuration...');
    const _autoLoad  = JSON.parse(sessionStorage.getItem('autoload'));

    return _autoLoad;
  }

  version(){
    this.VERSION;
  }
}
