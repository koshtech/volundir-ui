
// Boot Volundir System
await import('/lib/volundir/config/boot.js');

import { BaseSystem } from '/lib/volundir/base/base_system.js';

export class Volundir extends BaseSystem {
  constructor() {
    super();

    this.baseModules = ['file', 'storage', 'configuration', 'extensions', 'interceptor', 'display', 'render'];
    // this.baseModules = ['file'];

    this.miniApps = ['guilda'];

    (async () => this.modules = await Coordinator.loadedModules())();

    this.app = null;
    // this.VERSION = '0.1.0-c43'

    (async () => this.init())();
  }

  async init() {
    await this.initPhase(1); // Application initialization phase started

    console.log(' [Volundir][init][A] this.modules: ', this.modules);

    await this.startSplash();

    Coordinator.connect(this);

    // Logger.info('Initalizing Volundir Application...');
  }

  async run() {
    // Logger.info('Starting Volundir Application...');

    await this.preLoadComponents();

    await this.loadBaseSystem();

    await this.laadConfigurations();

    await this.loadBackgroundComponents();

    await this.loadApp();

    await this.startApp();

    // console.log(' [Volundir][run][ready] this: ', this);
  }

  async preLoadComponents() {
    await this.initPhase(2); // Starting Background Components

  }

  async loadBaseSystem() {
    await this.initPhase(3); // Load Core Modules and Models

    await Coordinator.loadModules(this.baseModules);

    // console.log(' [Volundir][loadBaseSystem][A] this.modules: ', this.modules);

    this.modules = await Coordinator.loadedModules();

    console.log(' [Volundir][loadBaseSystem][B] this.modules: ', this.modules);
  }

  async laadConfigurations() {
    await this.initPhase(4); // Apply Environment Configurations

  }

  async loadBackgroundComponents() {
    await this.initPhase(5); // Starting Background Components

    // await this.loadAppDependencies();

    await Logger.updateHandlers();
  }

  async loadApp() {
    await this.initPhase(6); // Render Main Interface

    await this.modules.render.appLayout();
  }

  async startApp() {
    await this.initPhase(7); //Application Ready

    await this.stopSplash();
  }
};
