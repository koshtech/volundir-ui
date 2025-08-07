export class ModelCollection {
  constructor(items = []) {
    this.items = items;
  }

  first() {
    return this.items[0];
  }

  last() {
    return this.items[this.items.length - 1];
  }

  total() {
    return this.items.length;
  }

  size() {
    return this.total();
  }

  toArray() {
    return this.items;
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }

  map(callback) {
    return this.items.map(callback);
  }
}
