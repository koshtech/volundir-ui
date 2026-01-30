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
  }

  async importApp(objectName, objectBasePath) {
    const objectType = 'mapps';

    let loadedObject = false;
    let loadingObject;

    const objectPath = this.getObjectPathByType(objectType, objectName, objectBasePath);

    loadedObject = await import(objectPath);

    // console.log(' >>>>> importApp: ', loadedObject);

    return loadedObject;
  }

  async importObject(objectType, objectName, objectBasePath) {
    let loadingClass;
    let loadedClass;

    let loadingObject;

    let loadedObject = false;

    const loadedHub  = await this.loadHubByObjectType(objectType);
    const objectPath = this.getObjectPathByType(objectType, objectName, objectBasePath);
    const objectPaths = this.getObjectBasePathsByType(objectType, objectName, objectBasePath);

    // try {

      switch (objectType) {
        case 'mapps':
          const loadingMApp = await this.modules.file.loadClass(objectPaths[0]);

          loadingObject = loadingMApp;
          break;
        default:
          let fileName = this.getFileNameByType(objectType, objectName);

          loadingClass = await this.modules.file.openFromPathArray(objectPaths, fileName);
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

    // } catch (error) {
    //   Logger.error(` Error importing object ${objectName}: Error: ${error}`);
    // }

    return loadedObject;
  }

  // mergeMethods(loadedHub, loadingObject) {
  //   for (const prop in loadedHub) {
  //     if (typeof loadedHub[prop] === 'function' && prop !== 'constructor') {
  //       loadingObject[prop] = loadedHub[prop].bind(loadedHub);
  //     }
  //   }

  //   return loadingObject;
  // }

  mergeMethods(loadedHub, readedClass) {
    // console.log(' [HubModule][mergeMethods] loadedHub: ', loadedHub);
    // console.log(' [HubModule][mergeMethods] readedClass: ', readedClass);

    // let mergedObject = {};
    // let mergedObject = readedClass;

    const instanceName = readedClass.constructor.name;
    const hubName      = loadedHub.constructor.name;

    // console.log(' [HubModule][mergeMethods] instanceName: ', instanceName);

    // const loadedClass = new readedClass[instanceName]();
    const loadedClass = readedClass;
    // console.log(' [HubModule][mergeMethods] loadedClass: ', loadedClass);

    // for (const prop in loadedHub) {
    //   // if (typeof loadingObject[prop] === 'function' && prop !== 'constructor') {
    //   console.log(' [HubModule][mergeMethods] prop: ', prop, ' = ', loadingObject[prop]);

    //   if (typeof loadedHub[prop] === 'function') {
    //     loadingObject[prop] = loadingObject[prop].bind(loadedHub);
    //   }
    // }

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

    // mergedObject = Object.assign(loadedClass, loadedHub);
    // mergedObject = loadedClass;
    // console.log(' [HubModule][mergeMethods] merged merged loadedClass: ', loadedClass);

    if (hubName == 'ModuleHub' && !(loadedClass instanceof BaseModule)) {
      // console.log(' [HubModule][mergeMethods] !(loadedClass instanceof BaseModule)');

      Object.setPrototypeOf(loadedClass, BaseModule);
    }

    // console.log(' [HubModule][mergeMethods] final loadedClass: ', loadedClass);

    return loadedClass;
  }

  getObjectNameByType(objectType, objectName) {
    const singular = objectType.singularize();

    // Sanitize to prevent duplicated "_ + objectType" in final object path
    const sanitizedName = objectName.endsWith(`_${singular}`)
      ? objectName.slice(0, -(singular.length + 1))
      : objectName;

    let finalObjectName = `${sanitizedName}_${singular}`.toPascalCase();

    return finalObjectName;
  }

  getFileNameByType(objectType, objectName) {
    const singular = objectType.singularize();

    // Sanitize to prevent duplicated "_ + objectType" in final object path
    const sanitizedName = objectName.endsWith(`_${singular}`)
      ? objectName.slice(0, -(singular.length + 1))
      : objectName;

    let finalObjectName = `${sanitizedName}_${singular}.js`;

    return finalObjectName;
  }

  getObjectPathByType(objectType, objectName, customObjectBasePath) {
    const objectBasePath = customObjectBasePath || this.getObjectBasePathByType(objectType);
    const singular = objectType.singularize();

    // Sanitize to prevent duplicated "_ + objectType" in final object path
    const sanitizedName = objectName.endsWith(`_${singular}`)
      ? objectName.slice(0, -(singular.length + 1))
      : objectName;

    let objectPath;

    switch (objectType) {
      case 'mapps':
        objectPath = `${objectBasePath}/${sanitizedName}/index.js`;
        break;
      default:
        objectPath = `${objectBasePath}/${sanitizedName}_${singular}.js`;
    }

    return objectPath;
  }

  getObjectBasePathByType(objectType) {
    let objectPath;

    switch (objectType) {
      case 'extensions':
        objectPath = '/lib/volundir/lib/extensions';
        break;
      case 'handlers':
        objectPath = '/lib/volundir/lib/adapters/output/handlers';
        break;
      case 'models':
        objectPath = '/lib/volundir/app/models';
        break;
      case 'controllers':
        objectPath = '/lib/volundir/app/controllers';
        break;
      case 'modules':
        objectPath = '/lib/volundir/lib/modules';
        break;
      case 'mapps':
        objectPath = '/vendor/mapps';
        break;
      default:
        console.error(' [HubModule][getObjectPathByType] unknown objectType:', objectType);
    }

    return objectPath;
  }

  getObjectBasePathsByType(objectType) {
    let objectPath;

    switch (objectType) {
      case 'extensions':
        objectPath = ['/lib/volundir/lib/extensions'];
        break;
      case 'handlers':
        objectPath = ['/lib/volundir/lib/adapters/output/handlers'];
        break;
      case 'models':
        objectPath = ['/lib/volundir/app/models', '/app/models'];
        break;
      case 'controllers':
        objectPath = ['/app/controllers', '/lib/volundir/app/controllers'];
        break;
      case 'modules':
        objectPath = ['/lib/volundir/lib/modules', '/app/modules'];
        break;
      case 'mapps':
        objectPath = ['/vendor/mapps'];
        break;
      default:
        console.error(' [HubModule][getObjectPathByType] unknown objectType:', objectType);
    }

    return objectPath;
  }

  async loadHubByObjectType(objectType) {
    let loadedHub = false;
    let hubPath   = `/lib/volundir/lib/hubs/${objectType.singularize()}_hub.js`;

    // Logger.info(' [HubModule][loadHubByObjectType] hubPath: ', hubPath);

    try {
      const loadingHub = await this.modules.file.loadClass(hubPath);

      // Logger.info(' [HubModule][loadHubByObjectType] loadingHub: ', loadingHub);

      if(loadingHub.isReady()) {
        // Logger.info(' [HubModule][loadHubByObjectType] isValidated hub: ', objectType);

        loadedHub = loadingHub;
      }
    } catch (error) {
      console.error(' [HubModule][loadHubByObjectType] error: ', error, ' objectType: ', objectType);
    }

    return loadedHub;
  }
}
