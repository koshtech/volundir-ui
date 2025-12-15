export class CollectionModel {
  constructor(collection = []) {
    this.collection = collection;
  }

  first() {
    return this.collection[0];
  }

  last() {
    return this.collection[this.collection.length - 1];
  }

  total() {
    return this.collection.length;
  }

  size() {
    return this.total();
  }

  toArray() {
    return this.collection;
  }

  [Symbol.iterator]() {
    return this.collection[Symbol.iterator]();
  }

  map(callback) {
    return this.collection.map(callback);
  }
}
