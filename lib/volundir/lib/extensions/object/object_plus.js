//
// Object Extensions
//
//
// Presence

if (!Object.prototype.empty) {
  Object.prototype.empty = function () {
    return Object.keys(this).length === 0;
  };
}

if (!Object.prototype.present) {
  Object.prototype.present = function () {
    return !this.empty();
  };
}

// Search

if (!Object.prototype.find_by_key) {
  Object.prototype.find_by_key = function (key) {
    return (this[key] ? true : false);
  };
}

// Modifications

if (!Object.prototype.toJson) {
  Object.prototype.toJson = function () {
    return JSON.stringify(this);
  };
}
