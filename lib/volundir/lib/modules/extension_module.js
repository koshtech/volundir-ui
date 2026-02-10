export class ExtensionModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    // this.requiredModules = ['storage'];
    // this.requiredModels  = ['object_register_model'];
  }

  async load() {
    const activeExtensions = {
      "array_plus":  "array/array_plus",
      "map_plus":    "map/map_plus",
      "object_plus": "object/object_plus",
      "set_plus":    "set/set_plus",
      "string_plus": "string/string_plus"
    }
    let loadedExtensions     = {};
    let registeredExtensions = {};

    for (const name of Object.keys(activeExtensions)) {
      try {
        await import(`/lib/volundir/lib/extensions/${activeExtensions[name]}.js`);
        loadedExtensions[name] = activeExtensions[name];
      } catch (err) {
        console.error(` [volundir] Error loading extension ${name}: ${err.message}`);
      }
    }

    const saveData = {};

    saveData['registeredExtensions'] = JSON.stringify(loadedExtensions);
    saveData['namespace']            = 'extensions';

    var objectRegister = new this.object_register_model(saveData);
    objectRegister.setModule('storage', this.modules.storage);

    await objectRegister.save();
  }

  // get isLoaded(){
  //   return true
  // }
}
