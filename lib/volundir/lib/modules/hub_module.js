const BaseModule     = await File.import('lib/volundir/base/base_module.js');
const HubCacheModule = await File.import('lib/volundir/lib/modules/hub_cache_module.js');

export class HubModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['hub_cache'];

    // Required models
    this.requiredModels = [];

    // Required extensions
    this.requiredExtensions = [];

    this.modules['hub_cache'] = new HubCacheModule();

    this.resolved = true;
    this.ready    = true;
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
    console.log('[HubModule][importObject] objectType I: ', objectType);
    console.log('[HubModule][importObject] objectName: ', objectName);
    console.log('[HubModule][importObject] objectBasePath: ', objectBasePath);

    if(objectType.blank()){
      console.log('[HubModule][importObject] blank: ', objectType.blank());
      objectType = this.getObjectTypeByObjectName(objectName);
    }

    console.log('[HubModule][importObject] objectType F: ', objectType);

    let loadingClass  = null;
    let loadedClass   = null;
    let loadingObject = null;
    let loadedObject  = null;

    const loadedHub   = await this.loadHubByObjectType(objectType);
    const objectPath  = this.getObjectPathByType(objectType, objectName, objectBasePath);
    const objectPaths = this.getObjectBasePathsByType(objectType, objectName, objectBasePath);

    console.log('[HubModule][importObject] loadedHub: ',loadedHub );
    console.log('[HubModule][importObject] objectPath: ', objectPath);
    console.log('[HubModule][importObject] objectPaths: ', objectPaths);

    // try {
      switch (objectType) {
        case 'mapps':
          const loadingMApp = await File.loadClass(objectPaths[0]);

          loadingObject = loadingMApp;
          break;
        default:
          let fileName = this.getFileNameByObjectNameOrObjectType(objectName, objectType);
          // console.log('[HubModule][importObject] fileName: ', fileName);

          loadingClass = await File.readFromPathArray(objectPaths, fileName);
          console.log('[HubModule][importObject] loadingClass: ', loadingClass);
      }

      const className = this.getObjectNameByType(objectType, objectName);
      // console.log('[HubModule][importObject] className: ', className);

      const hubImports = await loadedHub.importedModulesOnLoad();
      // console.log('[HubModule][importObject] hubImports: ', hubImports);

      const classToLoad = `${hubImports}\n\n${loadingClass}`;
      console.log('[HubModule][importObject] classToLoad: ', classToLoad);

      const blob = new Blob([classToLoad], { type: 'application/javascript' });
      // console.log('[HubModule][importObject] blob: ', blob);

      const url = URL.createObjectURL(blob);
      // console.log('[HubModule][importObject] url: ', url);

      const importedObject = await import(url);
      console.log('[HubModule][importObject] importedObject: ', importedObject);

      loadedClass = new importedObject[className]();
      console.log('[HubModule][importObject] loadedClass: ', loadedClass);
      console.log('[HubModule][importObject] className: ', className);
      console.log('[HubModule][importObject] loadedClass.className: ', loadedClass.className);


      if(loadedClass && objectType != 'mapps') {
        const mergedObject  = this.mergeMethods(loadedHub, loadedClass);
        console.log('[HubModule][importObject] mergedObject: ', mergedObject);

        if(mergedObject.isLoaded) {
          mergedObject.ready = true

          console.log('[HubModule][importObject] if isLoaded ', mergedObject.isReady);
        }
        else{
          console.log('[HubModule][importObject] else isLoaded: ', mergedObject);
          stop('Testing functions.');
        }


        if(mergedObject.isReady) {
           console.log('[HubModule][importObject] if isReady: ', mergedObject.isReady);
          loadedObject = mergedObject;
        }
        else{
          console.log('[HubModule][importObject] else isReady: ', mergedObject);
          stop('Testing functions.');
        }
      }

    // } catch (error) {
    //   Logger.error(` Error importing object ${objectName}: Error: ${error}`);
    // }

    return loadedObject;
  }

  mergeMethods(loadedHub, readedClass) {
    const instanceName = readedClass.constructor.name;
    const hubName      = loadedHub.constructor.name;
    const loadedClass  = readedClass;

    // console.log('[HubModule][mergeMethods] I readedClass: ', readedClass);
    // console.log('[HubModule][mergeMethods] I loadedHub: ', loadedHub);
    // console.log('[HubModule][mergeMethods] Object.keys(loadedHub): ', Object.keys(loadedHub));

    Object.keys(loadedHub).forEach(key => {
      const testedProp = loadedClass[key];

      console.log('[HubModule][mergeMethods] loadedHub key: ', key, ' => testedProp: ', testedProp);

      const emptyValues =
        testedProp === undefined ||
        testedProp === null ||
        testedProp === '';

      // console.log('[HubModule][mergeMethods] emptyValues: ', emptyValues);

      if (emptyValues) {
        // console.log('[HubModule][mergeMethods] if (emptyValues): OK');
        loadedClass[key] = loadedHub[key];
      }
      else{
        console.log('[HubModule][mergeMethods] else (emptyValues) loadedClass[key]: ', loadedClass[key])
        console.log('[HubModule][mergeMethods] else (emptyValues) loadedHub[key]: ', loadedHub[key]);
        // stop('Testing functions.');
      }
    });

    // if (hubName == 'ModuleHub' && !(loadedClass instanceof BaseModule)) {
    //   Object.setPrototypeOf(loadedClass, BaseModule);
    // }
    console.log('[HubModule][mergeMethods] returned loadedClass: ', loadedClass);

    return loadedClass;
  }

  async loadHubByObjectType(objectType) {
    // console.log('[HubModule][loadHubByObjectType] objectType: ', objectType);

    let loadingHub = null;
    let loadedHub  = null;
    let hubPath    = `lib/volundir/lib/hubs/${objectType.singularize()}_hub.js`;

    // console.log('[HubModule][loadHubByObjectType] this: ', this);

    // try {
      if(this.modules.hub_cache.isCached(objectType)){
        // console.log('[HubModule][loadHubByObjectType] isCached');
        loadingHub = this.modules.hub_cache.get(objectType);
      }
      else {
        // console.log('[HubModule][loadHubByObjectType] isNotCached');

        const importedHub = await File.import(hubPath);
        // console.log('[HubModule][loadHubByObjectType] importedHub: ', importedHub);

        loadingHub  = new importedHub();
        // console.log('[HubModule][loadHubByObjectType] loadingHub: ', loadingHub);

        this.modules.hub_cache.save(objectType, loadingHub);
      }

      if(loadingHub.isReady) {
        Logger.info(` [HubModule][loadHubByObjectType] isReady hub: ${objectType}`);
        // console.log('[HubModule][loadHubByObjectType] isReady: ', objectType);

        loadedHub = loadingHub;
      }
      else{
        // console.log('[HubModule][loadHubByObjectType] isNotReady: ', objectType);
        // console.log('[HubModule][loadHubByObjectType] loadingHub NR: ', loadingHub);
      }
    // } catch (error) {
    //   console.error(' [HubModule][loadHubByObjectType] error: ', error, ' objectType: ', objectType);
    // }

    // console.log('[HubModule][loadHubByObjectType] loadedHub R: ', loadedHub);

    return loadedHub;
  }
}
