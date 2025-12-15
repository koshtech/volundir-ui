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
    const adapterFile = `/lib/volundir/lib/adapters/storage/${adapterName}/adapter.js`

    const { adapter } = await import(adapterFile);

    if(namespace) {
      adapter.setNamespace(namespace);
    }

    return adapter;
  }
}
