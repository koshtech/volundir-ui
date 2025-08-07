import { ModelCollection } from './collection_model.js';
// import { Validator } from '/lib/volundir/modules/validator.js';

export class BaseModel {
  constructor(attributes = {}) {
    var data = attributes || this.attributes;

    // Default equired modules
    this.requiredModules = [];

    // Default required models
    this.requiredModels = [];

    this.resourceName = this.resourceName();

    // console.log(' [base_model] data: ', data);

    Object.assign(this, data);
  }

  static requiredModules() {
    return this.requiredModules;
  }

  static requiredModels() {
    return this.requiredModels;
  }

  setModule(_name, _module) {
    this[_name] = _module;
  }

  setModules(_modules) {
    for (const [name_, module_] of Object.entries(_modules)) {
      this.setModule(name_, module_);
    }
  }

  async load(_modules = {}, display) {
    const _autoLoadModules = this.autoLoadModules();
    const _allModules      = Object.keys(_modules).length > 0 ? _modules : _autoLoadModules;

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
    display.splashMessage('.loading-title', 'Loading system module...');

    for (const name of Object.keys(this.modulesToLoad)) {
      display.splashMessage('.loading-item', `...${name.capitalize()}`);
      // console.log(` Loading module: '${name}' file: ${this.modulesToLoad[name]}...`);

      try {
        const mod = await import(`/lib/volundir/${this.modulesToLoad[name]}`);
        // const mod = await FileUtils.loadClass(`/lib/volundir/${this.modulesToLoad[name]}`);

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
    display.splashMessage('.loading-title', 'Registering system modules...');

    for (const name of Object.keys(this.loadedModules)) {
      display.splashMessage('.loading-item', `...${name.capitalize()}`);
      // console.log(` Registering module '${name}'...`);

      this.registerModule(name, this.loadedModules[name]);

      this[name] = this.loadedModules[name];

      // Object.defineProperty(this, className, {
      //   value: this.loadedModules[name],
      //   writable: true,
      //   enumerable: true,
      //   configurable: true
      // });

      // console.log('==========> Created method for _module: ', name);
    }

    display.splashMessage('.loading-title', 'Validating system module...');
    for (const name of Object.keys(this.loadedModules)) {
      display.splashMessage('.loading-item', `...${name.capitalize()}`);
      // console.log(` Validating module ${name}...`);

      this.setModules(this.loadedModules[name], this.loadedModules);
      this.loadedModules[name].test();
    }

    display.splashMessage('.loading-title', 'System Modules load...');
    display.splashMessage('.loading-item', 'Completed');
  }

  // static get storage () {
  //   var _storage        = JSON.parse(sessionStorage.getItem('storage'));
  //   var _default_source = _storage['default'];

  //   return _storage[_default_source];
  // }

  resourceName() {
    return this.constructor.name.toLowerCase() + 's';
  }

  static async find(id) {
    // console.log(" [base_model][static find] this: ", this);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      id: id
    }

    // console.log(" [base_model][static find] data: ", data);
    // console.log(" [base_model][static find] this.storage: ", this.storage);

    const response = this.storage.find(data);

    if (response) {
      Object.assign(this, data[this.constructor.resourceName]);

      return response;
    }

    console.error("Error finding data.");
    return false;
  }

  async find(attributes) {
    // console.log(" [base_model][find] this: ", this);
    // console.log(" [base_model][find] attributes: ", attributes);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      attributes: attributes
    }

    // console.log(" [base_model][find] data: ", data);
    // console.log(" [base_model][find] this.storage: ", this.storage);

    const response = this.storage.find(data);

    if (response) {
      Object.assign(this, data[this.constructor.resourceName]);

      return response;
    }

    console.error("Error finding data.");
    return false;
  }

  async save() {
    var attributes = this.attributes;

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      attributes: attributes
    }
    // console.log(" [base_model][save] attributes: ", attributes);
    // console.log(" [base_model][save] data: ", data);
    // console.log(" [base_model][save] this: ", this);
    // console.log(" [base_model][save] this.storage: ", this.storage);

    const response = this.storage.save(data);

    if (response) {
      Object.assign(this, data[this.constructor.resourceName]);

      return true;
    }

    console.error("Error saving data.");
    return false;
  }

  async update(attributes = {}) {
    Object.assign(this, attributes);
    await this.save();
  }

  async destroy() {
    if (!this.id) throw new Error("ID is required to delete.");

    const url = `${this.constructor.storage.url}/${this.constructor.resourceName}/${this.id}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) throw new Error("Error deleting.");
  }

  static async all() {
    const url = `${this.storage.url}/${this.resourceName}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Error getting list.');

    const data = await response.json();

    // console.log('data on find: ', data);

    return new ModelCollection(data.map(attrs => new this(attrs)));;
  }
}

// console.log('BaseModel loaded.')
