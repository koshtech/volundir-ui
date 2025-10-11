export class JsonStorageAdapter {
  constructor(attributes = {}) {

    var data = attributes || this.attributes;
    // console.log(' [base_model] data: ', data);

    Object.assign(this, data);
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



  static async find(id) {
    const url      = `${this.storage.url}/${this.resourceName}/${id}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Error finding resource.");

    const data = await response.json();

    return new this(data);
  }
