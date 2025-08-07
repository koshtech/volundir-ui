import { Coordinator } from '/lib/volundir/core/coordinator.js';

class StorageModule extends Coordinator {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file'];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'session';
  }

  async save(data) {
    // console.log(' [storage][save] data: ', data);

    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const attributes     = data["attributes"];
    const namespace      = attributes["namespace"] || false;

    delete attributes["namespace"];

    // console.log(" [storage][save] resourceName: ", resourceName);
    // console.log(" [storage][save] storageAdapter: ", storageAdapter);
    // console.log(" [storage][save] attributes: ", attributes);
    // console.log(" [storage][save] namespace: ", namespace);

    const adapter = await this.loadAdapter(storageAdapter, namespace);

    // console.log(' [storage] adapter: ', adapter);

    return await adapter.save(attributes);
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

  async loadAdapter(adapterName, namespace){
    const adapterFile = `/lib/volundir/adapters/storage/${adapterName}/adapter.js`

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

export const storage = new StorageModule();
