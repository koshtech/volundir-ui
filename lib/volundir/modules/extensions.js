import { Coordinator } from '/lib/volundir/core/coordinator.js';

class ExtensionsModule extends Coordinator {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file', 'storage'];
    this.requiredModels  = ['object_register_model'];
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

    // console.log(` [volundir] activeExtensions: ${Object.keys(activeExtensions).length} - registeredExtensions: ${Object.keys(registeredExtensions).length}`);

    // console.log(' [volundir] Loading extensions...', this);

    for (const name of Object.keys(activeExtensions)) {
      try {
        await import(`/lib/volundir/extensions/${activeExtensions[name]}.js`);
        loadedExtensions[name] = activeExtensions[name];
        // console.log(` [volundir] Extension ${name} loaded.`)
      } catch (err) {
        console.error(` [volundir] Error loading extension ${name}: ${err.message}`);
      }
    }

    // console.log(' [volundir] Extensions loaded:', loadedExtensions);
    // this.configuration.save('registeredExtensions', JSON.stringify(loadedExtensions));

    const saveData = {};

    saveData['registeredExtensions'] = JSON.stringify(loadedExtensions);
    saveData['namespace']            = 'extensions';

    var objectRegister = new this.object_register_model(saveData);
    objectRegister.setModule('storage', this.storage);

    // let findResult = await objectRegister.find(saveData);

    await objectRegister.save();


    // console.log(' [volundir] sessionStorage Extensions:', JSON.parse(sessionStorage.getItem('registeredExtensions')));
  }
}

export const extensions = new ExtensionsModule();
