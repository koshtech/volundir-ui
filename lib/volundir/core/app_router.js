// (function () {

// import { User } from '/app/models/user.js';

  export class AppRouter {
    constructor() {
      window.Models = window.Models || {};

      console.log('Active models: ', window.Models);

      window.addEventListener('popstate', () => {
        this.route(location.pathname);
      });

      window.addEventListener('DOMContentLoaded', () => {
        this.route(location.pathname);
        this.delegateLinks();
      });

      const selectedLayout = '/app/views/layouts/application.html';
      console.log('selectedLayout: ', selectedLayout);

      // const layout = await this.loadTemplate(selectedLayout);
      // const html = await this.loadTemplate(template);

      // console.log('layout: ', layout);

      fetch(selectedLayout)
        .then(response => response.text())
        .then(htmlText => {
          // document.open();
          // document.write(htmlText);
          // document.close();

          // const response = await fetch(url);
          // const htmlText = await response.text();

          const parser = new DOMParser();
          const newDoc = parser.parseFromString(htmlText, 'text/html');

          document.head.innerHTML = newDoc.head.innerHTML;
          document.body.innerHTML = newDoc.body.innerHTML;

          this.reexecuteScripts(document.body);
          // reinitializeApp(); // reinicie seu roteador e eventos

        });
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

    route(path) {
      const app = document.getElementById('app');

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

    async loadModule(path) {
      console.log('loadedModule: ', path);
      var loaded_module = '';
      try {
        const response = await fetch(path, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Module not found:', path);
          return null;
        }

        if(path == '/app/models/user.js'){
          loaded_module = await import(path);
          const User = loaded_module.User

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
      const modelPath        = `/app/models/${this.singularize(controller_name)}.js`

      // const loadedModel      = await this.loadModule(modelPath);
      // console.log('loadedModel: ', loadedModel);

      // window.Models[controller_name] = loadedModel;
      // console.log('Active models: ', window.Models);

      const loadedController = await this.loadModule(controllerPath);
      const data = loadedController[action](html);

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
// })();
