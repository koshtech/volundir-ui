// Boot Volundir System
await import('/lib/volundir/config/boot.js');

const BaseSystem = await File.import('lib/volundir/base/base_system.js');

// import { AuthModule } from '/lib/volundir/lib/modules/auth_module.js';
// console.log('[Volundir][preBoot] File.getClassName():', File.getClassName());
// globalThis.Auth = new AuthModule();

export class Volundir extends BaseSystem {
  objectTypes = [];
  baseModules = [];

  base        = {};
  extensions  = {};
  handlers    = {};
  models      = {}
  modules     = {};
  controllers = {};

  mapps = {};

  app = null;

  constructor() {
    super();
  }

  init() {
    (async() => {
      await this.initPhase(1); // Application initialization phase started
      log.info('Initalizing Volundir Application...');

      this.objectTypes = [
        'base',
        'extension',
        'handler',
        'model',
        'module',
        'controller'
      ];

      this.baseModules = [
        'storage',
        'configuration',
        'extension',
        'interceptor',
        'auth',
        'display',
        'render'
      ];

      this.modules = Coordinator.getLoadedModules();

      this.models = {
        "logger_model": Logger.models.logger_model
      }

      this.mapps = ['guilda'];

    // this.VERSION = '0.1.0-c43'
      // console.log(' [Volundir][init][C] this: ', this);
      // console.log(' [Volundir][init][C] Coordinator: ', Coordinator);

      await this.startSplash();

      this.splashMessage('.loading-title', 'Loading...');


      await this.run();
    })();
  }

  async run() {
    // console.log(' [Volundir][init][C] this.modules: ', this.modules);

    // Logger.info('Starting Volundir Application...');

    await this.preLoadComponents();

    await this.loadBaseSystem();

    await this.laadConfigurations();

    await this.loadBackgroundComponents();

    this.loadApp();

    this.startApp();
  }

  async preLoadComponents() {
    this.splashMessage('.loading-item', 'Boot Components.');

    // await this.loadExtensions();

    await this.initPhase(2); // Starting Background Components

  }

  async loadBaseSystem() {
    this.splashMessage('.loading-item', 'Base System.');

    await this.initPhase(3); // Load Core Modules and Models

    await Coordinator.loadModules(this.baseModules);

    this.modules = Coordinator.getLoadedModules();
  }

  async laadConfigurations() {
    this.splashMessage('.loading-item', 'Configurations.');

    await this.initPhase(4); // Apply Environment Configurations

    await this.loadConfiguration();
  }

  async loadBackgroundComponents() {
    this.splashMessage('.loading-item', 'Background Components.');

    await this.initPhase(5); // Starting Background Components

    // await this.loadAppDependencies();

    await Logger.updateHandlers();
  }

  loadApp() {
    this.splashMessage('.loading-title', 'Rendering...');
    this.splashMessage('.loading-item', 'Main Interface.');

    (async() => {
      await this.initPhase(6); // Render Main Interface

      await this.modules.render.appLayout();
    })();
  }

  startApp() {
    this.splashMessage('.loading-title', 'Application loaded...');
    this.splashMessage('.loading-item', 'Consecrating.');

    (async() => {
      await this.initPhase(7); //Application Ready

      this.navigateRoot();

      await this.stopSplash();
    })();
  }
};
