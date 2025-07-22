var _settings = "";
var _storage  = "";
var _routes   = "";

var _default_source = "";

import { Render } from '/lib/volundir/core/render.js';
import { Logger } from '/lib/volundir/core/logger.js';
import { System } from '/lib/volundir/core/system.js';

export class AppRouter extends Render {
  constructor() {
    super();
    this.generatePath = this.generatePath.bind(this);

    window.addEventListener('popstate', () => {
      this.route(location.pathname);
    });

    window.addEventListener('DOMContentLoaded', () => {
      this.route(location.pathname);
      this.delegateLinks();
    });

    window.addEventListener('submit', async (event) => {
      const form = event.target;

      // console.log('form: ', form);

      if (form.tagName === 'FORM' && form.action.startsWith(location.origin)) {
        event.preventDefault();

        const path    = new URL(form.action).pathname;
        const methodInput = form.querySelector('input[name="_method"]');
        const method = (methodInput?.value || form.method || 'get').toLowerCase();


        // console.log('=> form.method: ', form.method);
        // console.log('=> submit path: ', path, ' method: ', method);

        await this.route(path, method, new FormData(form));
      }
    });

    window.addEventListener('click', async (event) => {
      const link = event.target.closest('a[data-method]');

      if (!link || !link.href.startsWith(location.origin)) return;

      event.preventDefault();

      const method = link.dataset.method?.toLowerCase() || 'get';
      const confirmMessage = link.dataset.confirm;

      // Confirm window
      if (confirmMessage && !window.confirm(confirmMessage)) {
        return; // Canceled
      }

      const path = new URL(link.href).pathname;

      // console.log('=> link clicked:', path, 'method:', method);

      const formData = new FormData();

      await this.route(path, method, formData);
    });

    // window.addEventListener('change', () => {
    //   console.log('========> change!');
    // });

    const selectedLayout = `/app/views/${this.selectedInterface()["code"]}/layouts/application.html`;

    window.addEventListener('DOMContentLoaded', () => {
      this.bindPopulateListeners();

      fetch(selectedLayout)
        .then(response => response.text())
        .then(htmlText => {
          const parser = new DOMParser();
          htmlText     = this.renderLayout(htmlText, {});
          const newDoc = parser.parseFromString(htmlText, 'text/html');

          document.head.innerHTML = newDoc.head.innerHTML;
          document.body.innerHTML = newDoc.body.innerHTML;

          // this.reexecuteScripts(document.body);
          // reinitializeApp();
        });
    });


    // console.log('selectedLayout: ', selectedLayout);


    Logger.info({
      date: "2025-07-04 01:01:01",
      event: "Volundir Application Started.",
      description: "The Volundir Application MyTestApp was completely loaded and started."
    });
  }

  bindPopulateListeners() {
    const selects = document.querySelectorAll('select[data-on-change="populate"]');
    selects.forEach(select => {
      if (!select.dataset._bound) {
        select.dataset._bound = "true";
        select.addEventListener('change', () => {
          console.log(`[populate] disparado em`, select);
          Render.populate(select);
        });
      }
    });
  }

  get storage () {
    // console.log('returning storage settings');

    _storage        = JSON.parse(sessionStorage.getItem('storage'));
    _default_source = _storage['default'];

    return _storage[_default_source];
  }

  get routes () {
    // console.log('returning routes');

    _routes = JSON.parse(sessionStorage.getItem('routes'));

    return _routes;
  }

  async fetchFile(filePath) {
    var response = null;

    try {
      response = await fetch(filePath);

      if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText} loading ${settingsFilePath}.`);
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
          throw new Error(`HTTP error: ${response.status} ${response.statusText} loading ${settingsFilePath}.`);
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

  async loadSettings() {
    const settingsFilePath = '/config/settings.json';
    const storageFilePath  = '/config/storage.json';
    const routesFilePath   = '/config/routes.json';

    _settings = await this.fetchJSONFile(settingsFilePath);
    _storage  = await this.fetchJSONFile(storageFilePath);
    _routes   = await this.fetchJSONFile(routesFilePath);

    sessionStorage.setItem('settings', JSON.stringify(_settings));
    sessionStorage.setItem('storage', JSON.stringify(_storage));
    sessionStorage.setItem('routes', JSON.stringify(_routes));

    // window.router = app;

    // console.log('settings loaded:', _settings);
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

  init() {
    // console.log('Volundir Start!');
  }

  navigate(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }

  async route(path, method = 'get', formData = null){
    const app = document.getElementById('app');
    await this.loadSettings();

    const routes = this.routes;

    let matched = false;

    for (var basePath in routes) {
      const mapping = routes[basePath];

      // console.log('x====> path: ', path);
      // console.log('x====> basePath: ', basePath);
      // console.log('x====> mapping: ', mapping);

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
          return this.goto(controller, 'index');
        }

        if (method === 'post' && mapped_by_resource.length === 1) {
          return this.goto(controller, 'create', null, formData);
        }

        if (method === 'get' && mapped_by_resource.length === 2 && resourceId !== 'new') {
          return this.goto(controller, 'show', resourceId);
        }

        if (method === 'get' && resourceAction === 'edit') {
          return this.goto(controller, 'edit', resourceId);
        }

        if (method === 'put' && mapped_by_resource.length === 2) {
          return this.goto(controller, 'update', resourceId, formData);
        }

        if (method === 'delete' && mapped_by_resource.length === 2) {
          // console.log('x====> resource action: ', 'destroy');
          return this.goto(controller, 'destroy', resourceId);
        }

        if (method === 'get' && mapped_by_resource[1] === 'new') {
          return this.goto(controller, 'new');
        }

        // Fallback
        return this.goto('site', 'page404');
      }

      if (path === basePath) {
        this.goto(controller, action);

        return;
      }
    }

    // Route not found
    // app.innerHTML = `<h2>404 - Page Not Found</h2>`;
    return this.goto('site', 'page404');
  }

  async goto(controller, action, param = null, formData = null) {
    // console.log('controller: ', controller, ' action: ', action, ' param: ', param, ' formData: ', formData);
    // console.log('template: ', template)

    const inner = await this.processControllerAction(controller, action, param, formData);

    // console.log('inner: ', inner)

    if(this.present(inner)){
      app.innerHTML = inner;
      this.bindPopulateListeners();
    }
  }

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

      if(path == '/app/models/user.js'){
        imported_module = await import(path);
        // const User = imported_module.User

        // console.log('User: ', imported_module.User);
        loaded_module = imported_module.User
        // User.find(1);
      }
      else{
        loaded_module = await import(path);
      }

      return loaded_module;
    } catch (error) {
      // console.error('Error importing module:', error);

      return null;
    }
  }

  async processControllerAction(controller, action, param = null, formData = null) {
    const controllerPath   = `/app/controllers/${controller}_controller.js`;
    var data = '';

    const instance_name    = `${this.capitalize(controller)}`;
    const controller_class = await import(controllerPath);
    const loadedClass = controller_class[instance_name];

    console.log('instance_name: ', instance_name);
    console.log('controller_class: ', controller_class);
    console.log('loadedClass: ', loadedClass);

    if (typeof loadedClass[action] === 'function') {
      console.log('  action: ', action);
      console.log('  param: ', param);
      console.log('  formData: ', formData);

      if (formData) {
        console.log('==> if (formData): ');

        data = await loadedClass[action](formData, param);

        console.log('==> data: ', data);

        if (this.present(data['errors'])) {
          if (action == 'create'){
            System.form_errors(data["errors"]);

            console.log('==> create validation error. Redirect to action: ', action);
          } else if (action == 'edit'){
            System.form_errors(data["errors"]);

            console.log('==> create validation error. Redirect to action: ', action);
          }

          console.log(`==> stopped at: ${action} without return`);

          return "";
        }
      } else if (param) {
        console.log('==> else if (param): ');
        data = await loadedClass[action](param);

      } else {
        console.log('==> else: ');
        data = await loadedClass[action]();
      }
      // console.log(data);
    } else {
      console.error(`Error: '${action}' does not exist or is not a function ${instance_name}`);
    }

    // console.log('controller data: ', data);

    const template = `${this.selectedInterface()["code"]}/${controller}/${action}.html`;
    // console.log('controller template: ', template);
    const html = await this.loadTemplate(template);

    return this.renderTemplate(html, data);
  }

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

window.AppRouter = AppRouter;
