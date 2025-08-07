import { Coordinator } from '../core/coordinator.js';

export class BaseController extends Coordinator {
  constructor (_modules) {
    super(_modules);

    // Required modules
    this.requiredModules = ['configuration', 'storage'];

    // Required models
    this.requiredModels = ['config_model', 'object_register_model'];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'local_storage';

    // if(_modules) {
    //   // console.log(' [base_controller] setAllLoadedModules');
    //   this.setControllerLoadedModules();
    // }
  }

  static current_user () {
    // console.log('==============> current_user ok')

    return { name: "Joh Doe" };
  }

  user_loggedin () {
    let _user_loggedin = sessionStorage.getItem('auth');

    // console.log('==============> user_loggedin: ', _user_loggedin);

    return _user_loggedin;
  }
}

// console.log('BaseController loaded.');
