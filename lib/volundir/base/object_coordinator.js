const BaseCache = await File.import('lib/volundir/base/base_cache.js');

const FileModule          = await File.import('lib/volundir/lib/modules/file_module.js');
const StorageModule       = await File.import('lib/volundir/lib/modules/storage_module.js');
const ConfigurationModule = await File.import('lib/volundir/lib/modules/configuration_module.js');
const LoggerModule        = await File.import('lib/volundir/lib/modules/logger_module.js');
const HubModule           = await File.import('lib/volundir/lib/modules/hub_module.js');
const HubCacheModule      = await File.import('lib/volundir/lib/modules/hub_cache_module.js');
const RenderModule        = await File.import('lib/volundir/lib/modules/render_module.js');
const DisplayModule       = await File.import('lib/volundir/lib/modules/display_module.js');
const InterceptorModule   = await File.import('lib/volundir/lib/modules/interceptor_module.js');

export class ObjectCoordinator extends BaseCache {
  #essentialModules = [
    // 'file',
    // 'logger',
    // 'hub',
    // 'hub_cache',
    // 'storage',
    // 'extension',
    // 'configuration',
    // 'display',
    // 'render',
    // 'router',
    // 'interceptor'
  ];

  #processableObjectTypes = ['model', 'module', 'controller'];

  #app   = null;

  constructor(volundirApplication=null) {
    super();

    // if(volundirApplication){
    //   this.app = volundirApplication;
    // }
  }

  // populate loaded modules dependencies
  init() {
    this.models = {
      "logger_model": Logger.models.logger_model
    }

    this.modules = {
      "hub":       new HubModule(),
      "hub_cache": new HubCacheModule(),
      "file":      File,
      "storage":   Logger.modules.storage,
      "configuration":    new ConfigurationModule(),
      "render":    new RenderModule(),
      "display":   new DisplayModule(),
      "interceptor": new InterceptorModule(),
      "logger":    Logger
    };

    // this.reconfigure('modules', this.modules);

    this.resolved = true;
    this.ready    = true;

    this.importObjectsToCache(this.modules);

    // console.log('[Coordinator][init] this: ', this);

    // stop('wait');
  }

  get essentialModules() {
    return this.#essentialModules;
  }

  // async reconfigure(objectType, objects, debug=false) {
  //   // console.log(' [Coordinator][reconfigure] objectType: ', objectType);
  //   // console.log(' [Coordinator][reconfigure] objects: ', objects);

  //   // for (const reconfiguringObject in objects) {
  //   // Object.values(objects).forEach(reconfiguringObject => {
  //   Object.keys(objects).forEach(objectName => {
  //     const reconfiguringObject = objects[objectName];

  //     // console.log(' [Coordinator][reconfigure] objectName: ', objectName);

  //     if(! reconfiguringObject.resolved) {
  //       // console.log(' [Coordinator][reconfigure] reconfiguringObject: ', reconfiguringObject);
  //       this[objectType][objectName] = this.updateDependencies(reconfiguringObject, debug);
  //     }
  //   });
  // }

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
    // console.log(' [Coordinator][]loadEssentialModules : ', this.essentialModules);
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
    // console.log(' [Coordinator][loadModules] modules: ',modules );
    for (const moduleName of modules) {
      // this.modules[moduleName] = await this.loadObject('module', moduleName, null, debug);
      // console.log(' [Coordinator][for] moduleName: ', moduleName);

      const loadedObject = await this.loadObject(`${moduleName}_module`);
      // console.log(' [Coordinator][for] loadedObject: ', loadedObject);

      // await loadedObject; //this.loadObject(`${moduleName}_module`);
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
           if(this.#processableObjectTypes.includes(objectType) && Object.keys(loadingMApp[mAppName][objectType]).length > 0){
              for(const loadingObject of loadingMApp[mAppName][objectType]) {
                const instanceName = loadingObject.constructor.name;
                const objectName   = instanceName.fromPascalCaseToSnakeCase();

                this[objectType][objectName] = loadingObject;
              }
            }
          }

          for(const objectType of this.objectTypes) {
            if(this.#processableObjectTypes.includes(objectType) && Object.keys(loadingMApp[mAppName][objectType]).length > 0){
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

  async updateDependencies(updatingObject, debug=false) {
    // console.log('[Coordinator][updateDependencies] updatingObject A: ', updatingObject);

    if(! updatingObject.isResolved) {
      for(const dependencyType of this.#processableObjectTypes) {
        // console.log('[Coordinator][updateDependencies] dependencyType: ', dependencyType);

        if(updatingObject[`required${dependencyType.capitalize()}`] && Object.keys(updatingObject[`required${dependencyType.capitalize()}`]).length > 0) {

          // console.log('[Coordinator][updateDependencies] have dependencyType: ', dependencyType);

          for (const objectName of updatingObject[`required${dependencyType.capitalize()}`]) {
            // console.log('[Coordinator][updateDependencies] dependency objectName: ', objectName);

            updatingObject[dependencyType][objectName] = await this.loadObject(dependencyType, objectName, null, debug);

            // console.log('[Coordinator][updateDependencies] updatingObject[dependencyType][objectName]: ', updatingObject[dependencyType][objectName]);
          }
        }
        else {
          // console.log('[Coordinator][updateDependencies] not have dependencyType: ', dependencyType);
        }
      }
    }

    // console.log('[Coordinator][updateDependencies] updatingObject B: ', updatingObject);
    updatingObject.resolved = true;

    return updatingObject;
  }

  async loadObject(objectName, objectPath=null, debug=false) {
    let loadingObject = null;
    let loadedObject  = null;


    // try {
      const objectType = this.getObjectTypeByObjectName(objectName);
      // const key = this.cacheKeyFromObjectName(objectName);
      // console.log('[Coordinator][loadObject] key: ', key);

      if(objectType == 'controller') {
        console.log('[Coordinator][loadObject] objectName: ', objectName);
        console.log('[Coordinator][loadObject] objectPath: ', objectPath);
        console.log('[Coordinator][loadObject] objectType: ', objectType);
      }

      if(this.isCachedObject(objectName)) {
        loadingObject = this.cachedObject(objectName);

        if(objectType == 'controller') {
          console.log('[Coordinator][loadObject] isCached: true');
          console.log('[Coordinator][loadObject] Cached: ', loadingObject);
        }
      }
      else {
        }
        loadingObject = await this.modules.hub.importObject(objectType, objectName, objectPath);

        if(objectType == 'controller') {
          console.log('[Coordinator][loadObject] isCached: false');
          console.log('[Coordinator][loadObject] Loaded: ', loadingObject);
      }

      // console.log('[Coordinator][loadObject] loadingObject: ', loadingObject);

      if(! loadingObject.isResolved) {
        if(objectType == 'controller') {
          console.log('[Coordinator][loadObject] isNotResolved', loadingObject);
        }

        loadingObject = await this.updateDependencies(loadingObject, debug);
      }

      // console.log('[Coordinator][loadObject] loadingObject after resolve: ', loadingObject);

      if(loadingObject.isReady) {
        loadedObject = loadingObject;

        this.saveObject(loadedObject);
      }else{
        console.log('[Coordinator][loadObject] isNotReady: ', loadingObject);
        stop('Testing functions.');
      }


    // } catch (error) {
    //   console.error(' [Coordinator][loadModule] Error loading object: ', objectName, ' error: ', error);
    // }

    // console.log('[Coordinator][loadObject] final loadedObject: ', loadedObject);

    return loadedObject;
  }

  createVariable(variableName, defaultValue=null, writable = true, enumerable = true, configurable = true) {
    Object.defineProperty(this, 'value', {
      writable: writable,
      enumerable: enumerable,
      configurable: configurable,
      value: defaultValue,
    });
  }

  // createMethod(Person, 'bla', function(){ console.log('new method bla!') } )

  createMethod(object, methodName, sourceCode, writable = true, enumerable = true, configurable = true) {
    Object.defineProperty(object.prototype, methodName, {
        writable: writable,
        enumerable: enumerable,
        configurable: configurable,
        value: function(params) {
          return sourceCode;
        }
    });
  }

  // Replace by Cache
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
