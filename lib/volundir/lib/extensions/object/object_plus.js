
//
// Object Extensions
//
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

if (!Object.prototype.toJson) {
  Object.prototype.toJson = function () {
    return JSON.stringify(this);
  };
}
