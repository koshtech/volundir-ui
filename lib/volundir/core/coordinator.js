import { ObjectRegisterModel } from '/lib/volundir/models/object_register_model.js';
import { BaseModule }            from '/lib/volundir/base/base_module.js';

export class Coordinator extends BaseModule {
  constructor(_modules) {
    super(_modules);

    // this.initLevel = 'notInitialized';
    this.initLevel = (async () => await this.getInitLevel());

    this.loadedModules = {};
    this.loadedModulesDependencies = [];

    this.loadedModels  = {};
    this.loadedModelsDependencies = [];
    // console.log(' [coordinator] this.initLevel: ', this.initLevel);
  }

  setLoadedModules(objectInstance, loadedModules){
    objectInstance.loadedModules = loadedModules;
  }

  setLoadedModels(objectInstance, loadedModels){
    objectInstance.loadedModels = loadedModels;
  }

  isLoadedModule(moduleName) {
    return (this.loadedModules[moduleName] && Object.keys(this.loadedModules[moduleName]).length > 0);
  }

  getLoadedModule(moduleName) {
    console.log(' [coordinator][getLoadedModule] moduleName: ', moduleName);
    console.log(' [coordinator][getLoadedModule] this.loadedModules: ', this.loadedModules);
    let loadedModule = false;

    if(this.isLoadedModule(moduleName)) {
      loadedModule = this.loadedModules[moduleName]
    }
    console.log(' [coordinator][getLoadedModule] loadedModule: ', loadedModule);

    return loadedModule;
  }

  getLoadedModules() {
    console.log(' [coordinator][getLoadedModules] this.loadedModules: ', this.loadedModules);

    return this.loadedModules;
  }

  // getLoadedModule() {
  //   return this.loadedModules;
  // }

  // isRegisteredModule(moduleName) {
  //   const findData = {};
  //   const namespace       = rawNamespace.capitalize();
  //   const objectNamespace = `registered${namespace}`;
  //   // const internalSource  = `loaded${namespace}`;

  //   findData['id']        = objectName;
  //   findData['namespace'] = objectNamespace;

  //   console.log(' [coordinator][getModule] this: ', this);
  //   console.log(' [coordinator][getModule] data: ', findData);

  //   let objectRegister = new this.object_register_model();

  //   console.log(' [coordinator][getModule] objectRegister: ', objectRegister);

  //   objectRegister.setModule('storage', this.storage);
  //   objectRegister.setModule('file', this.file);

  //   // loadedModule = this.loadedModules[moduleName];

  //   loadedModule = await objectRegister.find(findData);
  // }

  // getRegisteredModule(moduleName) {

  // }


  async saveRegisteredObject(rawNamespace, objectName, objectInstance) {
    console.log(' [coordinator][saveRegisteredObject] this.initLevel: ', this.initLevel);

    if(! ['loadCoreModules', 'registerCoreModules', 'loadCoreModels'].includes(this.initLevel)) {
      try {
        const saveData        = {};
        const namespace       = rawNamespace.capitalize();
        const objectNamespace = `registered${namespace}`;
        // const internalSource  = `loaded${namespace}`;

        saveData[objectNamespace]   = JSON.stringify(Object.keys(this.getLoadedModules()));
        saveData['namespace'] = rawNamespace;

        let objectRegister = new this.object_register_model(saveData);
        objectRegister.setModule('storage', this.storage);

        console.log(' [coordinator][register] objectRegister: ', objectRegister);
        console.log(' [coordinator][register] saveData: ', saveData);

        await objectRegister.save();
      } catch (error) {
        console.error(` [coordinator][register] A critical error occurred registering object '${objectName}': `,  error);
      }
    }
    else {
      console.log(' [coordinator][register] this.initLevel == "loadCoreModules" not register modules.');
    }
  }

  async getRegisteredObject(rawNamespace, objectName) {
    let loadedModule;

    if(! ['loadCoreModules', 'registerModules', 'loadCoreModels'].includes(this.initLevel)) {
      try {
        const findData = {};
        const namespace       = rawNamespace.capitalize();
        const objectNamespace = `registered${namespace}`;
        // const internalSource  = `loaded${namespace}`;

        findData['id']        = objectName;
        findData['namespace'] = rawNamespace;

        // console.log(' [coordinator][getModule] this: ', this);
        // console.log(' [coordinator][getModule] data: ', findData);

        let objectRegister = new this.object_register_model();

        // console.log(' [coordinator][getModule] objectRegister: ', objectRegister);

        objectRegister.setModule('storage', this.storage);
        objectRegister.setModule('file', this.file);

        // loadedModule = this.loadedModules[moduleName];

        loadedModule = await objectRegister.find(findData);

      } catch (error) {
        // throw new Error(` [coordinator][getModule] A critical error occurred find and return object '${moduleName}': `,  error);
        console.error(` [coordinator][getModule] A critical error occurred find and return object '${moduleName}': `,  error);
      }
    }
    else {
      // console.log(' [coordinator][register] this.initLevel == "loadCoreModules" not register modules.');
    }

    console.log(' [coordinator][getModule] loadedModule: ', loadedModule);

    return loadedModule;
  }

  // async getRegisteredObjects(rawNamespace) {
  //   let loadedModules;

  //   if(! ['loadCoreModules', 'registerModules', 'loadCoreModels'].includes(this.initLevel)) {
  //     try {
  //       const listData = {};
  //       const namespace       = rawNamespace.capitalize();
  //       const objectNamespace = `registered${namespace}`;
  //       const internalSource  = `loaded${namespace}`;

  //       listData['namespace'] = objectNamespace;

  //       // console.log(' [coordinator][getRegisteredObjects] this: ', this);
  //       // console.log(' [coordinator][getRegisteredObjects] data: ', listData);

  //       let objectRegister = new this.object_register_model(listData);

  //       // console.log(' [coordinator][getRegisteredObjects] objectRegister: ', objectRegister);

  //       objectRegister.setModule('storage', this.storage);
  //       objectRegister.setModule('file', this.file);

  //       // loadedModules = this.loadedModules[moduleName];

  //       loadedModules = await objectRegister.list();

  //       // console.log(' [coordinator][getRegisteredObjects] loadedModules: ', loadedModules);
  //     } catch (error) {
  //       // throw new Error(` [coordinator][getRegisteredObjects] A critical error occurred find and return object '${moduleName}': `,  error);
  //       console.error(` [coordinator][getRegisteredObjects] A critical error occurred find and return objects: `,  error);
  //     }
  //   }
  //   else {
  //     // console.log(' [coordinator][register] this.initLevel == "loadCoreModules" not register modules.');
  //   }

  //   // console.log(' [coordinator][getRegisteredObjects] loadedModules: ', loadedModules);

  //   return loadedModules;
  // }

  /**
   * Register loaaded objects namespaced its type.
   * @param {string} namespace lib|extension|module|model|controller|helper
   * @param {string} objectName
   * @param {object} objectInstance
   * @returns {string}
   */
  async register(namespace='lib', objectName, objectInstance) {
    console.log(` [coordinator][register] namespace: ${namespace} / name: ${objectName} / object: `, objectInstance);
    // console.log(` [coordinator][register] this.initLevel: `, this.initLevel);

     this.setLoadedModules(objectInstance, this.loadedModules);

     this.setLoadedModels(objectInstance, this.loadedModels);

    this.registerObjectModules(this);
    this.registerObjectModules(objectInstance);

    this.registerObjectModels(this);
    this.registerObjectModels(objectInstance);

    await this.saveRegisteredObject(namespace, objectName, objectInstance);
  }

  async registerObjectModules(objectInstance){
    console.log(' [Coordinator][registerObjectModules] objectInstance: ', objectInstance);
    const sendModules     = {};
    const requiredModules = objectInstance.requiredModules;
    console.log(' [Coordinator][registerObjectModules] this.initLevel: ', this.initLevel);

    console.log(' [Coordinator][registerObjectModules] objectInstance.requiredModules: ', objectInstance.requiredModules);
    console.log(' [Coordinator][registerObjectModules] requiredModules: ', requiredModules);

    try {
      if(Object.keys(requiredModules).length > 0){
        for (const requiredModuleName of requiredModules) {
          console.log(' [Coordinator][registerObjectModules] requiredModuleName: ', requiredModuleName);

          // sendModules[requiredModuleName] = this.loadedModules[requiredModuleName];
          sendModules[requiredModuleName] = this.getLoadedModule(requiredModuleName)
        }

        console.log(' [Coordinator][registerObjectModules] sendModules: ', sendModules);

        objectInstance.setModules(objectInstance, sendModules);
      }
    } catch (err) {
      console.error(` [Coordinator] Error registering object modules: ${err.message}`);
    }
  }

  async registerObjectModels(objectInstance){
    console.log(' [Coordinator][registerObjectModels] objectInstance: ', objectInstance);
    const sendModels     = {};
    const requiredModels = objectInstance.requiredModels;

    console.log(' [Coordinator][registerObjectModels] requiredModels: ', requiredModels);

    try {
      if(Object.keys(requiredModels).length > 0){
        for (const requiredModelName of requiredModels) {
          // console.log(' [Coordinator][registerObjectModels] requiredModelName: ', requiredModelName);
          // console.log(' [Coordinator][registerObjectModels] loadedModels[requiredModelName]: ', loadedModels[requiredModelName]);

          sendModels[requiredModelName] = this.loadedModels[requiredModelName];
        }

        // console.log(' [Coordinator][registerObjectModels] sendModels: ', sendModels);

        objectInstance.setModels(objectInstance, sendModels);
      }
    } catch (err) {
      console.error(` [Coordinator] Error registering object models: ${err.message}`);
    }
  }

  async registerLib(controllerName, controller) {
    await this.register('libs', controllerName, controller);
  }

  async registerModule(moduleName, moduleObject) {
    this.loadedModules[moduleName] = moduleObject;

    await this.register('modules', moduleName, moduleObject);
  }

  async registerModel(modelName, modelObject) {
    this.loadedModels[modelName] = modelObject;

    await this.register('models', modelName, modelObject);
  }

  async registerController(controllerName, controller) {
    await this.register('controllers', controllerName, controller);
  }

  async registerHelper(helperName, helper) {
    await this.register('helpers', helperName, helper);
  }

  async registerExtension(extensionName, extension) {
    await this.register('extensions', extensionName, extension);
  }

  async registerCoreModules() {
    await this.setInitLevel();

    await this.executeModuleRegister();
  }

  async registerModules() {
    await this.setInitLevel();

    await this.executeModuleRegister();
  }

  async executeModuleRegister() {
    // console.log(' [Coordinator][registerModules] this.loadedModules before for: ', this.loadedModules);

    for (const [moduleName, moduleObject] of Object.entries(this.loadedModules)) {

      // console.log(` [Coordinator][registerModules] for moduleName: ${moduleName}, moduleObject: `, moduleObject);

      await this.registerModule(moduleName, moduleObject);
    }

    // console.log(' [Coordinator][registerModules] this.loadedModules after for: ', this.loadedModules);

    // await this.configuration.save('loadedModules', this.loadedModules);
    // await this.configuration.save('loadedModels', this.loadedModels);
  }

  async getModule(moduleName) {
    let loadedModule;

    // if(['loadCoreModules', 'registerModules'].includes(this.initLevel)) {
      loadedModule = this.loadedModules[moduleName];
    // }
    // else {
    //   try {
    //     const data        = {};
    //     let namespace     = 'module';
    //     let loadedModules = await this.configuration.get('loadedModules');

    //     data['id']        = moduleName;
    //     data['namespace'] = namespace;

    //     console.log(' [coordinator][getModule] this: ', this);
    //     console.log(' [coordinator][getModule] data: ', data);

    //     var objectRegister = new ObjectRegisterModel();

    //     console.log(' [coordinator][getModule] objectRegister: ', objectRegister);

    //     objectRegister.setModule('storage', this.storage);
    //     objectRegister.setModule('file', this.file);

    //     loadedModule = await objectRegister.find(data);
    //   } catch (error) {
    //     // throw new Error(` [coordinator][getModule] A critical error occurred find and return object '${moduleName}': `,  error);
    //     console.error(` [coordinator][getModule] A critical error occurred find and return object '${moduleName}': `,  error);
    //   }
    // }

    return loadedModule;
  }


  listDependencies(moduleName, loadedModule){
    // console.log(' [Coordinator][listDependencies] loadedModule: ', loadedModule);

    var dependencies    = {}
    var requiredModules = [];
    var requiredModels  = [];

    try {
      if(Object.keys(loadedModule.requiredModules).length > 0){
        for (const requiredModuleName of loadedModule.requiredModules) {
          // console.log(' [Coordinator][listDependencies] requiredModuleName: ', requiredModuleName);

          requiredModules.push(requiredModuleName);
        }

        // console.log(` [Coordinator][listDependencies] requiredModules for module ${moduleName}: `, requiredModules);

      }
      else{
        // console.log(` [Coordinator][listDependencies] module ${moduleName} has no module dependencies.`);
      }
    } catch (error) {
      console.error(' [Coordinator][listDependencies] Error listing dependencies for module: ', moduleName, ' error: ', error);
    }

    dependencies['requiredModules'] = requiredModules;

    try {
      if(Object.keys(loadedModule.requiredModels).length > 0){
        for (const requiredModelname of loadedModule.requiredModels) {
          // console.log(' [Coordinator][listDependencies] requiredModelname: ', requiredModelname);

          requiredModels.push(requiredModelname);
        }

        // console.log(` [Coordinator][listDependencies] requiredModels for module ${moduleName}: `, requiredModels);

      }
      else{
        // console.log(` [Coordinator][listDependencies] module ${moduleName} has no model dependencies.`);
      }
    } catch (error) {
      console.error(' [Coordinator][listDependencies] Error listing dependencies for module: ', moduleName, ' error: ', error);
    }

    dependencies['requiredModels'] = requiredModels;
    // console.log(` [Coordinator][listDependencies] dependencies for module ${moduleName}: `, dependencies);

    return dependencies;
  }

  async loadDependencies(dependencies){
    // console.log(' [Coordinator][loadDependencies] dependencies["requiredModules"]: ', dependencies["requiredModules"]);
    // console.log(' [Coordinator][loadDependencies] dependencies["requiredModels"]: ', dependencies["requiredModels"]);

    if(Object.keys(dependencies).length > 0 && Object.keys(dependencies["requiredModules"]).length > 0){
        // console.log(' [Coordinator][loadDependencies] dependencies["requiredModules"]: ', dependencies["requiredModules"]);

      for (const moduleName of dependencies["requiredModules"]) {
        // console.log(' [Coordinator][loadDependencies] moduleName: ', moduleName);

        const loadedModule = await this.importModule(moduleName, `/lib/volundir/modules/${moduleName}.js`);

        // console.log(' [Coordinator][loadDependencies] loadedModule: ', loadedModule);
      }
    }

    // loadedModule.setModules(loadedModule, requiredModules);

    // console.log(' [Coordinator][loadDependencies] this.loadedModels before dependency load: ', this.loadedModels);

    if(Object.keys(dependencies).length > 0 && Object.keys(dependencies["requiredModels"]).length > 0){

      for (const modelName of dependencies["requiredModels"]) {
        // console.log(' [Coordinator][loadDependencies] modelName: ', modelName);
        // console.log(' [Coordinator][loadDependencies] this.loadedModels[modelName]): ', this.loadedModels[modelName]);

        // const instanceName = Object.keys(this.loadedModels[modelName])[0];

        // if(this.loadedModels[modelName]){
        //   const loadedModel  = this.loadedModels[modelName];
        // }
        // else{
          const loadedModel  = await this.importModel(modelName, `/lib/volundir/models/${modelName}.js`);
        // }

        // console.log(' [Coordinator][loadDependencies] loadedModel: ', loadedModel);
        // console.log(' [Coordinator][loadDependencies] Object.keys(loadedModel): ', Object.keys(loadedModel));

        // const instanceName = loadedModel.name;

        // console.log(' [Coordinator][loadDependencies] model instanceName: ', instanceName);

        // this.loadedModels[modelName] = loadedModel;
      }

      // console.log(' [Coordinator][loadDependencies] requiredModels: ', requiredModels);

      // loadedModule.setModels(loadedModule, requiredModels);
    }

    // console.log(' [Coordinator][loadDependencies] this.loadedModels after dependency load: ', this.loadedModels);
    // console.log(' [Coordinator][loadDependencies] this: ', this);
  }

  /*
    Levels:
        0 = Application not initialized;
        1 = Init error;
       10 = loadCoreModules;
       20 = loadCoreModels;
       30 = loadExtensions;
       40 = loadConfiguration;
       50 = loadModules;
      110 = Interceptors;
      120 = Adaptors;
      130 = Components;
      140 = Data Models;
      150 = interface;
      200 = Application ready;

  */
  async setInitLevel(level = null) {
    let currentLevel;

    // console.log(' [coordinator][setInitLevel] this.initLevel: ', this.initLevel);
    // console.log(' [coordinator][setInitLevel] level: ', level);

    if (level && level.length > 0) {
      currentLevel = level;
    } else {
      const stack = new Error().stack.split('\n');

      // console.log(' [coordinator][setInitLevel] stack: ', stack);

      const callerLine = stack[2] || '';
      const match = callerLine.match(/at (?:\w+\.)?(\w+)/);
      currentLevel = match ? match[1] : 'unknown';
    }

    // console.log(' [coordinator][setInitLevel] currentLevel: ', currentLevel);

    this.initLevel = currentLevel;

    if(! ['loadCoreModules', 'registerModules', 'loadCoreModels'].includes(this.initLevel)) {
      await this.configuration.save('initLevel', this.initLevel);
    }

    // console.log(' [coordinator][setInitLevel] new this.initLevel: ', this.initLevel);
  }

  async getInitLevel() {
    let currentLevel = this.initLevel || 'notInitialized';

    if(!['notInitialized', 'loadCoreModules', 'registerModules', 'loadCoreModels'].includes(this.initLevel)) {
      currentLevel = await this.configuration.get('initLevel');
    }

    return currentLevel;
  }
}
