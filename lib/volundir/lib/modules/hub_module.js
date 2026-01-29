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

    // console.log(` ========> objectName: ${objectName}`);
    // console.log(` ========> objectType: ${objectType}`);
    // console.log(` ========> objectPath: ${objectPath}`);

    // try {

      switch (objectType) {
        case 'mapps':
          // console.log(` ========> importObject: mapps: OK`);
          // const loadingMApp = await import(objectPath);

          // const loadingMApp = { "test": "baba" };
          const loadingMApp = await this.modules.file.loadClass(objectPaths[0]);

          // console.log(' ========> importObject: loadingMApp: ', loadingMApp);

          loadingObject = loadingMApp;
          break;
        default:
          // console.log(` ========> objectPath: `, objectPath);
          // loadingClass = await this.modules.file.read(objectPath);

          let nameTest = this.getFileNameByType(objectType, objectName);
          // console.log(` ========> importObject: nameTest`, nameTest);

          // loadingClass = await this.modules.file.read(objectPath);
          loadingClass = await this.modules.file.openFromPathArray(objectPaths, nameTest);
          console.log(`[HubModule][importObject]: loadingClass:`, loadingClass);
      }

      const className0 = `${objectName.capitalize()}${objectType.singularize().capitalize()}`;
      // console.log(' ========> importObject: className: ', className0);

      // const className1 = this.getObjectName(loadingClass);
      // console.log(' ========> importObject: className: ', className1);

      // const className2 = this.getObjectInstanceName(loadingClass);
      // console.log(' ========> importObject: className: ', className2);

      // const className3 = loadingClass.name;
      // console.log(' ========> importObject: className: ', className3);

      const className = this.getObjectNameByType(objectType, objectName);
      // console.log(' ========> importObject: className: ', className);


      // const classMap = {};
      // classMap[className] = loadingClass
      // console.log(` ========> importObject: classMap:`, classMap);

      // const ClassConstructor = classMap[className];
      // console.log(` ========> importObject: ClassConstructor:`, ClassConstructor);

      // loadingObject = new window[className]();

      const hubImports = await loadedHub.importedModulesOnLoad();
      // console.log(' ========> importObject: hubImports: ', hubImports);

      const classToLoad = `${hubImports}\n\n${loadingClass}`;
      // console.log(' ========> importObject: classToLoad: ', classToLoad);

      const blob = new Blob([classToLoad], { type: 'application/javascript' });
      // console.log(' ========> importObject: blob: ', blob);

      const url = URL.createObjectURL(blob);
      // console.log(` ========> importObject: url: `, url);

      // const readedClass = await this.readClass(filePath);
      // console.log(' [FileModule][loadClass] readedClass: ', readedClass);

      // const instanceName = this.getObjectInstanceName(readedClass);
      // console.log(' [FileModule][loadClass] instanceName: ', instanceName);

      // const loadedClass = new readedClass[instanceName];

      const importedObject = await import(url);
      // console.log(` ========> importObject: importedObject:`, importedObject);

      loadedClass = new importedObject[className]();
      // console.log(` ========> importObject: loadedClass:`, loadedClass);

          // const moduloInstancia = new ClasseDoModulo();

      // if (ClassConstructor) {
      // loadingObject = new loadedClass({});
      loadingObject = loadedClass;
          // console.log(` ========> importObject if ClassConstructor: loadingObject:`, loadingObject);
      // }

      // console.log(` ========> importObject: loadingObject:`, loadingObject);

      if(loadingObject && objectType != 'mapps') {
        const mergedObject  = this.mergeMethods(loadedHub, loadingObject);

        // console.log(` ========> importObject mergedObject: `, mergedObject);
        // Logger.info(` mergedObject: ${mergedObject}`);

        if(mergedObject.isReady()) {
          // Logger.info(` isValidated  object: ${objectName}`);
          // console.log(` isValidated  object: ${objectName}`);

          loadedObject = mergedObject;
        }
      }

      // await this.registerModule(objectName, loadedObject);
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
        objectPath = ['/app/models', '/lib/volundir/app/models'];
        break;
      case 'controllers':
        objectPath = ['/app/controllers', '/lib/volundir/app/controllers'];
        break;
      case 'modules':
        objectPath = ['/app/modules', '/lib/volundir/lib/modules'];
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
