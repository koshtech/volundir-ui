import { ModelCollection } from './collection_model.js';

export class BaseModel {
  constructor(attributes = {}) {
    Object.assign(this, attributes);
  }

  static get storage () {
    var _storage        = JSON.parse(sessionStorage.getItem('storage'));
    var _default_source = _storage['default'];

    return _storage[_default_source];
  }

  static get resourceName() {
    return this.name.toLowerCase() + 's';
  }

  static async find(id) {
    const url      = `${this.storage.url}/${this.resourceName}/${id}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Error finding resource.");

    const data = await response.json();

    return new this(data);
  }

  async save() {
    const method = this.id ? 'PATCH' : 'POST';
    const url = this.id
      ? `${this.constructor.storage.url}/${this.constructor.resourceName}/${this.id}`
      : `${this.constructor.storage.url}/${this.constructor.resourceName}`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify({ [this.constructor.resourceName]: this }),
      body: JSON.stringify({ ...this }),
    });

    if (!response.ok) throw new Error("Error saving data.");
    const data = await response.json();
    Object.assign(this, data[this.constructor.resourceName]);
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

  static async all() {
    const url = `${this.storage.url}/${this.resourceName}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Error getting list.');

    const data = await response.json();

    // console.log('data on find: ', data);

    return new ModelCollection(data.map(attrs => new this(attrs)));;
  }
}

// console.log('BaseModel loaded.')
