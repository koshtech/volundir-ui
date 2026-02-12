const BaseModule = await File.import('lib/volundir/base/base_module.js');

const ConfigModel = await File.import('lib/volundir/app/models/config_model.js');

export class ConfigurationModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = ['config_model'];

    this.modules = {
      "file":  File
    };

    this.models = {
      "config_model": new ConfigModel()
    };

    // Required system modules and data models
    this.moduleFile = '/lib/volundir/config/load.modules.json';
    this.modelFile  = '/lib/volundir/config/load.models.json';

    // Main App config files
    this.configFile   = '/config/config.json';
    this.storageFile  = '/config/storage.json';
    this.routesFile   = '/config/routes.json';

    // App side modules and data models
    this.appModulesFile  = '/config/load.modules.json';
    this.appModelsFile   = '/config/load.models.json';

    this.mainConfig = ['module', 'model', 'config' , 'storage', 'routes', 'appModules', 'appModels'];

    // Loaded configurations
    this.attributes = this.attributes || {};

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  async load(){
    // console.log(' [configuration] load: ', this);

    for (const configName of this.mainConfig) {
      // console.log(' [configuration] configName: ', configName);

      let configFile = this[`${configName}File`];
      // console.log(' [configuration] configFile: ', configFile);

      let configValue = await this.modules.file.readAsJSON(configFile);

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

    var config = this.models.config_model.new(data);
    // console.log(' [configuration] config: ', config);
    // config.setModule('storage', this.storage);
    await config.save();
  }

  async get(id){
    // const data = {};

    // data['id'] = id;
    // data['namespace'] = 'configuration';

    // var response = await this.models.config_model.find(data);
    var response = await this.models.config_model.find(id);

    // console.log(' [configurations][get] response: ', response);

    return response;
  }
}
