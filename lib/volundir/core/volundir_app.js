await import('/lib/volundir/config/boot.js');

import { Coordinator } from '/lib/volundir/core/coordinator.js';

export class VolundirApp extends Coordinator {
  constructor() {
    super();

    // Required and essential modules. Do not remove!
    this.coreModules = ['file', 'storage', 'configuration', 'extensions', 'interceptor', 'display', 'render'];
    // this.coreModules = ['storage', 'file', 'configuration', 'extensions', 'display', 'render'];
    this.coreModels  = ['config_model', 'object_register_model'];

    this.loadedModules = {};
    this.loadedModulesDependencies = [];

    this.loadedModels  = {};
    this.loadedModelsDependencies = [];

    // Required modules
    // this.requiredModules = ['storage'];

    // Required models
    this.requiredModels = ['object_register_model'];

    // Module storage adapter use to save internal data
    // this.storageAdapter = 'session';
  }

  async run() {
    this.init();
  }

  async init() {
    await this.loadCoreModules();

    await this.startSplash();

    this.display.splashMessage('.loading-title', 'Loading and Registering...');
    this.display.splashMessage('.loading-item', '...Core Modules');

    this.display.splashMessage('.loading-title', 'Loading...');
    this.display.splashMessage('.loading-item', '...Javascript Extensions');
    await this.loadExtensions();

    this.display.splashMessage('.loading-item', '...Core Modules and Data Models');
    await this.loadCoreModels();

    this.display.splashMessage('.loading-item', '...System Configuration');
    await this.loadConfiguration();

    this.display.splashMessage('.loading-title', 'Registering...');
    this.display.splashMessage('.loading-item', '...Loaded Core Modules');
    await this.registerModules();

    this.display.splashMessage('.loading-title', 'Loading...');
    this.display.splashMessage('.loading-item', '...Modules');
    await this.loadModules();

    // this.display.splashMessage('.loading-title', 'Registering...');
    // this.display.splashMessage('.loading-item', '...Modules');
    // await this.registerModules();

    this.display.splashMessage('.loading-item', '...Interceptors');
    // // await listener.loadDefaults();

    this.display.splashMessage('.loading-item', '...Adaptors');
    // // console.log(' [Volundir] Loading adapters...');

    this.display.splashMessage('.loading-item', '...Components');

    this.display.splashMessage('.loading-item', '...Data Models');

    this.display.splashMessage('.loading-item', '...interface');

    this.loadInterface();

    this.navigateRoot();

    await this.stopSplash();

    this.setInitLevel('appReady');
  }

  async loadCoreModules() {
    await this.setInitLevel();

    for (const moduleName of this.coreModules) {
      this[moduleName] = await this.loadModule(moduleName, `/lib/volundir/modules/${moduleName}.js`);
    }
  }

  async loadModules() {
    await this.setInitLevel();

    const loadingModules = await this.configuration.get('modules');

    for (const moduleName of Object.keys(loadingModules)) {
      this[moduleName] = await this.loadModule(moduleName, `/lib/volundir/modules/${moduleName}.js`);
    }
  }

  async loadCoreModels() {
    await this.setInitLevel();

    for (const modelToLoad of this.coreModels) {
      await this.loadModel(modelToLoad, `/lib/volundir/models/${modelToLoad}.js`);
    }
  }

  async loadModel(modelName, modelPath) {
    var loadedModel = null;
    var dependencies = {};

    try {
      if(this.loadedModels[modelName]){
        loadedModel = await this.loadedModels[modelName];
      }
      else{
        const loadedClass  = await import(modelPath);
        const instanceName = Object.keys(loadedClass)[0];

        loadedModel  = loadedClass[instanceName];
      }

    } catch (error) {
      console.error(' [Volundir][loadModel] Error importing module:', error);
    }

    return loadedModel;
  }

  async importModel(modelName, modelPath) {
    var loadedModel = null;

    try {
      if(this.loadedModels[modelName] && Object.keys(this.loadedModels[modelName]).length > 0) {
        loadedModel = this.loadedModels[modelName];
      }
      else {
        const loadedClass  = await import(modelPath);
        const instanceName = Object.keys(loadedClass)[0];

        loadedModel  = loadedClass[instanceName];
      }

      await this.registerModel(modelName, loadedModel);
    } catch (error) {
      console.log(' [Volundir][importModel] Error importing model: ', modelName, ' error: ', error);
    }

    return loadedModel;
  }

  async loadModule(moduleName, modulePath) {
    var loadedModule = null
    var dependencies = {};

    try {
      loadedModule = await this.importModule(moduleName, modulePath);
      dependencies = this.listDependencies(moduleName, loadedModule);

      await this.loadDependencies(dependencies);

      this.registerModule(moduleName, loadedModule);

    } catch (error) {
      console.error(' [Volundir][loadModule] Error loading module: ', moduleName, ' error: ', error);
    }

    return loadedModule;
  }

  async importModule(moduleName, modulePath) {
    var loadedModule = null;

    try {
      if(this.isLoadedModule(moduleName)) {
        loadedModule = this.getLoadedModule(moduleName)
      }
      else {
        const loadedClass = await import(modulePath);
        loadedModule      = loadedClass[moduleName];
      }

      await this.registerModule(moduleName, loadedModule);
    } catch (error) {
      console.error(' [Volundir][importModule] Error importing module: ', moduleName, ' error: ', error);
    }

    return loadedModule;
  }

  async startSplash() {
    await this.setInitLevel();

    await this.display.startSplash();
  }

  async stopSplash() {
    await this.setInitLevel();

    await this.display.stopSplash();
  }

  async loadExtensions() {
    await this.setInitLevel();

    await this.extensions.load();
  }

  async loadConfiguration() {
    await this.setInitLevel();

    await this.configuration.load();
  }

  async loadAppModels() {

  }

  async loadModels() {

  }

  async loadInterface() {
    this.setInitLevel();

    await this.render.appLayout();

  }

  navigateRoot() {
    this.setInitLevel();

    this.reexecuteScripts();

    console.log(' [Volundir][navigateRoot] Go!');

    // this.navigateTo('/');
    this.interceptor.handleInternalRoute('/');
  }

  navigateTo(path) {
    history.pushState({}, '', path);

    window.dispatchEvent(new Event('popstate'));
  }

  reexecuteScripts(container = document.body) {
    console.log('Volundr reexecuteScripts!');

    container.querySelectorAll('script').forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.type = oldScript.type || 'text/javascript';
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
    });
  }

  generatePath(resource, action, id = null, params = '') {
    let path = '';

    // console.log('===> generatePath - resource: ', resource, ' action: ', action, ' id: ', id, ' params: ', params)

    switch (action) {
      case 'index':   path = `/${resource}`; break;
      case 'new':     path = `/${resource}/new`; break;
      case 'create':  path = `/${resource}`; break;
      case 'edit':    path = `/${resource}/${id}/edit`; break;
      case 'update':  path = `/${resource}/${id}`; break;
      case 'show':    path = `/${resource}/${id}`; break;
      case 'destroy': path = `/${resource}/${id}`; break;
      default: throw new Error(`Unknown action '${action}' for resource '${resource}'`);
    }

    if (params) {
      path += `?${params}`;
    }

    return path;
  }

  // delegateLinks() {
  //   document.body.addEventListener('click', (event) => {
  //     const el = event.target.closest('a[href^="/"]');
  //     if (el && !el.hasAttribute('target') && !event.ctrlKey && !event.metaKey) {
  //       event.preventDefault();
  //       const path = el.getAttribute('href');
  //       this.navigate(path);
  //     }
  //   });
  // }
};
