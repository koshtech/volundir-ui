//
// Set Extensions
//
if (!Set.prototype.empty) {
  Set.prototype.empty = function () {
    return this.size === 0;
  };
}

if (!Set.prototype.present) {
  Set.prototype.present = function () {
    return !this.empty();
  };
}
