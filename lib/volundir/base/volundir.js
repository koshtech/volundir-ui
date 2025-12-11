
// Boot Volundir System
await import('/lib/volundir/config/boot.js');

import { BaseSystem } from '/lib/volundir/base/base_system.js';

export class Volundir extends BaseSystem {
  constructor() {
    super();

    // this.baseModules = ['file', 'storage', 'configuration', 'extensions', 'interceptor', 'display', 'render'];
    this.baseModules = ['file'];

    this.miniApps = ['guilda'];

    this.initPhase = 0;

    this.app = null;
    // this.VERSION = '0.1.0-c43'

    (async () => this.init())();

  }

  async init() {
    // console.log(' => Coordinator: ', Coordinator);
    // console.log(' => Log: ', Log);

    // console.log(' => Guilda: ', Guilda);

    Logger.info('Initalizing Volundir Application...');
  }

  async run() {
    Logger.info('Starting Volundir Application...');

    await this.setInitPhase(1);

    await this.loadBaseSystem();

    // await this.laadConfigurations();

    // await this.loadAppDependencies();

    // await this.startApp();

    console.log(' [Volundir][run] this: ', this);
  }

  async loadBaseSystem() {
    await this.setInitPhase(2);

    await Coordinator.loadModules(this.baseModules);
  }

  async laadConfigurations() {

  }

  async loadApp() {

  }

  async startApp() {

  }
};
