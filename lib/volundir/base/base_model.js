import { CollectionModel } from './collection_model.js';
// import { Validator } from '/lib/volundir/modules/validator.js';
import { BaseObject } from '/lib/volundir/base/base_object.js';

export class BaseModel extends BaseObject {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['storage'];
    this.requiredModels  = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';

    // Default resource name for data storage
    this.resourceName = this.constructor.name.replace("Model", "").pascalCaseToSnakeCase() + 's';

    this.attributes = {};

    this.collection = [];
  }

  // not inuse right now
  static async find(id) {
    // console.log(" [base_model][static find] this: ", this);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      id: id
    }

    // console.log(" [base_model][static find] data: ", data);
    // console.log(" [base_model][static find] this.storage: ", this.storage);

    const response = this.modules.storage.find(data);

    if (response) {
      Object.assign(this, data[this.constructor.resourceName]);

      return response;
    }

    console.error("Error finding data.");
    return false;
  }

  async find(attributes) {
    // console.log(" [base_model][find] this: ", this);
    // console.log(" [base_model][find] attributes: ", attributes);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      attributes: attributes
    }

    // console.log(" [base_model][find] data: ", data);
    // console.log(" [base_model][find] this.storage: ", this.storage);

    const response = this.modules.storage.find(data);

    if (response) {
      Object.assign(this, data[this.constructor.resourceName]);

      return response;
    }

    console.error("Error finding data.");
    return false;
  }

  new(attributes={}) {
    this.attributes = attributes;

    return Object.create(this);
  }

  async save() {
    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      attributes: this.attributes,
      namespace: `${this.resourceName}_${this.storageAdapter}`
    };

    var response = await this.modules.storage.save(data);

    // console.log(" [base_model][save] response returned: ", response);

    // if (response) {
      // Object.assign(this, data[this.constructor.resourceName]);

      // this.attributes = {}

      // return true;
      return response;
    // }

    // console.error("Error saving data.");
    // return false;
  }

  async update(attributes = {}) {
    Object.assign(this, attributes);
    await this.save();
  }

  async destroy() {
    if (!this.id) throw new Error("ID is required to delete.");

    const url = `${this.constructor.storage.url}/${this.constructor.resourceName}/${this.id}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) throw new Error("Error deleting.");
  }

  // async all() {
  //   const url = `${this.storage.url}/${this.resourceName}`;

  //   const response = await fetch(url);

  //   if (!response.ok) throw new Error('Error getting list.');

  //   const data = await response.json();

  //   // console.log('data on find: ', data);

  //   return new CollectionModel(data.map(attrs => new this(attrs)));;
  // }

  async list() {
    // console.log(" [base_model][list] this: ", this);
    // console.log(" [base_model][list] attributes: ", this.attributes);
    // console.log(" [base_model][list] collection: ", this.collection);
    // console.log(" [base_model][list] this.storage: ", this.storage);
    // console.log(" [base_model][list] this.resourceName: ", this.resourceName);

    this.attributes = {};
    // console.log(" [base_model][list] attributes reseted: ", this.attributes);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      attributes: this.attributes,
      collection: this.collection,
      namespace: `${this.resourceName}_${this.storageAdapter}`
    };

    // console.log(" [base_model][list] data: ", data);

    // (async () => {
    //   const response = await this.modules.storage.save(data)

    //   console.log(" [base_model][list] response on async: ", response);
    // })();

    const response = await this.modules.storage.list(data)
    // console.log(" [base_model][list] response returned: ", response);

    // response = JSON.parse(response);

    // console.log(" [base_model][list] response json: ", response);

    // console.log(" [base_model][list] this: ", this);

    const ModelClass = this; // captura a classe

    const normalized = Array.isArray(response)
      ? response
      : Object.values(response);

    const collection = new CollectionModel(
      normalized.map(attrs => this.new(attrs))
    );

    // const collection = Object.values(response)
    //   .map(json => JSON.parse(json))
    //   .map(attrs => new this(attrs));


    // return new CollectionModel(collection);


    // const rawItems = Object.values(response);

    // const parsed = rawItems.map(item => {
    //   if (typeof item === 'string') {
    //     try {
    //       return JSON.parse(item);
    //     } catch(e) {
    //       console.error("Invalid JSON in storage item:", item);
    //       return null;
    //     }
    //   }
    //   return item;
    // }).filter(x => x);

    // return new CollectionModel(parsed.map(attrs => new this(attrs)));


    // return new CollectionModel(response.map(attrs => new this(attrs)));;
    // console.log(" [base_model][list] collection: ", collection);

    return collection;
  }
}
