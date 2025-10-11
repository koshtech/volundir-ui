import { Base } from './base.js';

export class BaseSystem extends Base {
  constructor () {
    super();
  }

  /*
    Levels:
        0 = Application not initialized
        1 = Application initialization phase started
        2 = Load Core Modules and Models
        3 = Apply Environment Configurations
        4 = Starting Background Components
        5 = Render Main Interface
        6 = Application Ready

  */
  async setInitPhase(phase = null) {
    if (phase && phase.length > 0) {
      this.initPhase = currentPhase;
    }

    if(! ['loadbaseModules', 'registerModules', 'loadCoreModels'].includes(this.initPhase)) {
      // await this.configuration.save('initPhase', this.initPhase);
    }

    Log.info(`Set initPhase: ${this.initPhase}`);
  }
}
