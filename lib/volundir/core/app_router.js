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

  start() {
    console.log('Volundir Start!');
  }

  navigate(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }

  async route(path) {
    const app = document.getElementById('app');
    await this.loadSettings();

    console.log('routes to work: ', this.routes);

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

    const loadedController = await this.loadModule(controllerPath);
    const data = await loadedController[action](html);

    console.log('controller data: ', data);

    return this.populateHtmlTemplate(html, data);
  }

  populateHtmlTemplate(htmlString, data) {
    return htmlString.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (match, keyPath) => {
      const keys = keyPath.split('.');
      let value = data;

      for (let i = 0; i < keys.length; i++) {
        if (value && typeof value === 'object' && keys[i] in value) {
          value = value[keys[i]];
        } else {
          console.warn(`Placeholder "${keyPath}" não encontrado nos dados.`);
          return '';
        }
      }
      return value !== undefined && value !== null ? value : '';
    });
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
