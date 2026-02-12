const BaseModule = await File.import('lib/volundir/base/base_module.js');

const ConfigurationModule = await File.import('lib/volundir/lib/modules/configuration_module.js');

export class ControllerModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['configuration'];

    // Required models
    this.requiredModels = [];


    this.modules = {
      "configuration": new ConfigurationModule(),
      "file": File
    };

    // Loaded controllers
    this.loadedControllers = {}; // check if this is in use

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  async load(controllerName) {
    // console.log(' [Volundir][loadcontroller] controllerName: ', controllerName);
    // console.log(' [Volundir][loadcontroller] controllerPath: ', controllerPath);


    var loadedController = null
    var dependencies = {};

    // try {
      loadedController = await this.importController(controllerName);

      // console.log(' [Volundir][loadcontroller] loadedController: ', loadedController);

      // dependencies = this.listDependencies(controllerName, loadedController);
      // console.log(` [Volundir][loadcontroller] dependencies for controller ${controllerName}: `, dependencies);

      // await this.loadDependencies(dependencies);

    // } catch (error) {
    //   console.error(' [Volundir][loadcontroller] Error loading controller: ', controllerName, ' error: ', error);
    // }

    return loadedController;
  }

  async importController(controllerName) {
    // console.log(' [controller][importController] this: ', this);
    // console.log(' [controller][importController] controllerName: ', controllerName);
    // console.log(' [controller][importController] loadedControllers: ', this.loadedControllers);

    const controllerPath   = `/app/controllers/${controllerName}_controller.js`;
    // console.log(' [controller][importController] controllerPath: ', controllerPath);
    var loadedController = null;

    // try {
      // if(this.loadedControllers[controllerName] && Object.keys(this.loadedControllers[controllerName]).length > 0) {
      //   console.log(' [controller][importController][if] loadedController: ', this.loadedControllers[controllerName]);

      //   loadedController = this.loadedControllers[controllerName];
      // }
      // else {
        // const loadedClass  = await import(controllerPath);
        const loadedClass = await this.modules.file.loadClass(controllerPath);
        // console.log(' [controller][importController][else] loadedClass: ', loadedClass);

        const instanceName = loadedClass.constructor.name
        // console.log(' [controller][importController][else] instanceName: ', instanceName);

        loadedController   = loadedClass

        // console.log(' [controller][importController][else] loadedController: ', loadedController);
      // }

      // console.log(' [controller][importController] loadedController: ', loadedController);
      // await this.registerController(controllerName, loadedController);

    // } catch (error) {
    //   console.error(' [controller][importController] Error importing controller: ', controllerName, ' error: ', error);
    // }

    return loadedController;
  }

}
