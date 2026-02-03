const Base = await File.import('lib/volundir/base/base.js');

export class BaseSystem extends Base {
  #initPhase = null;

  constructor () {
    super();

    // Default Initialization Phase
    this.#initPhase = 0;
  }

  initPhase(phase) {
    if (arguments.length === 0) {
      return this.#initPhase;
    }

    return (async () => {
      await this.setInitPhase(phase);
    })();
  }

  /*
    Levels:
        0 = Application not initialized
        1 = Application initialization phase started
        2 = Pre Load Essential subsystems
        3 = Load Core Modules and Models
        4 = Apply Environment Configurations
        5 = Starting Background Components
        6 = Render Main Interface
        7 = Application Ready

  */
  async setInitPhase(phase = null) {
    if (phase) {
      this.#initPhase = phase;
    }

    // if(! ['loadbaseModules', 'registerModules', 'loadCoreModels'].includes(this.#initPhase)) {
    //   // await this.configuration.save('initPhase', this.#initPhase);
    // }

    // Logger.info(`Set initPhase: ${this.#initPhase}`);

    return true;
  }

  startSplash() {
    (async () => await this.modules.display.startSplash())();
  }

  stopSplash() {
    (async () => await this.modules.display.stopSplash())();
  }

  splashMessage(idOrClass, text) {
    (async () => await this.modules.display.splashMessage(idOrClass, text))();
  }

  async loadConfiguration() {
    await this.modules.configuration.load();
  }

  navigateRoot() {
    // this.setinitPhase();

    // this.reexecuteScripts();

    // GuildaLogger.log(' [Volundir][navigateRoot] Go!');

    // this.navigateTo('/');
    this.modules.interceptor.handleInternalRoute('/');
  }

  navigateTo(path) {
    history.pushState({}, '', path);

    window.dispatchEvent(new Event('popstate'));
  }

  reexecuteScripts(container = document.body) {
    GuildaLogger.log('Volundr reexecuteScripts!');

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

  generatePath(resource, action, id = null, params = '') {
    let path = '';

    // GuildaLogger.log('===> generatePath - resource: ', resource, ' action: ', action, ' id: ', id, ' params: ', params)

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

  // delegateLinks() {
  //   document.body.addEventListener('click', (event) => {
  //     const el = event.target.closest('a[href^="/"]');
  //     if (el && !el.hasAttribute('target') && !event.ctrlKey && !event.metaKey) {
  //       event.preventDefault();
  //       const path = el.getAttribute('href');
  //       this.navigate(path);
  //     }
  //   });
  // }
}
