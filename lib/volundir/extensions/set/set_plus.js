//
// Set Extensions
//
if (!Set.prototype.isEmpty) {
  Set.prototype.isEmpty = function () {
    return this.size === 0;
  };
}

if (!Set.prototype.present) {
  Set.prototype.present = function () {
    return !this.isEmpty();
  };
}
