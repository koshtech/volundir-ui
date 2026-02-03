// import { BaseModule } from '/lib/volundir/base/base_module.js';
const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class HubModule extends BaseModule {
  resolved = false;

  constructor() {
    super();

    // Required modules
    this.requiredModules = ['hub_cache'];

    // Required models
    this.requiredModels = [];

    // Required extensions
    this.requiredExtensions = [];
  }

  async importApp(objectName, objectBasePath) {
    const objectType = 'mapps';

    let loadedObject = false;
    let loadingObject;

    const objectPath = this.getObjectPathByType(objectType, objectName, objectBasePath);

    loadedObject = await import(objectPath);

    return loadedObject;
  }

  async importObject(objectType='', objectName, objectBasePath=null) {
    if(objectType.blank()){
      objectType = this.getObjectTypeByObjectName(objectName);
    }

    let loadingClass;
    let loadedClass;

    let loadingObject;

    let loadedObject = false;

    const loadedHub  = await this.loadHubByObjectType(objectType);
    const objectPath = this.getObjectPathByType(objectType, objectName, objectBasePath);
    const objectPaths = this.getObjectBasePathsByType(objectType, objectName, objectBasePath);

    try {

      switch (objectType) {
        case 'mapps':
          const loadingMApp = await File.loadClass(objectPaths[0]);

          loadingObject = loadingMApp;
          break;
        default:
          let fileName = this.getFileNameByObjectNameOrObjectType(objectName, objectType);

          loadingClass = await File.readFromPathArray(objectPaths, fileName);
      }

      const className = this.getObjectNameByType(objectType, objectName);

      const hubImports = await loadedHub.importedModulesOnLoad();

      const classToLoad = `${hubImports}\n\n${loadingClass}`;

      const blob = new Blob([classToLoad], { type: 'application/javascript' });

      const url = URL.createObjectURL(blob);

      const importedObject = await import(url);

      loadedClass = new importedObject[className]();

      loadingObject = loadedClass;

      if(loadingObject && objectType != 'mapps') {
        const mergedObject  = this.mergeMethods(loadedHub, loadingObject);

        if(mergedObject.isReady()) {
          loadedObject = mergedObject;
        }
      }

    } catch (error) {
      Logger.error(` Error importing object ${objectName}: Error: ${error}`);
    }

    return loadedObject;
  }

  mergeMethods(loadedHub, readedClass) {
    const instanceName = readedClass.constructor.name;
    const hubName      = loadedHub.constructor.name;
    const loadedClass  = readedClass;

    Object.keys(loadedHub).forEach(key => {
      const testedProp = loadedClass[key];

      const emptyValues =
        testedProp === undefined ||
        testedProp === null ||
        testedProp === '';

      if (emptyValues) {
        loadedClass[key] = loadedHub[key];
      }
    });

    if (hubName == 'ModuleHub' && !(loadedClass instanceof BaseModule)) {
      Object.setPrototypeOf(loadedClass, BaseModule);
    }

    return loadedClass;
  }

  async loadHubByObjectType(objectType) {
    let loadingHub = null;
    let loadedHub  = null;
    let hubPath    = `lib/volundir/lib/hubs/${objectType.singularize()}_hub.js`;

    try {
      if(this.modules.hub_cache.iscached(objectType)){
        loadingHub = this.modules.hub_cache.get(objectType);
      }
      else {
        const importedHub = await File.import(hubPath);

        loadingHub  = new importedHub();

        this.modules.hub_cache.save(objectType, loadingHub);
      }

      if(loadingHub.isReady()) {
        Logger.info(` [HubModule][loadHubByObjectType] isValidated hub: ${objectType}`);

        loadedHub = loadingHub;
      }
    } catch (error) {
      console.error(' [HubModule][loadHubByObjectType] error: ', error, ' objectType: ', objectType);
    }

    return loadedHub;
  }
}
