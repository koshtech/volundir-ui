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
    console.log('find: ', id);
    console.log('storage: ', this.storage);

    var URL         = this.storage['url']
    var REQUEST_URL = `${URL}/${this.resourceName}/${id}`

    const response = await fetch(REQUEST_URL);
    if (!response.ok) throw new Error("Erro ao buscar recurso");
    const data = await response.json();

    console.log('data on find: ', data);

    return new this(data);
  }

  async save() {
    const method = this.id ? 'PATCH' : 'POST';
    const url = this.id
      ? `/api/${this.constructor.resourceName}/${this.id}`
      : `/api/${this.constructor.resourceName}`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [this.constructor.resourceName]: this }),
    });

    if (!response.ok) throw new Error("Erro ao salvar");
    const data = await response.json();
    Object.assign(this, data[this.constructor.resourceName]);
  }

  async destroy() {
    const url = `/api/${this.constructor.resourceName}/${this.id}`;
    const response = await fetch(url, { method: 'DELETE' });
    if (!response.ok) throw new Error("Erro ao deletar");
  }

  static async all() {
    const response = await fetch(`/api/${this.resourceName}`);
    if (!response.ok) throw new Error('Erro ao buscar lista');
    const data = await response.json();
    return data[this.resourceName].map(attrs => new this(attrs));
  }
}

console.log('BaseModel loaded.')
