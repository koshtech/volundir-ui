import { BaseModule } from '/lib/volundir/base/base_module.js';

export class HubModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file'];

    // Required models
    this.requiredModels = [];

    // Required extensions
    this.requiredExtensions = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'session';
  }

  async importApp(objectName, objectBasePath) {
    const objectType = 'mapps';

    let loadedObject = false;
    let loadingObject;

    const objectPath = this.getObjectPathByType(objectType, objectName, objectBasePath);

    const mApp = await import(objectPath);

    console.log(' x=> mApp: ', mApp);
    console.log(' x=> mApp.controllers: ', mApp.mApp['controllers']);
    console.log(' x=> mApp.modules: ', mApp.modules);
    console.log(' x=> mApp.models: ', mApp.models);
    console.log(' x=> mApp.handlers: ', mApp.handlers);
  }

  async importObject(objectType, objectName, objectBasePath) {
    let loadedObject = false;
    let loadingObject;
    const loadedHub  = await this.loadHubByObjectType(objectType);
    const objectPath = this.getObjectPathByType(objectType, objectName, objectBasePath);

    console.log(` ========> objectType: ${objectType}`);
    console.log(` ========> objectPath: ${objectPath}`);

    // try {

      switch (objectType) {
        case 'mapps':
          console.log(` ========> importObject: mapps: OK`);
          // const loadingMApp = await import(objectPath);

          // const loadingMApp = { "test": "baba" };
          const loadingMApp = await this.modules.file.loadClass(objectPath);

          console.log(' ========> importObject: loadingMApp: ', loadingMApp);

          loadingObject = loadingMApp;
          break;
        default:
          console.log(` ========> importObject: default`);
          loadingObject = await this.modules.file.loadClass(objectPath);
      }

      console.log(` ========> importObject: loadingObject:`, loadingObject);

      if(loadingObject && objectType != 'mapps') {
        const mergedObject  = this.mergeMethods(loadedHub, loadingObject);
        Log.info(` mergedObject: ${mergedObject}`);

        if(mergedObject.isValid()) {
          Log.info(` isValidated  object: ${objectName}`);
          loadedObject = mergedObject;
        }
      }

      // await this.registerModule(objectName, loadedObject);
    // } catch (error) {
    //   Log.error(` Error importing object ${objectName}: Error: ${error}`);
    // }

    return loadedObject;
  }

  mergeMethods(loadedHub, loadingObject) {
    for (const prop in loadingObject) {
      if (typeof loadingObject[prop] === 'function' && prop !== 'constructor') {
        loadedHub[prop] = loadingObject[prop].bind(loadingObject);
      }
    }

    return loadedHub;
  }

  getObjectPathByType(objectType, objectName, customObjectBasePath) {
    const objectBasePath = customObjectBasePath || this.getObjectBasePathByType(objectType);
    let objectPath;

    switch (objectType) {
      case 'mapps':
        objectPath = `${objectBasePath}/${objectName}/index.js`
        break;
      default:
        objectPath = `${objectBasePath}/${objectName}_${objectType.singularize()}.js`
    }

    return objectPath;
  }

  getObjectBasePathByType(objectType) {
    let objectPath;

    switch (objectType) {
      case 'modules':
        objectPath = '/lib/volundir/lib/modules';
        break;
      case 'models':
        objectPath = '/lib/volundir/lib/models';
        break;
      case 'extensions':
        objectPath = '/lib/volundir/lib/extensions';
        break;
      case 'mapps':
        objectPath = '/vendor/mapps';
        break;
      default:
        console.error(' [HubModule][getObjectPathByType] unknown objectType:', objectType);
    }

    return objectPath;
  }

  async loadHubByObjectType(objectType) {
    let loadedHub = false;
    let hubPath   = `/lib/volundir/lib/hubs/${objectType.singularize()}_hub.js`;

    Log.info(' [HubModule][loadHubByObjectType] hubPath: ', hubPath);

    try {
      const loadingHub = await this.modules.file.loadClass(hubPath);

      Log.info(' [HubModule][loadHubByObjectType] loadingHub: ', loadingHub);

      if(loadingHub.isValid()) {
        Log.info(' [HubModule][loadHubByObjectType] isValidated hub: ', objectType);

        loadedHub = loadingHub;
      }
    } catch (error) {
      console.error(' [HubModule][loadHubByObjectType] error: ', error, ' objectType: ', objectType);
    }

    return loadedHub;
  }
}
