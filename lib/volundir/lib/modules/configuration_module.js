import { BaseModule } from '/lib/volundir/base/base_module.js';
// import { ConfigModel } from '/lib/volundir/models/config.js';

export class ConfigurationModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file', 'storage'];

    // Required models
    this.requiredModels = ['config_model'];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'local_storage';

    // Required system modules and data models
    this.modulesFile = '/lib/volundir/config/load.modules.json';
    this.modelsFile  = '/lib/volundir/config/load.models.json';

    // Main App config files
    this.configFile   = '/config/config.json';
    this.storageFile  = '/config/storage.json';
    this.routesFile   = '/config/routes.json';

    // App side modules and data models
    this.appModulesFile  = '/config/load.modules.json';
    this.appModelsFile   = '/config/load.models.json';

    this.mainConfig = ['modules', 'models', 'config' , 'storage', 'routes', 'appModules', 'appModels'];

    // Loaded configurations
    this.attributes = this.attributes || {}
  }

  async load(){
    // console.log(' [configuration] load: ', this);
    // console.log(' [configuration] this.file: ', this.file);

    for (const configName of this.mainConfig) {
      // console.log(' [configuration] configName: ', configName);

      let configFile = this[`${configName}File`];
      // console.log(' [configuration] configFile: ', configFile);

      let configValue = await this.file.readJSONFile(configFile);

      await this.save(configName, configValue);
    }
  }

  async saveConfig(key, values) {
    // console.log(' [configuration] saveconfig key: ', key, ' values: ', values);
    let json_values = values;
    // console.log(' [configuration] save json_values: ', json_values);

    await this.save(key, json_values);
  }

  async save(key, values) {
    // console.log(' [configuration] this: ', this);
    // console.log(' [configuration] save config key: ', key);
    // console.log(' [configuration] values: ', values);

    const data = {};
    data[key] = values;
    data['namespace'] = 'configuration';
//
    // console.log(' [configuration] data: ', data);

    // console.log(' [configuration] config: ', config);
    // console.log(' [configuration] this.config: ', this.config);

    var config = new this.config_model(data);
    // console.log(' [configuration] config: ', config);
    config.setModule('storage', this.storage);
    await config.save();
  }

  async get(value){
    // console.log(' [configurations][get] value: ', value);
    // var config = new config();
    // config.setModule('storage', this.storage);
    // var response = config.find(value);

    const data = {};

    data['id'] = value;
    data['namespace'] = 'configuration';

    var config   = new this.config_model();
    // console.log(' [configurations][get] config: ', config);
    config.setModule('storage', this.storage);
    var response = await config.find(data);

    // console.log(' [configurations][get] response: ', response);

    return response;
  }
}
