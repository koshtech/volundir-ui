await import('/lib/volundir/config/boot.js');

import { Coordinator } from '/lib/volundir/core/coordinator.js';

export class VolundirApp extends Coordinator {
  constructor() {
    super();

    // this.generatePath    = this.generatePath.bind(this);
    this.modulesToLoad   = {};
    this.loadedModules   = {};
    this.importedModules = {};
  }

  async run() {
    this.set_text('.loading-item', '...Volundir Application');
    this.init();
  }

  async init() {

    this.set_text('.loading-item', '...Javascript extensions');
    await this.loadExtensions();

    this.set_text('.loading-item', '...System configuration');
    // console.log('Loading configuration...');
    await this.loadConfiguration();

    this.set_text('.loading-item', '...Modules');
    // console.log('Loading modules...');
    // await this.autoLoad();
    await this.autoLoad({}, VolundirApp);

    this.set_text('.loading-item', '...Interceptors');
    // await listener.loadDefaults();

    this.set_text('.loading-item', '...Adaptors');
    // console.log('Loading adapters...');

    this.set_text('.loading-item', '...Components');


    this.set_text('.loading-item', '...interface');
    // console.log('  => this: ', this);
    // const Render = this.Render;

    this.render.appLayout();
  }

  async loadExtensions() {
    const activeExtensions = {
      "string_plus": "string/string_plus"
    }
    let loadedExtensions = {};

    let registeredExtensions = {};

    try {
      const raw = sessionStorage.getItem('registeredExtensions');
      registeredExtensions = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn(' [main] Invalid session data, resetting.');
      sessionStorage.removeItem('registeredExtensions');
    }

    // console.log(` [main] activeExtensions: ${Object.keys(activeExtensions).length} - registeredExtensions: ${Object.keys(registeredExtensions).length}`);

    // console.log(' [main] Loading extensions...');

    for (const name of Object.keys(activeExtensions)) {
      try {
        await import(`/lib/volundir/extensions/${activeExtensions[name]}.js`);
        loadedExtensions[name] = activeExtensions[name];
        // console.log(` [main] Extension ${name} loaded.`)
      } catch (err) {
        console.error(` [main] Error loading extension ${name}: ${err.message}`);
      }
    }

    // console.log(' [main] Extensions loaded:', loadedExtensions);
    sessionStorage.setItem('registeredExtensions', JSON.stringify(loadedExtensions));
    // console.log(' [main] sessionStorage Extensions:', JSON.parse(sessionStorage.getItem('registeredExtensions')));
  }

  get _storage () {
    var _storage        = JSON.parse(sessionStorage.getItem('storage'));
    var _default_source = _storage['default'];

    return _storage[_default_source];
  }

  get routes () {
    // console.log('returning routes');

    return JSON.parse(sessionStorage.getItem('routes'));
  }

  async fetchFile(filePath) {
    var response = null;

    try {
      response = await fetch(filePath);

      if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText} loading ${configFilePath}.`);
      }
    } catch (error) {
      // console.error('Error details:', error);

    } finally {
      // console.log('fetchFile done:', filePath);
    }

    return response;
  }

  async fetchJSONFile(filePath) {
    var content  = null;
    var response = await this.fetchFile(filePath);

    try {
      if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText} loading ${configFilePath}.`);
      }
      content = await response.json();

      // console.log("content: ", content);
    } catch (error) {
      // console.error('Error details:', error);

    } finally {
      // console.log('fetchFile done:', filePath);
    }

    return content;
  }

  async loadConfiguration() {
    const autoLoadFilePath = '/lib/volundir/config/autoload.json';
    const configFilePath   = '/config/config.json';
    const storageFilePath  = '/config/storage.json';
    const routesFilePath   = '/config/routes.json';

    const _autoLoad = await this.fetchJSONFile(autoLoadFilePath);
    const _config = await this.fetchJSONFile(configFilePath);
    const _storage  = await this.fetchJSONFile(storageFilePath);
    const _routes   = await this.fetchJSONFile(routesFilePath);

    sessionStorage.setItem('autoload', JSON.stringify(_autoLoad));
    sessionStorage.setItem('configuration', JSON.stringify(_config));
    sessionStorage.setItem('storage', JSON.stringify(_storage));
    sessionStorage.setItem('routes', JSON.stringify(_routes));

    // window.router = app;

    // console.log('========>>>>>> autoLoad loaded:', _autoLoad);
    // console.log('config loaded:', _config);
    // console.log('storage loaded:', _storage);
    // console.log('routes loaded:', _routes);
  }

  reexecuteScripts(container = document.body) {
    // console.log('Volundr reexecuteScripts!');

    container.querySelectorAll('script').forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.type = oldScript.type || 'text/javascript';
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
    });
  }

  navigate(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }

  // where this is used??
  async loadModule(path) {
    // console.log('loadedModule: ', path);
    var loaded_module = '';
    var imported_module = '';

    try {
      const response = await fetch(path, { method: 'HEAD' });
      if (!response.ok) {
        // console.warn('Module not found:', path);
        return null;
      }

      // if(path == '/app/models/user.js'){
      //   imported_module = await import(path);
      //   // const User = imported_module.User

      //   // console.log('User: ', imported_module.User);
      //   loaded_module = imported_module.User
      //   // User.find(1);
      // }
      // else{
        loaded_module = await import(path);
      // }

      return loaded_module;
    } catch (error) {
      // console.error('Error importing module:', error);

      return null;
    }
  }

  // async processControllerAction(controller, action, param = null, formData = null) {
  //   const controllerPath   = `/app/controllers/${controller}_controller.js`;
  //   var data = '';

  //   const instance_name    = `${this.capitalize(controller)}`;
  //   const controller_class = await import(controllerPath);
  //   const loadedClass = controller_class[instance_name];

  //   const instancedController = new loadedClass();

  //   // console.log('instance_name: ', instance_name);
  //   // console.log('controller_class: ', controller_class);
  //   // console.log('loadedClass: ', loadedClass);

  //   // if(controller == 'sessions'){
  //   //   // instancedController.setModules(this.loadedModules);
  //   //   data = instancedController[action]();
  //   // }
  //   // else
  //   if (typeof instancedController[action] === 'function') {
  //     // console.log('  action: ', action);
  //     // console.log('  param: ', param);
  //     // console.log('  formData: ', formData);

  //     if (formData) {
  //       // console.log('==> if (formData): ');

  //       data = instancedController[action](formData, param);

  //       // console.log('==> data: ', data);

  //       if (this.present(data['errors'])) {
  //         if (action == 'create'){
  //           System.form_errors(data["errors"]);

  //           // console.log('==> create validation error. Redirect to action: ', action);
  //         } else if (action == 'edit'){
  //           System.form_errors(data["errors"]);

  //           // console.log('==> create validation error. Redirect to action: ', action);
  //         }

  //         // console.log(`==> stopped at: ${action} without return`);

  //         return "";
  //       }
  //     } else if (param) {
  //       // console.log('==> else if (param): ');
  //       data = instancedController[action](param);

  //     } else {
  //       console.log('==> else action: ', action);
  //       // if(action == 'login'){
  //       //   instancedController.setModules(this.modules);
  //       //   data = instancedController.login;
  //       // }
  //       // else{
  //         data = instancedController[action]();

  //       // }

  //     }
  //     // console.log(data);
  //   } else {
  //     console.error(`Error: '${action}' does not exist or is not a function ${instance_name}`);
  //   }

  //   // console.log('controller data: ', data);

  //   const template = `${this.selectedInterface()["code"]}/${controller}/${action}.html`;
  //   // console.log('controller template: ', template);
  //   const html = await this.loadTemplate(template);

  //   return this.renderTemplate(html, data);
  // }

  generatePath(resource, action, id = null, params = '') {
    let path = '';

    // console.log('===> generatePath - resource: ', resource, ' action: ', action, ' id: ', id, ' params: ', params)

    switch (action) {
      case 'index':   path = `/${resource}`; break;
      case 'new':     path = `/${resource}/new`; break;
      case 'create':  path = `/${resource}`; break;
      case 'edit':    path = `/${resource}/${id}/edit`; break;
      case 'update':  path = `/${resource}/${id}`; break;
      case 'show':    path = `/${resource}/${id}`; break;
      case 'destroy': path = `/${resource}/${id}`; break;
      default: throw new Error(`Unknown action '${action}' for resource '${resource}'`);
    }

    if (params) {
      path += `?${params}`;
    }

    return path;
  }

  singularize(word) {
    const endings = {
      ves: 'fe',
      ies: 'y',
      i: 'us',
      zes: 'ze',
      ses: 's',
      es: 'e',
      s: ''
    };
    return word.replace(
      new RegExp(`(${Object.keys(endings).join('|')})$`),
      r => endings[r]
    );
  }

  capitalize(string) {
    if (typeof string !== 'string' || string.length === 0) {
      return string;
    }
    return string.split(' ').map(word => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

  present(obj) {
    return this.empty(obj) ? false : true;
  }

  empty(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
  }

  set_text(idOrClass, text) {
    if (typeof idOrClass !== 'string') return;

    if (idOrClass.startsWith('#')) {
      const element = document.getElementById(idOrClass.slice(1));

      if (element) {
        element.textContent = text;
      }
    } else if (idOrClass.startsWith('.')) {
      const elements = document.getElementsByClassName(idOrClass.slice(1));

      for (const el of elements) {
        el.textContent = text;
      }
    } else {
      console.warn('Selector must start with "#" (ID) or "." (class).');
    }
  }

  delegateLinks() {
    document.body.addEventListener('click', (event) => {
      const el = event.target.closest('a[href^="/"]');
      if (el && !el.hasAttribute('target') && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const path = el.getAttribute('href');
        this.navigate(path);
      }
    });
  }
};

// window.App = VolundirApp;
