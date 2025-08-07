
export class BaseModule {
  constructor(_modules) {
    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];
    // this.requiredModels = ['config_model', 'object_register_model'];
    // this.requiredModels = ['object_register_model'];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'session';

    // console.log(` [base_module] ${this.constructor.name} loaded.`);
    // this._modules = _modules || this._modules || {};

    // if(_modules) {
    //   this.setAllLoadedModules();
    // }
  }

  requiredModules() {
    return this.requiredModules;
  }

  requiredModels() {
    return this.requiredModels;
  }

  setModule(moduleName, moduleObject) {
    this[moduleName] = moduleObject;
  }

  setModules(moduleObject, moduleObjects) {
    // console.log(' [base_module] setModules: moduleObject: ', moduleObject, ' modules: ', moduleObjects);

    for (const [name_, module_] of Object.entries(moduleObjects)) {
      // console.log(' [base_module] name: ', name_, ' module: ', module_);

      moduleObject.setModule(name_, module_);
    }

    // moduleObject.moduleObjects = moduleObjects;
  }

  setModel(modelName, modelObject) {
    // console.log(' [base_model][setModel] name: ', modelName, ' model: ', modelObject);
    // const instanceName = Object.keys(modelObject)[0];

    // this[instanceName] = modelObject;
    this[modelName] = modelObject;
  }

  setModels(modelObject, modelObjects) {
    // console.log(' [base_model] setmodels: modelObject: ', modelObject, ' models: ', modelObjects);

    for (const [name_, model_] of Object.entries(modelObjects)) {
      // console.log(' [base_model] name: ', name_, ' model: ', model_);

      modelObject.setModel(name_, model_);
    }

    // modelObject._models = _models;
  }

  setControllerLoadedModules(){
    // console.log(' [base_module] setAllLoadedModules');
    // console.log('               Called from:', this.constructor.name);

    for (const [_name, _module] of Object.entries(this._modules)) {
      this.setModule(_name, _module);
    }
  }

  // async _loadModules(_modules = {}, display) {
  //   const _autoLoadModules  = this.autoLoadModules();
  //   const _permittedModules = Object.keys(_modules).length > 0 ? _modules : _autoLoadModules;

  //   // console.log(' [base_module] auto load modules: ', _autoLoadModules);s
  //   // console.log(' [base_module] permitted modules: ', _permittedModules);s

  //   if (typeof _permittedModules !== 'object' || Array.isArray(_permittedModules)) {
  //     console.error(` [base_module] permitted modules must be an object/hash.`);
  //     return;
  //   }

  //   for (const name of Object.keys(_permittedModules)) {
  //     if (!_autoLoadModules[name]) {
  //       console.warn(` [base_module] '${name}' not found in permitted modules and will be skipped.`);
  //       continue;
  //     }

  //     this.modulesToLoad[name] = _autoLoadModules[name]
  //   };

  //   // console.log(' Load modules: ', this.modulesToLoad);
  //   display.splashMessage('.loading-title', 'Loading system module...');

  //   for (const name of Object.keys(this.modulesToLoad)) {
  //     display.splashMessage('.loading-item', `...${name.capitalize()}`);
  //     // console.log(` Loading module: '${name}' file: ${this.modulesToLoad[name]}...`);

  //     try {
  //       const mod = await import(`/lib/volundir/${this.modulesToLoad[name]}`);
  //       // const mod = await FileUtils.loadClass(`/lib/volundir/${this.modulesToLoad[name]}`);

  //       // console.log(' [base_module] mod: ', mod[name]);

  //       // const className = Object.keys(mod)[0];
  //       // this.importedModules[name] = mod[className];

  //       // const loadingClass = this.importedModules[name];

  //       // this.loadedModules[name] = new loadingClass();
  //       this.loadedModules[name] = mod[name];
  //     } catch (err) {
  //       if (err.message.indexOf('is not a constructor') >= 0) {
  //         console.error(` [base_module] Error Load module  ${name}: ${err.message}`);
  //       }
  //     }
  //   }

  //   // console.log(' Loaded modules: ', this.loadedModules);
  //   display.splashMessage('.loading-title', 'Registering system modules...');

  //   for (const name of Object.keys(this.loadedModules)) {
  //     display.splashMessage('.loading-item', `...${name.capitalize()}`);
  //     // console.log(` Registering module '${name}'...`);

  //     this.register(name, this.loadedModules[name]);

  //     this[name] = this.loadedModules[name];

  //     // Object.defineProperty(this, className, {
  //     //   value: this.loadedModules[name],
  //     //   writable: true,
  //     //   enumerable: true,
  //     //   configurable: true
  //     // });

  //     // console.log('==========> Created method for _module: ', name);
  //   }

  //   display.splashMessage('.loading-title', 'Validating system module...');

  //     // console.log(` [base_module] loadedModules`, this.loadedModules);

  //   for (const name of Object.keys(this.loadedModules)) {
  //     display.splashMessage('.loading-item', `...${name.capitalize()}`);
  //     // console.log(` [base_module] Validating module ${name}...`);

  //     const instance_class = this.loadedModules[name];

  //     // console.log(` [base_module] Class: `, instance_class);

  //     this.setModules(instance_class, this.loadedModules);

  //     instance_class.isValidated(name);
  //   }

  //   display.splashMessage('.loading-title', 'System Modules load...');
  //   display.splashMessage('.loading-item', 'Completed');
  // }

  // _autoLoadModules () {
  //   // console.log(' [base_module] Reading autoLoad configuration...');
  //   const _autoLoad  = JSON.parse(sessionStorage.getItem('autoload'));
  //   // console.log(' [base_module] autoLoad configuration:', _autoLoad);

  //   return _autoLoad;
  // }

  // _autoLoadModels () {
  //   // console.log(' [base_module] Reading autoLoad configuration...');
  //   const _autoLoad  = JSON.parse(sessionStorage.getItem('autoload'));
  //   // console.log(' [base_module] autoLoad configuration:', _autoLoad);

  //   return _autoLoad;
  // }

  isValidated(moduleName){
    // console.log(' [base_module] isValidated: moduleName: ', moduleName);

    const constructorName = this.constructor.name.toLowerCase().replace(/module/g, "");
    // console.log(' [base_module] constructorName: ', constructorName);

    const result = (moduleName == constructorName);

    if(result){
      // console.log(` [base_module] ${this.constructor.name} validated.`);
    }
    else {
      console.error(` [base_module] Module ${moduleName} does not respond to: ${this.constructor.name}`);
    }

    return result;
  }

  // toPascalCase(str) {
  //   return str
  //     .replace(/[-_](.)/g, (_, c) => c.toUpperCase()) // trata snake/kebab
  //     .replace(/^(.)/, (_, c) => c.toUpperCase());
  // }

  version(){
    this.VERSION;
  }
}
