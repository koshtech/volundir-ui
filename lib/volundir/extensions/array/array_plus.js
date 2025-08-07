//
// Array Extensions
//
if (!Array.prototype.isEmpty) {
  Array.prototype.isEmpty = function () {
    return this.length === 0;
  };
}

if (!Array.prototype.present) {
  Array.prototype.present = function () {
    return !this.isEmpty();
  };
}

if (!Array.prototype.first) {
  Array.prototype.first = function () {
    return this.length > 0 ? this[0] : undefined;
  };
}

if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : undefined;
  };
}
