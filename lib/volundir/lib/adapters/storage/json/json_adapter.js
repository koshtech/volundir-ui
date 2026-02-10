const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class JsonAdapter extends BaseObject {
  constructor(attributes = {}) {
    super();

    var data = attributes || this.attributes;

    Object.assign(this, data);
  }

  canHandleNamespace() {
    return false;
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

    return true;
  }

  async find(data) {
    // console.log(` [JsonStorageAdapter][find] data: `, data);

    const id = data["id"];
    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    const url = `${this.baseUrl}api/${resourceName}/${id}`;

    // console.log(' [JsonStorageAdapter][find] url: ', url);

    // const attributes      = data["attributes"];


    const response = await fetch(url);

    // console.log(' [JsonStorageAdapter][find] response: ', response);
    if (!response.ok) throw new Error("Error finding resource.");

    const results = await response.json();
    // console.log(' [JsonStorageAdapter][find] results: ', results['response']);

    return results['response'];
  }

  async list(data) {
    // console.log(` [JsonStorageAdapter][list] data: `, data);

    // const id = data["id"];
    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    const url = `${this.baseUrl}api/${resourceName}`;

    // console.log(' [JsonStorageAdapter][list] url: ', url);

    // const attributes      = data["attributes"];


    const response = await fetch(url);

    // console.log(' [JsonStorageAdapter][list] response: ', response);
    if (!response.ok) throw new Error("Error finding resource.");

    const results = await response.json();
    // console.log(' [JsonStorageAdapter][list] results: ', results['response']);

    return results['response'];
  }
}
