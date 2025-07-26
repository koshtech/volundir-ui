if (!String.prototype.empty) {
  String.prototype.empty = function () {
    return this.length === 0;
  };
}

if (!String.prototype.null) {
  String.prototype.null = function () {
    return this === null;
  };
}

if (!String.prototype.blank) {
  String.prototype.blank = function () {
    return this.trim().length === 0;
  };
}

if (!String.prototype.present) {
  String.prototype.present = function () {
    return !this.blank();
  };
}

if (!String.prototype.toUp) {
  String.prototype.toUp = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };
}

console.log('  => String extension loaded.');

/*
let name = 'juca';

console.log(name.empty()); // false
console.log(name.null());  // false
console.log(name.blank()); // false
console.log(name.toUp());  // Juca

Map, Set, String, Array,  Object

*/
