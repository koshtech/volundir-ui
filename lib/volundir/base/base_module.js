import { BaseObject } from '/lib/volundir/base/base_object.js';

export class BaseModule extends BaseObject {
  constructor() {
    super();

    // Required extensions
    this.requiredExtensions = [];

    // Required handlers
    this.requiredHandlers = [];

    // Required models
    this.requiredModels = [];

    // Required controllers
    this.requiredControllers = [];

    // Required modules
    this.requiredModules = [];

    this.propagateToValues = [
      'base',
      'extension',
      'handler',
      'model',
      'controller',
      'module'
    ];

    this.propagateTo = ['model', 'module', 'controller'];
  }
}
