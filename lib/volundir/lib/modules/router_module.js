const BaseModule = await File.import('lib/volundir/base/base_module.js');

const ConfigurationModule = await File.import('lib/volundir/lib/modules/configuration_module.js');
const ControllerModule    = await File.import('lib/volundir/lib/modules/controller_module.js');
// const StorageModule       = await File.import('lib/volundir/lib/modules/storage_module.js');
const RenderModule        = await File.import('lib/volundir/lib/modules/render_module.js');

export class RouterModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['configuration', 'controller', 'render'];

    // Required models

    this.requiredModels = [];
    this.modules = {
      "configuration": new ConfigurationModule(),
      "controller": new ControllerModule(),
      // "storage": new StorageModule(),
      "render": new RenderModule()
    };

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  async dispatcher(path, method = 'get', formData = null){
    const routes = await this.modules.configuration.get('routes');

    console.log(` [router][dispatcher] path: `, path);
    console.log(` [router][dispatcher] method: `, method);
    console.log(` [router][dispatcher] formData: `, formData);
    console.log(` [router][dispatcher] routes: `, routes);
    console.log(` [router][dispatcher] this: `, this);

    let matched = false;

    for (var basePath in routes) {
      const mapping = routes[basePath];

      console.log('x====> path: ', path);
      console.log('x====> basePath: ', basePath);
      console.log('x====> mapping: ', mapping);

      var mapped     = mapping.split('/');
      var controller = mapped[0];
      var action     = mapped[1];

      // console.log('====> controller: ', controller, ' action: ', action);
      var mapped_by_resource = path.slice(1).split('/');

      // console.log('==> mapped_by_resource: ', mapped_by_resource);

      if (action === 'resources' && path.startsWith(basePath)) {
        const resourceId = mapped_by_resource[1];
        const resourceAction = mapped_by_resource[2];

        // console.log('x====> resource method: ', method);

        if (method === 'get' && mapped_by_resource.length === 1) {
          return this.executeInternalAction(controller, 'index');
        }

        if (method === 'post' && mapped_by_resource.length === 1) {
          return this.executeInternalAction(controller, 'create', null, formData);
        }

        if (method === 'get' && mapped_by_resource.length === 2 && resourceId !== 'new') {
          return this.executeInternalAction(controller, 'show', resourceId);
        }

        if (method === 'get' && resourceAction === 'edit') {
          return this.executeInternalAction(controller, 'edit', resourceId);
        }

        if (method === 'put' && mapped_by_resource.length === 2) {
          return this.executeInternalAction(controller, 'update', resourceId, formData);
        }

        if (method === 'delete' && mapped_by_resource.length === 2) {
          // console.log('x====> resource action: ', 'destroy');
          return this.executeInternalAction(controller, 'destroy', resourceId);
        }

        if (method === 'get' && mapped_by_resource[1] === 'new') {
          return this.executeInternalAction(controller, 'new');
        }

        // Fallback
        return this.executeInternalAction('site', 'page404');
      }

      if (path === basePath) {
        this.executeInternalAction(controller, action);

        return;
      }
    }

    // Route not found
    // app.innerHTML = `<h2>404 - Page Not Found</h2>`;
    return this.executeInternalAction('site', 'page404');
  }

  async executeInternalAction(controller, action, param = null, formData = null) {
    // console.log('controller: ', controller, ' action: ', action, ' param: ', param, ' formData: ', formData);
    // console.log('template: ', template)

    const inner = await this.processControllerAction(controller, action, param, formData);

    // console.log('inner: ', inner)

    if(inner.present()){
      // const container = document.getElementById('main-content');
      const container = document.querySelector('#main-content');
      // console.log('container: ', container)

      container.innerHTML = inner;

      // const newBody = layout.body;

      // if (!container) {
      //   console.error("#main-app-container not found.");
      //   return;
      // }

      // container.innerHTML = newBody.innerHTML;
      // container.innerHTML = layout.innerHTML;

      // container.className = newBody.className;

      // this.bindPopulateListeners();
    }
  }

  async processControllerAction(controller, action, param = null, formData = null) {
    var data = '';
    console.log('[processControllerAction] controller: ', controller);
    console.log('[processControllerAction] action: ', action);
    console.log('[processControllerAction] param: ', param);
    console.log('[processControllerAction] formData: ', formData);

    const objectName = `${controller}_controller`;

    // load with coordinator
    // const instancedController = await this.modules.controller.load(controller);
    const instancedController = await Coordinator.loadObject(objectName);

    console.log('[processControllerAction] instancedController: ', instancedController);

    // await this.registerController(controller, instancedController);

    if (typeof instancedController[action] === 'function') {
      if (formData) {
        // console.log('==> if (formData): ');
        data = instancedController[action](formData, param);

        // console.log('==> data: ', data);
        if (this.present(data['errors'])) {
          if (action == 'create'){
            System.form_errors(data["errors"]);

            // console.log('==> create validation error. Redirect to action: ', action);
          } else if (action == 'edit'){
            System.form_errors(data["errors"]);

            // console.log('==> create validation error. Redirect to action: ', action);
          }

          // console.log(`==> stopped at: ${action} without return`);

          return "";
        }
      }
      else if (param) {
        // console.log('==> else if (param): ');
        data = await instancedController[action](param);

      }
      else {
        // console.log('==> else action: ', action);
        data = await instancedController[action]();
      }
      console.log(data);
    } else {
      console.error(`Error: '${action}' does not exist or is not a function ${instance_name}`);
    }

    // console.log('controller data: ', data);

    const template = `${controller}/${action}`;
    // console.log('controller template: ', template);
    const html = await this.modules.render.loadTemplate(template);

    return this.modules.render.renderTemplate(html, data);
  }
}
