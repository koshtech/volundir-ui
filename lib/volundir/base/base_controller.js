const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class BaseController extends BaseObject {
  constructor () {
    super();
    /*
      propagateTo valid values
      [
        'handlers',     // Data handlers
        'modules'       // Modules
      ]
    */

    this.propagateToValues = [];

    this.propagateTo = [];

    /*
      accessibleFrom valid values
      [
        'public',       // Entire application
        'application'   // The application side
        'mapps',        // Only Mini Applications
        'base',         // Base Volundir System
        'extensions',   // System extensions
        'handlers',     // Data handlers
        'models',       // Data models
        'controllers',  // Controllers
        'modules'       // Modules
      ]
    */

    this.accessibleFromValues = [
      'handlers',     // Data handlers
      'modules'       // Modules
    ];

    // Array with valid and default accessible system components
    this.accessibleFrom = [
      'handlers',
      'modules'
    ];

    // Required modules
    this.requiredModules = [
      'file',
      'timer',
      'configuration',
      'storage',
      'logger',
      'display',
      'render',
      'router'
      // 'form'
    ];

    // Required models
    this.requiredModels = ['config_model', 'object_register_model'];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'local_storage';
  }

  static current_user () {
    // console.log('==============> current_user ok')

    return { name: "Joh Doe" };
  }

  user_loggedin () {
    let _user_loggedin = sessionStorage.getItem('auth') || false;

    // console.log('==============> user_loggedin: ', _user_loggedin);

    return _user_loggedin;
  }
}

// console.log('BaseController loaded.');
