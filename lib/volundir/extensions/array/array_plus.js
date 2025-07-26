Array.prototype.isEmpty = function() {
  return this.length === 0;
};

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.last = function() {
  return this[this.length - 1];
};
