//
// Map Extensions
//
if (!Map.prototype.isEmpty) {
  Map.prototype.isEmpty = function () {
    return this.size === 0;
  };
}

if (!Map.prototype.present) {
  Map.prototype.present = function () {
    return !this.isEmpty();
  };
}
