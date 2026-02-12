export class Base {
  #className = this.constructor.name;
  #bareName  = this.#className.fromPascalCaseToSnakeCase();                   //bare names
  #specifier = this.#bareName.specifier()               //module specifier
  #rootName  = this.#bareName.withoutSpecifier();

  // Current host address like 'http://localhost:3020/'
  #baseUrl = window.location.origin + '/';

  // Complete import file address like 'http://127.0.0.1:3020/lib/volundir/base/base.js'
  #metaUrl = import.meta.url;

  #filePath    = this.#metaUrl;
  #filePathUrl = this.#baseUrl;

  #objectType  = 'base';
  #objectTypes = [
    'adapter',
    'base',
    'controller',
    'device',
    'engine',
    'extension',
    'handler',
    'hub',
    'model',
    'mapp',
    'module',
    'service',
    'state'
  ];

  // Access Policy
  /*
    propagateTo valid values
    [
      'all',          // Entire system components
      'extension',   // System extensions
      'handler',     // Data handlers
      'model',       // Data models
      'controller',  // Controllers
      'module'       // Modules
    ]
  */

  #propagateToValues = [];

  #propagateTo = [];

  /*
    accessibleFrom valid values
    [
      'public',       // Entire application
      'application'   // The application side
      'mapps',        // Only Mini Applications
      'base',         // Base Volundir System
      'extension',   // System extensions
      'handler',     // Data handlers
      'model',       // Data models
      'controller',  // Controllers
      'module'       // Modules
    ]
  */
  #accessibleFromValues = [
    'public',       // Entire application
    'application',  // The application side
    'mapp',         // Only Mini Applications
    'base',         // Base Volundir System
    'extension',    // System extensions
    'handler',      // Data handlers
    'model',        // Data models
    'controller',   // Controllers
    'module'        // Modules
  ];

  // Array with valid and default accessible system components
  #accessibleFrom = ['public'];

  #resolved = false;
  #ready    = false;

  constructor () {
    // console.log(` [${this.className}][start] `, this);
  }

  // Object properties

  // Returns the value of current class this.constructor.name => ExampleModule
  get className() {
    return this.#className;
  }

  // Returns the value of current class this.className converted fromPascalCaseToSnakeCase => example_module
  get shortName() {
    return this.className.fromPascalCaseToSnakeCase();
  }

  // Returns a string compose of this.objectType and this.shortName => module_example_module
  get cacheKey() {
    const key = `${this.objectType}_${this.shortName}`;

    // console.log('[Base][cacheKey] key: ', key);

    return key;
  }

  // cacheKey() {
  //   return `${this.objectType}_${this.shortName}`;
  // }

  cacheKeyFromObjectName(objectName) {
    // console.log('[Base][cacheKeyFromObjectName] objectName: ', objectName);

    const objectType = objectName.split('_').last().downCase();
    // console.log('[Base][cacheKeyFromObjectName] objectType: ', objectType);

    const shortName  = objectName.split('_').first().downCase();
    // console.log('[Base][cacheKeyFromObjectName] shortName: ', shortName);

    return `${objectType}_${objectName}`;;
  }


  // Object Status
  set resolved(value) {
    this.#resolved = value;
  }

  get isResolved() {
    return this.#resolved;
  }

  set ready(value) {
    this.#ready = value;
  }

  get isReady() {
    return this.#ready;
  }

  // Alis to isReady for developer convenience
  get ready(){
    return isReady();
  }


  // Path & URL

  get baseUrl () {
    return this.#baseUrl;
  }

  get filePath() {
    return this.#filePath;
  }

  set filePathUrl(filePath) {
    return this.#filePathUrl = (this.#baseUrl + filePath);
  }

  get filePathUrl() {
    return this.#filePathUrl;
  }

  static get filePathUrl() {
    console.log('import.meta: ', import.meta);
    // console.log(': ', );
    return import.meta.url;
  }

  getFilePathUrl(filePath) {
    // console.log(' [Base][getFilePathUrl] filePath: ', filePath);
    // console.log(' [Base][getFilePathUrl] this.filePathUrl A: ', this.filePathUrl);

    this.filePathUrl = filePath;
    // console.log(' [Base][getFilePathUrl] this.filePathUrl B: ', this.filePathUrl);

    return this.filePathUrl;
  }

  // Object name finders

  // Criar metodo para retornar o nome do arquivo concatenado com o caminho

  keyFromFilePath(filePath) {
    if(filePath.blank()) { return null }

    return filePath.replaceAll('/', '_').replaceAll('.', '_');
  }

  static keyFromFilePath() {
    if(filePath.blank()) { return null }

    return filePath.replaceAll('/', '_').replaceAll('.', '_');
  }

  getObjectNameFromFilePath(filePath) {
    if(filePath.blank()) { return null }

    return filePath.split('/').last().split('.').first().toPascalCase();
  }

  // Receives: object (instance as object = new FileModule())
  // Returns: FileModule
  getObjectInstanceName(object) {
    // console.log(' [Base][] object: ', object);
    const objectName = Object.keys(object).first();
    // console.log(' [Base][] objectName: ', objectName);
    return objectName;
  }

  // Receives: object (instance as object = new FileModule())
  // Returns: FileModule
  // getObjectName(object) {
  //   console.log(' [Base][] object: ', object);
  //   const objectName = Object.keys(object);
  //   console.log(' [Base][] objectName: ', objectName);
  //   return objectName;
  // }

  // Receives: bjectType, objectName
  // Returns: FileModule
  getObjectNameByType(objectType, objectName) {
    const singular = objectType.singularize();

    // Sanitize to prevent duplicated "_ + objectType" in final object path
    const sanitizedName = objectName.endsWith(`_${singular}`)
      ? objectName.slice(0, -(singular.length + 1))
      : objectName;

    let finalObjectName = `${sanitizedName}_${singular}`.toPascalCase();

    return finalObjectName;
  }


  // // Receives: objectName (composed as file_module)
  // // Returns: FileModule
  // getObjectTypeByObjectName(objectName) {
  //   console.log('[Base][getObjectTypeByObjectName] objectName: ', objectName);

  //   const objectType = objectName.split('_').last().capitalize();
  //   console.log('[Base][getObjectTypeByObjectName] objectType: ', objectType);

  //   return objectType;
  // }


  // Object type

  // MUST CHANGE TO string.withoutSpecifier()
  // Receives: objectName (composed as file_module)
  // Returns: module
  getObjectTypeByObjectName(objectName) {
    // console.log('[Base][getObjectTypeByObjectName] objectName: ', objectName);

    const objectType = objectName.split('_').last().downCase();
    // console.log('[Base][getObjectTypeByObjectName] objectType: ', objectType);

    return objectType;
  }

  // File name finders

  // Receives: bjectType, objectName
  // Returns: file_module.js
  getFileNameByObjectNameOrObjectType(objectName, objectType='') {
    if(objectType.blank()){
      objectType = this.getObjectTypeByObjectName(objectName);
    }

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
      case 'extension':
        objectPath = '/lib/volundir/lib/extensions';
        break;
      case 'handler':
        objectPath = '/lib/volundir/lib/adapters/output/handlers';
        break;
      case 'model':
        objectPath = '/lib/volundir/app/models';
        break;
      case 'controller':
        objectPath = '/lib/volundir/app/controllers';
        break;
      case 'module':
        objectPath = '/lib/volundir/lib/modules';
        break;
      case 'mapp':
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
      case 'extension':
        objectPath = ['/lib/volundir/lib/extensions'];
        break;
      case 'handler':
        objectPath = ['/lib/volundir/lib/adapters/output/handlers'];
        break;
      case 'model':
        objectPath = ['/lib/volundir/app/models', '/app/models'];
        break;
      case 'controller':
        objectPath = ['/app/controllers', '/lib/volundir/app/controllers'];
        break;
      case 'module':
        objectPath = ['/lib/volundir/lib/modules', '/app/modules'];
        break;
      case 'mapp':
        objectPath = ['/vendor/mapps'];
        break;
      default:
        console.error(' [HubModule][getObjectPathByType] unknown objectType:', objectType);
    }

    return objectPath;
  }

  // Methods, attributes & values

  // argumentValues() {
  //   let returnedValues = {};

  //   if (arguments.length === 0) {
  //     throw new TypeError("At least one string is required");
  //   }

  //   for (const arg of arguments) {
  //     if (arg.length > longest.length) {
  //       returnedValues = arg;
  //     }
  //   }

  //   return returnedValues;
  // }
}
