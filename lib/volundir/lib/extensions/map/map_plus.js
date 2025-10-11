//
// Map Extensions
//
if (!Map.prototype.empty) {
  Map.prototype.empty = function () {
    return this.size === 0;
  };
}

if (!Map.prototype.present) {
  Map.prototype.present = function () {
    return !this.empty();
  };
}
