import { BaseModule }      from '/lib/volundir/base/base_module.js';

import { FileUtilsModule } from '/lib/volundir/lib/modules/file_utils_module.js';
// globalThis.FileUtils        = new FileUtilsModule();

import { FileModule } from '/lib/volundir/lib/modules/file_module.js';
// globalThis.File       = new FileModule();

import { StorageModule } from '/lib/volundir/lib/modules/storage_module.js';
// import { GuildaModule } from '/lib/volundir/lib/modules/guilda_module.js';
import { RenderModule }       from '/lib/volundir/lib/modules/render_module.js';
import { HubModule }       from '/lib/volundir/lib/modules/hub_module.js';

export class ObjectCoordinator extends BaseModule {
  constructor() {
    super();

    this.essentialModules = [
      'file_utils',
      'file',
      'logger',
      'hub',
      'storage',
      'extensions',
      'configuration'
    ];

    this.modules = {
      "hub":        new HubModule(),
      "file_utils": new FileUtilsModule(),
      "file":       new FileModule(),
      "storage":    new StorageModule(),
      "render":     new RenderModule()
    };
    // this.models =  {};
    // this.extensions = {};

    // if(globalThis.Guilda) {


    if (globalThis.GuildaPanel && typeof globalThis.GuildaPanel.addLog === "function") {
      console.log(' [Coordinator] Guilda: ', Guilda);
      this.modules["guilda"] = Guilda;
    }

    this.init(); // populate loaded modules dependencies
  }

  init() {
    // this.modules['file'] = (async () => await this.updateDependencies(this.modules['file']));
    // this.modules['hub']  = (async () => await this.updateDependencies(this.modules['hub']));

    this.modules['file']['modules']['File_utils'] = this.modules['File_utils'];
    this.modules['hub']['modules']['file']       = this.modules['file'];

    if (this.modules["guilda"] && this.modules['render']) {
      this.modules["guilda"]['modules']['render'] = this.modules['render'];
      console.log(' [Coordinator] Guilda: ', Guilda);
    }
  }

  async loadEssentialModules() {
    await this.loadModules(this.essentialModules);
  }

  async loadModules(modules) {
    for (const moduleName of modules) {
      // console.log(' [Coordinator][loadModules] moduleName: ', moduleName);

      if(! this.modules[moduleName] ) {
        // console.log(' [Coordinator][loadModules] must load: ', moduleName);

        await this.loadObject('modules', moduleName);
      }
      else {
        // console.log(' [Coordinator][loadModules] alread loaded: ', moduleName);

      }
    }

    // console.log(' [Coordinator][loadModules] this: ', this);
  }

  async loadObject(objectType, objectName, objectPath=null) {
    let loadingObject = false;

    try {

      if(this.isLoadedObject(objectType, objectName)) {
        loadingObject = this.getLoadedObject(objectType, objectName)
      }
      else {
        // console.log(' [Coordinator][loadModules] this.modules: ', this.modules);
        loadingObject = await this.modules.hub.importObject(objectType, objectName, objectPath);
      }

      // this[objectType][objectName] = loadingObject;
      this[objectType][objectName] = await this.updateDependencies(loadingObject);

    } catch (error) {
      console.error(' [Coordinator][loadModule] Error loading object: ', objectName, ' error: ', error);
    }

    return this[objectType][objectName];
  }


  async loadMiniApp(mAppName, mAppPath=null) {
    let loadingMApp;
    const objectType = 'mapps';

    // try {
      // if(this.isLoadedObject(objectType, mAppName)) {
      //   loadingMApp = this.getLoadedObject(objectType, mAppName)
      // }
      // else {
        console.log(' [Coordinator][loadMiniApp] mAppName: ', mAppName);
        loadingMApp = await this.modules.hub.importApp(mAppName, mAppPath);
        console.log(' [Coordinator][loadMiniApp] loadingMApp: ', loadingMApp);
      // }

      this[objectType][mAppName] = loadingMApp;
      // this[objectType][mAppName] = await this.updateDependencies(loadingMApp);

    // } catch (error) {
      // console.error(' [Coordinator][loadModule] Error loading mApp: ', mAppName, ' error: ', error);
    // }

    return this[objectType][mAppName];
  }


  async updateDependencies(updatingObject) {
    const dependencyTypes = ['modules', 'models', 'extensions'];

    for(const dependencyType of dependencyTypes) {

      // console.log(' [Coordinator][updateDependencies] dependency: ', `required${dependencyType.capitalize()}`);
      if(updatingObject[`required${dependencyType.capitalize()}`]) {

        for (const objectName of updatingObject[`required${dependencyType.capitalize()}`]) {
          // console.log(' [Coordinator][updateDependencies] objectName: ', objectName);

          updatingObject[dependencyType][objectName] = await this.loadObject(objectName);

          // console.log(' [Coordinator][updateDependencies] loadedModule: ', loadedModule);
        }
      }
    }

    return updatingObject;
  }

  isLoadedObject(objectType, objectName) {
    return (this[objectType][objectName] && Object.keys(this[objectType][objectName]).length > 0);
  }

  getLoadedObject(objectType, objectName) {
    // console.log(' [coordinator][getLoadedObject] objectName: ', objectName);
    // console.log(' [coordinator][getLoadedObject] this.loadedObjects: ', this.loadedObjects);

    if(this.isLoadedObject(objectType, objectName)) {
      return this[objectType][objectName]
    }
    // console.log(' [coordinator][getLoadedObject] loadedObject: ', loadedObject);

    return false;
  }
}

// export const Coordinator = new ObjectCoordinator();
