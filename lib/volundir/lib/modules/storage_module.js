import { BaseModule } from '/lib/volundir/base/base_module.js';

export class StorageModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';

    this.value2 = '456';
  }

  getValue2() {
    return this.value2;
  }

  async save(data) {
    // console.log(' [storage][save] data: ', data);

    this.attributes      = data["attributes"];

    // console.log(' [storage][save] this.attributes: ', this.attributes);

    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    // delete this.attributes["namespace"];

    // console.log(" [storage][save] resourceName: ", resourceName);
    // console.log(" [storage][save] storageAdapter: ", storageAdapter);
    // console.log(" [storage][save] attributes attributes[namespace]: ", this.attributes);
    // console.log(" [storage][save] namespace: ", namespace);

    const adapter = await this.loadAdapter(storageAdapter, namespace);

    // console.log(' [storage] adapter: ', adapter);

    return await adapter.save(this.attributes);
  }

  async find(data) {
    // console.log(' [storage][find] find data: ', data);

    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const attributes     = data["attributes"];
    const id             = attributes["id"];
    const namespace      = attributes["namespace"] || false;

    // console.log(' [storage] resourceName: ', resourceName);
    // console.log(' [storage] storageAdapter: ', storageAdapter);
    // console.log(' [storage] id: ', id);

    const adapter = await this.loadAdapter(storageAdapter, namespace);

    // console.log(' [storage] adapter: ', adapter);

    return await adapter.find(id);
  }

  async list(data) {
    // console.log(' [storage][list] data: ', data);

    // console.log(' [storage][list] this.attributes: ', this.attributes);

    this.attributes      = {}; //data["attributes"];


    const resourceName   = data["resourceName"];
    const attributes     = data["attributes"];
    const collection     = data["collection"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    // delete this.attributes["namespace"];

    // console.log(" [storage][list] resourceName: ", resourceName);
    // console.log(" [storage][list] storageAdapter: ", storageAdapter);
    // console.log(" [storage][list] attributes attributes[namespace]: ", this.attributes);
    // console.log(" [storage][list] namespace: ", namespace);

    const adapter = await this.loadAdapter(storageAdapter, namespace);

    // console.log(' [storage][list] adapter: ', adapter);

    return await adapter.list(data);
  }
  async loadAdapter(adapterName, namespace){
    const adapterFile = `/lib/volundir/lib/adapters/storage/${adapterName}/adapter.js`

    // console.log(' [storage][loadedAdapter] adapterFile: ', adapterFile);
    // console.log(' [storage][loadedAdapter] namespace: ', namespace);

    const { adapter, RawAdapter } = await import(adapterFile);

    let loadedAdapter;
    let LoadedRawAdapter;

    if(namespace) {
      // console.log(' [storage][loadedAdapter] if: ', namespace);

      loadedAdapter = RawAdapter.withNamespace(namespace);

      // console.log(' [storage][loadedAdapter] loadedAdapter: ', loadedAdapter);
    }
    else {
      // console.log(' [storage][loadedAdapter] else: ', namespace);
      loadedAdapter = adapter;
      // console.log(' [storage][loadedAdapter] loadedAdapter: ', loadedAdapter);
    }

    return loadedAdapter; //.adapter;
  }
}
