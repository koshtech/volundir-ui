var _settings = "";
var _storage  = "";
var _routes   = "";

var _default_source = "";

export class AppRouter {
  constructor() {
    window.addEventListener('popstate', () => {
      this.route(location.pathname);
    });

    window.addEventListener('DOMContentLoaded', () => {
      this.route(location.pathname);
      this.delegateLinks();
    });

    const selectedLayout = '/app/views/layouts/application.html';

    console.log('selectedLayout: ', selectedLayout);

    fetch(selectedLayout)
      .then(response => response.text())
      .then(htmlText => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        document.head.innerHTML = newDoc.head.innerHTML;
        document.body.innerHTML = newDoc.body.innerHTML;

        this.reexecuteScripts(document.body);
        // reinitializeApp();
      });
  }

  get storage () {
    console.log('returning storage settings');

    _storage        = JSON.parse(sessionStorage.getItem('storage'));
    _default_source = _storage['default'];

    return _storage[_default_source];
  }

  get routes () {
    console.log('returning routes');

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
      console.error('Error details:', error);

    } finally {
      console.log('fetchFile done:', filePath);
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

      console.log("content: ", content);
    } catch (error) {
      console.error('Error details:', error);

    } finally {
      console.log('fetchFile done:', filePath);
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

    console.log('settings loaded:', _settings);
    console.log('storage loaded:', _storage);
    console.log('routes loaded:', _routes);
  }

  reexecuteScripts(container = document.body) {
    console.log('Volundr reexecuteScripts!');

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
    console.log('Volundir Start!');
  }

  navigate(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }


  async route(path) {
    const app = document.getElementById('app');
    await this.loadSettings();

    const routes = this.routes;

    let matched = false;

    for (var basePath in routes) {
      const mapping = routes[basePath];

      console.log('x====> path: ', path);
      console.log('x====> basePath: ', basePath);
      console.log('x====> mapping: ', mapping);

      var mapped     = mapping.split('/');
      var controller = mapped[0];
      var action     = mapped[1];

      console.log('====> controller: ', controller, ' action: ', action);
      var mapped_by_resource = path.slice(1).split('/');

      console.log('==> mapped_by_resource: ', mapped_by_resource);


        if (action == 'resources'){

          if(mapped_by_resource.length == 1) {
            action = 'index';
          } else {
            action = mapped_by_resource[1];
            basePath = `${basePath}/${action}`

            console.log('new basePath: ', basePath);
          }

          console.log('new action: ', action);
        }

      if (path === basePath) {
        // else {

        // import { User } from '/app/controllers/site_controller.js';
        // obj = Site.new;
        // obj.index();
          this.goto(controller, action);
        // }

        // const fullPath = ['/', 'index'].includes(action) ? basePath : `${basePath}/${action}`;

        // console.log('====> path: ', path, ' fullPath: ', fullPath, ' basePath: ', basePath);

        return;
      }




      // else if (mapping[Object.keys(mapping)[0]] === "resources") {
      //   const controller = Object.keys(mapping)[0];

      //   // /users
      //   if (path === basePath) {
      //     this.goto(controller, 'index');
      //     return;
      //   }

      //   // /users/new
      //   if (path === `${basePath}/new`) {
      //     this.goto(controller, 'new');
      //     return;
      //   }

      //   // /users/:id
      //   const showMatch = path.match(new RegExp(`^${basePath}/(\\d+)$`));
      //   if (showMatch) {
      //     this.goto(controller, 'show', showMatch[1]);
      //     return;
      //   }

      //   // /users/:id/edit
      //   const editMatch = path.match(new RegExp(`^${basePath}/(\\d+)/edit$`));
      //   if (editMatch) {
      //     this.goto(controller, 'edit', editMatch[1]);
      //     return;
      //   }
      // }
    }

    // Se nenhuma rota foi encontrada
    app.innerHTML = `<h2>404 - Página não encontrada</h2>`;
  }

  async _route(path) {
    const app = document.getElementById('app');
    await this.loadSettings();

    const routes = this.routes;

    console.log('proccessing path: ', path);
    console.log('routes to work: ', routes);

    for (const basePath in routes) {
      console.log('==> basePath: ', basePath);
      const mapping = routes[basePath]
      console.log('==> mapping: ', mapping);

      console.log('==> isArray: ', Array.isArray(mapping[Object.keys(mapping)[0]]));

      if (Array.isArray(mapping[Object.keys(mapping)[0]])) {
        const controller = Object.keys(mapping)[0];
        const actions = mapping[controller];

        console.log('controller: ', controller, ' actions: ', actions);

        for (const action of actions) {
          console.log('controller: ', controller, ' action: ', action);

          const fullPath = action === 'index' ? basePath : `${basePath}/${action}`;

          console.log('fullPath: ', fullPath);
          if (path === fullPath) {

            this.goto(controller, action);

            console.log('===============> usou a rota nova.');

            return;
          }
        }

      }

    }

    console.log('===============> passou direto e usou a rota antiga.');

    switch (path) {
      case '/':
        this.goto('site', 'index');
        break;

      case '/login':
        this.goto('sessions', 'login');
        break;

      case '/register':
        this.goto('sessions', 'register');
        break;
      case '/forgot':
        this.goto('sessions', 'forgot');
        break;
      case '/users':
        this.goto('users', 'index');
        break;

      case '/logout':
        this.goto('sessions', 'logout');
        break;

      default:
        app.innerHTML = `<h2>404 - Página não encontrada</h2>`;
    }
  }

  async goto(controller, action) {
    const template = `${controller}/${action}.html`;
    const html = await this.loadTemplate(template);
    const inner = await this.processControllerAction(controller, action, html);

    console.log('controller: ', controller, 'action: ', action)
    console.log('template: ', template)
    console.log('inner: ', inner)

    // const _app = document.getElementById('app')

    app.innerHTML = inner;
  }

  async loadTemplate(page) {
    const templatePath = "/app/views/" + page;

    try {
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not load ${page}`);
      }

      return await response.text();

    } catch (error) {
      console.error('Failed to load page:', error);
      return `<p>Failed to load page due to error: ${error.message}</p>`;
    }
  }

  extract_model_name() {

  }

  async loadModule(path) {
    console.log('loadedModule: ', path);
    var loaded_module = '';
    var imported_module = '';

    try {
      const response = await fetch(path, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('Module not found:', path);
        return null;
      }

      if(path == '/app/models/user.js'){
        imported_module = await import(path);
        // const User = imported_module.User

        console.log('User: ', imported_module.User);
        loaded_module = imported_module.User
        // User.find(1);
      }
      else{
        loaded_module = await import(path);
      }

      return loaded_module;
    } catch (error) {
      console.error('Error importing module:', error);

      return null;
    }
  }

  async processControllerAction(controller_name, action, html) {
    const controllerPath   = `/app/controllers/${controller_name}_controller.js`;
    var data = '';

    const instance_name    = `${this.capitalize(controller_name)}`;
    const controller_class = await import(controllerPath);
    const loadedClass = controller_class[instance_name];

    console.log('instance_name: ', instance_name);
    console.log('controller_class: ', controller_class);
    console.log('loadedClass: ', loadedClass);

    if (typeof loadedClass[action] === 'function') {
      console.log('action: ', action);
      data = await loadedClass[action]();
      console.log(data);
    } else {
      console.error(`Error: '${action}' does not exist or is not a function ${instance_name}`);
    }

    console.log('controller data: ', data);

    return this.renderTemplate(html, data);
  }

  renderTemplate(template, context) {
    const getValue = (key, scope) => {
      return key.split('.').reduce((obj, prop) => obj?.[prop], scope) ?? '';
    };

    template = template.replace(/{{each\s+(\w+)\s+in\s+(\w+)}}([\s\S]*?){{end}}/g, (_, itemVar, listName, innerTemplate) => {
      const list = context[listName];
      if (!Array.isArray(list)) return '';

      return list.map(item => {
        const loopScope = { ...context, [itemVar]: item };

        return innerTemplate.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
          return getValue(key, loopScope);
        });
      }).join('');
    });

    template = template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
      return getValue(key, context);
    });

    return template;
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
