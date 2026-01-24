import { BaseModule }      from '/lib/volundir/base/base_module.js';
import { FileUtilsModule } from '/lib/volundir/lib/modules/file_utils_module.js';
import { FileModule }      from '/lib/volundir/lib/modules/file_module.js';
// import { StorageModule } from '/lib/volundir/lib/modules/storage_module.js';
import { RenderModule }       from '/lib/volundir/lib/modules/render_module.js';
import { HubModule }       from '/lib/volundir/lib/modules/hub_module.js';

export class ObjectCoordinator extends BaseModule {
  constructor(volundirApplication=null) {
    super();

    this.objectTypes            = ['extensions', 'handlers', 'models', 'controllers', 'modules'];

    this.processableObjectTypes = ['models', 'modules'];

    this.essentialModules = [
      'file_utils',
      'file',
      'logger',
      'hub',
      'storage',
      'extensions',
      'configuration',
      'display',
      'render'
    ];

    this.modules = {
      "hub":        new HubModule(),
      "file_utils": new FileUtilsModule(),
      "file":       new FileModule(),
      // "storage":    new StorageModule(),
      "storage":    Logger.modules.storage,
      "render":     new RenderModule(),
      "logger":     Logger
    };

    this.models = {
      "logger_model": Logger.models.logger_model
    }

    this.app   = null
    this.mapps = {};

    if(volundirApplication){
      this.app = volundirApplication;
    }

    this.init(); // populate loaded modules dependencies
  }

  init() {
    this.modules['file_utils'].resolved = true;

    this.modules['file']['modules']['file_utils'] = this.modules['file_utils'];
    this.modules['file'].resolved = true;

    this.modules['hub']['modules']['file']        = this.modules['file'];
    this.modules['hub'].resolved = true;

    // this.reconfigure('modules', this.modules);

    this.resolved = true;
  }

  connect(volundirApplication) {
    this.app = volundirApplication;
  }

  isConnected() {
    return true;
  }

  system(methodName) {
    let returnedVvalue = null;

    if (this.app && typeof this.app[methodName] === "function") {
      returnedVvalue = this.app[methodName]();
    }

    return returnedVvalue;
  }

  async loadEssentialModules() {
    await this.loadModules(this.essentialModules, false);
  }

  async loadedModules() {
    return this.modules;
  }

  async loadModules(modules, debug=false) {
    for (const moduleName of modules) {
      this.modules[moduleName] = await this.loadObject('modules', moduleName, null, debug);
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
        loadingMApp = await this.modules.hub.importApp(mAppName, mAppPath);

        if(loadingMApp) {

          // if (typeof loadingMApp.addLog === "function") {
          //   console.log(' [Coordinator] Guilda: ', loadingMApp);
            this.mapps[mAppName] = {};
          // }

          for(const objectType of this.objectTypes) {
            // console.log(' [Coordinator][importObjects] => objectType:', objectType);

           if(this.processableObjectTypes.includes(objectType) && Object.keys(loadingMApp[mAppName][objectType]).length > 0){
              for(const loadingObject of loadingMApp[mAppName][objectType]) {
                // console.log(' [Coordinator][importObjects] => loadingObject', loadingObject);

                const instanceName = loadingObject.constructor.name;
                const objectName   = instanceName.pascalCaseToSnakeCase();

                this[objectType][objectName] = loadingObject;
              }
            }
          }

          for(const objectType of this.objectTypes) {
            this.mapps[mAppName][objectType] = {};

            if(Object.keys(loadingMApp[mAppName][objectType]).length > 0){
              for(const loadingObject of loadingMApp[mAppName][objectType]) {
                const instanceName = loadingObject.constructor.name;
                const objectName   = instanceName.pascalCaseToSnakeCase();

                this[objectType][objectName] = await this.updateDependencies(loadingObject, debug);

                this['mapps'][mAppName][objectType][objectName] = this[objectType][objectName];
              }
            }
          }

        }

        if(this['mapps'][mAppName]['modules']) {
          for(const startingModule in this['mapps'][mAppName]['modules']) {
            await this['mapps'][mAppName]['modules'][startingModule].init();
          }
        }

        if(this['mapps'][mAppName]['controllers']) {
          for(const startingModule in this['mapps'][mAppName]['controllers']) {
            await this['mapps'][mAppName]['controllers'][startingModule].index();
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
    if(debug){
      console.log(' [Coordinator][updateDependencies] updatingObject: ', updatingObject);
      console.log(' [Coordinator][updateDependencies] updatingObject resolved: ', updatingObject.resolved);
    }

    if(! updatingObject.resolved) {
      for(const dependencyType of this.processableObjectTypes) {
        if(debug){
          console.log(' [Coordinator][updateDependencies] dependencyType: ', dependencyType);
        }

        if(Object.keys(updatingObject[`required${dependencyType.capitalize()}`]).length > 0) {
          if(debug){
            console.log(' [Coordinator][updateDependencies] dependency type: ', `required${dependencyType.capitalize()}`);
          }

          for (const objectName of updatingObject[`required${dependencyType.capitalize()}`]) {
            if(debug) {
              console.log(' [Coordinator][updateDependencies] objectName: ', objectName);
            }

            updatingObject[dependencyType][objectName] = await this.loadObject(dependencyType, objectName, null, debug);

            if(debug){
              console.log(' [Coordinator][updateDependencies] updatingObject: ', updatingObject);
            }
          }
        }
        else {
          if(debug){
            console.log(' [Coordinator][updateDependencies] no dependencies.');
          }
        }
      }
    }

    updatingObject.resolved = true;

    if(debug){
      console.log(' [Coordinator][updateDependencies] updatingObject resolved: ', updatingObject.resolved);
    }

    return updatingObject;
  }

  async loadObject(objectType, objectName, objectPath=null, debug=false) {
    let loadedObject  = false;

    // try {

      if(debug) {
        console.log(' [Coordinator][loadObject] objectName: ', objectName);
        console.log(' [Coordinator][loadObject] objectType: ', objectType);
      }

      if(this.isLoadedObject(objectType, objectName)) {
        if(debug) {
          console.log(' [Coordinator][loadObject] isLoadedObject: ', objectName);
        }

        loadedObject = this.getLoadedObject(objectType, objectName);

        if(debug) {
          console.log(' [Coordinator][loadObject] loadedObject getLoadedObject: ', loadedObject);
        }

      }
      else {
        if(debug) {
          console.log(' [Coordinator][loadObject] isNotLoadedObject: ', objectName);
          console.log(' [Coordinator][loadModules] this.modules: ', this.modules);
        }

        loadedObject = await this.modules.hub.importObject(objectType, objectName, objectPath);

        if(debug) {
          console.log(' [Coordinator][loadObject] loadedObject from modules.hub: ', loadedObject);
        }
      }

      if(! loadedObject.resolved) {
        if(debug){
          console.log(' [Coordinator][loadObject] not resolved: ', objectName);
        }

        loadedObject = await this.updateDependencies(loadedObject, debug);
      }
      else{
        if(debug){
          console.log(' [Coordinator][loadObject] is resolved: ', objectName);
        }
      }

      if(debug) {
        console.log(' [Coordinator][loadObject] loadedObject: ', loadedObject);
      }


    // } catch (error) {
    //   console.error(' [Coordinator][loadModule] Error loading object: ', objectName, ' error: ', error);
    // }

    if(debug) {
      console.log(' [Coordinator][loadModules] modules at end: ', this.modules);
      console.log(' [Coordinator][loadModules] return: ', loadedObject);
    }

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
