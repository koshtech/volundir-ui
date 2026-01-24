import { Base } from './base.js';

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
}
