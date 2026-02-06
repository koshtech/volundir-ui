const BaseCache       = await File.import('lib/volundir/base/base_cache.js');

const FileModule      = await File.import('lib/volundir/lib/modules/file_module.js');
const LoggerModule    = await File.import('lib/volundir/lib/modules/logger_module.js');
const StorageModule   = await File.import('lib/volundir/lib/modules/storage_module.js');
const RenderModule    = await File.import('lib/volundir/lib/modules/render_module.js');
const HubModule       = await File.import('lib/volundir/lib/modules/hub_module.js');
const HubCacheModule  = await File.import('lib/volundir/lib/modules/hub_cache_module.js');

export class ObjectCoordinator extends BaseCache {
  constructor(volundirApplication=null) {
    super();

    this.processableObjectTypes = ['model', 'module', 'controller'];

    this.essentialModules = [
      'file',
      'logger',
      'hub',
      'hub_cache',
      'storage',
      'extension',
      'configuration',
      'display',
      'render',
      'router'
    ];

    this.base = {};

    this.extensions = {};

    this.handlers = {};

    this.models = {
      "logger_model": Logger.models.logger_model
    }

    this.modules = {
      "hub":        new HubModule(),
      "hub_cache":  new HubCacheModule(),
      "file":       File,
      "storage":    Logger.modules.storage,
      "render":     new RenderModule(),
      "logger":     Logger
    };

    this.controllers = {};

    this.mapps = {};

    this.app   = null;

    // if(volundirApplication){
    //   this.app = volundirApplication;
    // }

    this.init(); // populate loaded modules dependencies
  }

  init() {
    this.modules['file'].resolved = true;

    this.modules['hub']['modules']['hub_cache']   = this.modules['hub_cache'];
    this.modules['hub'].resolved = true;

    // this.reconfigure('modules', this.modules);

    this.resolved = true;

    console.log('[Coordinator][init] this: ', this);
    // this.updateCache();

  }

  // connect(volundirApplication) {
  //   this.app = volundirApplication;
  // }

  // isConnected() {
  //   return true;
  // }

  system(methodName) {
    let returnedVvalue = null;

    if (this.app && typeof this.app[methodName] === "function") {
      returnedVvalue = this.app[methodName]();
    }

    return returnedVvalue;
  }

  async loadEssentialModules() {
    await this.loadModules(this.essentialModules);
  }

  getLoadedModules() {
    return this.modules;
  }

  getModule(moduleName) {
    return this.modules[moduleName];
  }

  getModule(moduleName) {
    return this.modules[moduleName];
  }

  async loadModules(modules, debug=false) {
    for (const moduleName of modules) {
      // this.modules[moduleName] = await this.loadObject('module', moduleName, null, debug);
      await this.loadObject(`${moduleName}_module`);
    }
  }

  async loadMiniApp(mAppName, mAppPath=null, debug) {
    let loadingMApp = false;

    try {
      // if(this.isLoadedObject(objectType, mAppName)) {
      //   loadingMApp = this.getLoadedObject(objectType, mAppName)
      // }
      // else {
        // console.log(' [Coordinator][loadMiniApp] mAppName: ', mAppName);
        // console.log(' [Coordinator][loadMiniApp] mAppPath: ', mAppPath);
        loadingMApp = await this.modules.hub.importApp(mAppName, mAppPath);

        // console.log(' [Coordinator][loadMiniApp] loadingMApp: ', loadingMApp);
        // if(loadingMApp) {

          // if (typeof loadingMApp.addLog === "function") {
            // console.log(' [Coordinator] Guilda: ', loadingMApp);
            this.mapps[mAppName] = {};
          // }

          for(const objectType of this.objectTypes) {
           if(this.processableObjectTypes.includes(objectType) && Object.keys(loadingMApp[mAppName][objectType]).length > 0){
              for(const loadingObject of loadingMApp[mAppName][objectType]) {
                const instanceName = loadingObject.constructor.name;
                const objectName   = instanceName.fromPascalCaseToSnakeCase();

                this[objectType][objectName] = loadingObject;
              }
            }
          }

          for(const objectType of this.objectTypes) {
            if(this.processableObjectTypes.includes(objectType) && Object.keys(loadingMApp[mAppName][objectType]).length > 0){
              this.mapps[mAppName][objectType] = {};

              for(const loadingObject of loadingMApp[mAppName][objectType]) {
                const instanceName = loadingObject.constructor.name;
                const objectName   = instanceName.fromPascalCaseToSnakeCase();

                this[objectType][objectName] = await this.updateDependencies(loadingObject, debug);

                this['mapps'][mAppName][objectType][objectName] = this[objectType][objectName];
              }
            }
          }

        // }

        if(this['mapps'][mAppName]['modules']) {
          for(const startingModule in this['mapps'][mAppName]['modules']) {
            // console.log(' [Coordinator][loadMiniApp] startingModule: ', startingModule);
            await this['mapps'][mAppName]['modules'][startingModule].init();
          }
        }

        if(this['mapps'][mAppName]['controllers']) {
          for(const startingController in this['mapps'][mAppName]['controllers']) {
            // console.log(' [Coordinator][loadMiniApp] startingController: ', Controller);
            await this['mapps'][mAppName]['controllers'][startingController].index();
          }
        }
      // }
    } catch (error) {
      Logger.error(`Error loading mApp: ${mAppName}`);
      Logger.error(`Message: ${error}`);
    }

    // return this[objectType][mAppName];
  }

  async reconfigure(objectType, objects, debug=false) {
    // console.log(' [Coordinator][reconfigure] objectType: ', objectType);
    // console.log(' [Coordinator][reconfigure] objects: ', objects);

    // for (const reconfiguringObject in objects) {
    // Object.values(objects).forEach(reconfiguringObject => {
    Object.keys(objects).forEach(objectName => {
      const reconfiguringObject = objects[objectName];

      // console.log(' [Coordinator][reconfigure] objectName: ', objectName);

      if(! reconfiguringObject.resolved) {
        // console.log(' [Coordinator][reconfigure] reconfiguringObject: ', reconfiguringObject);
        this[objectType][objectName] = this.updateDependencies(reconfiguringObject, debug);
      }
    });
  }

  async updateDependencies(updatingObject, debug=false) {
    console.log('[Coordinator][updateDependencies] updatingObject: ', updatingObject);

    if(! updatingObject.resolved) {
      for(const dependencyType of this.processableObjectTypes) {
        console.log('[Coordinator][updateDependencies] dependencyType: ', dependencyType);

        if(updatingObject[`required${dependencyType.capitalize()}`] && Object.keys(updatingObject[`required${dependencyType.capitalize()}`]).length > 0) {

          console.log('[Coordinator][updateDependencies] have dependencyType: ', dependencyType);

          for (const objectName of updatingObject[`required${dependencyType.capitalize()}`]) {
            console.log('[Coordinator][updateDependencies] dependency objectName: ', objectName);

            updatingObject[dependencyType][objectName] = await this.loadObject(dependencyType, objectName, null, debug);

            console.log('[Coordinator][updateDependencies] updatingObject[dependencyType][objectName]: ', updatingObject[dependencyType][objectName]);
          }
        }
        else {
          console.log('[Coordinator][updateDependencies] not have dependencyType: ', dependencyType);
        }
      }
    }

    console.log('[Coordinator][updateDependencies] updatingObject: ', updatingObject);
    updatingObject.resolved = true;

    return updatingObject;
  }

  async loadObject(objectName, objectPath=null, debug=false) {
    let loadingObject = null;
    let loadedObject  = null;

    // try {
      const objectType = this.getObjectTypeByObjectName(objectName);

      if(this.isCached(objectName)) {
        loadingObject = this.getCache(objectName);
      }
      else {
        loadingObject = await this.modules.hub.importObject(objectType, objectName, objectPath);
      }

      if(! loadingObject.resolved) {
        loadingObject = await this.updateDependencies(loadingObject, debug);
      }

      if(loadingObject.isReady()) {
        loadedObject = loadingObject;

        this.saveCache(loadedObject);
      }


    // } catch (error) {
    //   console.error(' [Coordinator][loadModule] Error loading object: ', objectName, ' error: ', error);
    // }

    console.log('[Coordinator][loadObject] this: ', this);

    return loadedObject;
  }

  isLoadedObject(objectType, objectName) {
    return (Object.hasOwn(this[objectType], objectName) && Object.keys(this[objectType][objectName]).length > 0);
  }

  getLoadedObject(objectType, objectName) {
    if(this.isLoadedObject(objectType, objectName)) {
      return this[objectType][objectName];
    }

    return false;
  }
}
