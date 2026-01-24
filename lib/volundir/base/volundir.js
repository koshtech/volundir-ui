
// Boot Volundir System
await import('/lib/volundir/config/boot.js');

import { BaseSystem } from '/lib/volundir/base/base_system.js';

export class Volundir extends BaseSystem {
  modules = [];

  constructor() {
    super();

    this.baseModules = ['file', 'storage', 'configuration', 'extensions', 'interceptor', 'display', 'render'];

    this.miniApps = ['guilda'];

    this.app = null;
    // this.VERSION = '0.1.0-c43'

    console.log(' [Volundir][constructor][A] this.modules: ', this.modules);

    this.init();
  }

  init() {
    (async() => {
      await this.initPhase(1); // Application initialization phase started

      this.modules = await Coordinator.loadedModules();

      console.log(' [Volundir][init][B] this.modules: ', this.modules);

      await this.startSplash();

      this.splashMessage('.loading-title', 'Loading...');

      // Coordinator.connect(this);

      // Logger.info('Initalizing Volundir Application...');

      await this.run();
    })();
  }

  async run() {
    console.log(' [Volundir][init][C] this.modules: ', this.modules);

    // Logger.info('Starting Volundir Application...');

    await this.preLoadComponents();

    await this.loadBaseSystem();

    await this.laadConfigurations();

    await this.loadBackgroundComponents();

    this.loadApp();

    this.startApp();

    // console.log(' [Volundir][run][ready] this: ', this);
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

    // console.log(' [Volundir][loadBaseSystem][A] this.modules: ', this.modules);

    this.modules = await Coordinator.loadedModules();

    console.log(' [Volundir][loadBaseSystem][D] this.modules: ', this.modules);
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

      console.log(' [Volundir][loadBaseSystem][E] this.modules: ', this.modules);
    })();
  }
};
