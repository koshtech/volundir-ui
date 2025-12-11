import { ModelCollection } from './collection_model.js';
// import { Validator } from '/lib/volundir/modules/validator.js';
import { BaseObject } from '/lib/volundir/base/base_object.js';

export class BaseModel extends BaseObject {
  constructor() {
    super();

    // Default resource name for data storage
    this.resourceName = this.constructor.name.replace("Model", "").pascalCaseToSnakeCase() + 's';

    this.attributes = {};

    this.collection = [];
  }

  static async find(id) {
    // console.log(" [base_model][static find] this: ", this);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      id: id
    }

    // console.log(" [base_model][static find] data: ", data);
    // console.log(" [base_model][static find] this.storage: ", this.storage);

    const response = this.storage.find(data);

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

    const response = this.storage.find(data);

    if (response) {
      Object.assign(this, data[this.constructor.resourceName]);

      return response;
    }

    console.error("Error finding data.");
    return false;
  }

  new(attributes={}) {
    this.attributes = attributes;

    // Object.assign(this, this.attributes);

    // console.log('==>> new# attributes: ', attributes);

    return this;
  }

  async save() {
    // console.log(" [base_model][save] this: ", this);
    // console.log(" [base_model][save] attributes: ", this.attributes);
    // console.log(" [base_model][save] this.storage: ", this.storage);
    // console.log(" [base_model][save] this.resourceName: ", this.resourceName);

    const data = {
      resourceName: this.resourceName,
      storageAdapter: this.storageAdapter,
      attributes: this.attributes,
      namespace: `${this.resourceName}_${this.storageAdapter}`
    };

    // console.log(" [base_model][save] data: ", data);

    // (async () => {
    //   const response = await this.modules.storage.save(data)

    //   console.log(" [base_model][save] response on async: ", response);
    // })();

    var response = await this.modules.storage.save(data)

    // console.log(" [base_model][save] response returned: ", response);

    // if (response) {
      // Object.assign(this, data[this.constructor.resourceName]);

      return true;
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

  //   return new ModelCollection(data.map(attrs => new this(attrs)));;
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

    var response = await this.modules.storage.list(data)

    // console.log(" [base_model][list] response returned: ", response);

    return response;
  }
}
