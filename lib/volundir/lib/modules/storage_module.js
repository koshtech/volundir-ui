import { BaseModule } from '/lib/volundir/base/base_module.js';

export class StorageModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];

    this.resolved = true;
  }

  getValue2() {
    return this.value2;
  }

  async save(data) {
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    const adapter = await this.loadAdapter(storageAdapter, namespace);

    return await adapter.save(data);
  }

  async find(data) {
    // console.log(' [storage][find] find data: ', data);

    // const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || null;
    // const id             = data["id"];

    // console.log(' [storage][find] resourceName: ', resourceName);
    // console.log(' [storage][find] storageAdapter: ', storageAdapter);
    // console.log(' [storage][find] id: ', id);

    const adapter = await this.loadAdapter(storageAdapter, namespace);

    // console.log(' [storage][find] adapter: ', adapter);

    return await adapter.find(data);
  }

  async list(data) {
    // console.log(' [storage][list] data: ', data);
    // console.log(' [storage][list] this.attributes: ', this.attributes);

    // this.attributes      = {}; //data["attributes"];

    const resourceName   = data["resourceName"];
    // const attributes     = data["attributes"];
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

  async loadAdapter(adapterName, namespace=null){
    const adapterFile = `lib/volundir/lib/adapters/storage/${adapterName}/${adapterName}_adapter.js`
    let loadedAdapter = null;

    // console.log(" [StorageModule][loadAdapter] adapterName: ", adapterName);
    // console.log(" [StorageModule][loadAdapter] namespace: ", namespace);
    // console.log(" [StorageModule][loadAdapter] adapterFile: ", adapterFile);

    // const { adapter } = await import(adapterFile);

    const loadedClass = await File.import(adapterFile);

    // const loadingAdapter = loadedClass.default;
    // console.log('[StorageModule][loadAdapter] loadingAdapter: ', loadingAdapter);

    loadedAdapter = new loadedClass();
    // console.log('[StorageModule][loadAdapter] loadedAdapter: ', loadedAdapter);

    if(loadedAdapter.canHandleNamespace()) {
      loadedAdapter.setNamespace(namespace);
    }

    return loadedAdapter;
  }
}
