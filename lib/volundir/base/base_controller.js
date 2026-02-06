const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class BaseController extends BaseObject {
  constructor () {
    super();
    /*
      propagateTo valid values
      [
        'handler',     // Data handlers
        'module'       // Modules
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
        'extension',   // System extensions
        'handler',     // Data handlers
        'model',       // Data models
        'controller',  // Controllers
        'module'       // Modules
      ]
    */

    this.accessibleFromValues = [
      'handler',     // Data handlers
      'module'       // Modules
    ];

    // Array with valid and default accessible system components
    this.accessibleFrom = [
      'handler',
      'module'
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
