//
// String Extensions
//
// Presence

if (!String.prototype.empty) {
  String.prototype.empty = function () {
    return this.length === 0;
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

// Modifications

if (!String.prototype.capitalize) {
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };
}

// Object.defineProperty(String.prototype, 'capitalize', {
//   value: function() {
//     // 'this' refers to the string instance on which the method is called
//     return this.charAt(0).toUpperCase() + this.slice(1);
//   },
//   writable: true,      // allows the property to be changed later
//   configurable: true,  // allows the property descriptor to be changed and the property to be deleted
//   enumerable: false    // hides the property during enumeration
// });

if (!String.prototype.downCase) {
  String.prototype.downCase = function () {
    return this.toLowerCase();
  };
}

if (!String.prototype.singularize) {
  String.prototype.singularize = function () {
    const endings = {
      ves: 'fe',
      ies: 'y',
      i: 'us',
      zes: 'ze',
      ses: 's',
      es: 'e',
      s: ''
    };

    return this.replace(
      new RegExp(`(${Object.keys(endings).join('|')})$`),
      r => endings[r]
    );
  };
}

if (!String.prototype.toPascalCase) {
  String.prototype.toPascalCase = function () {
    return this.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };
}

if (!String.prototype.fromPascalCaseToSnakeCase) {
  String.prototype.fromPascalCaseToSnakeCase = function() {
    // Use a regular expression to find uppercase letters that are not at the beginning
    // and replace them with an underscore followed by the lowercase version of the letter.
    // Then, convert the entire string to lowercase.
    return this.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }
}

// Receives: String => 'hub_cache_module'
// Returns: String without the part of the last underline => 'hub_cache'
if (!String.prototype.withoutSpecifier) {
  Object.defineProperty(String.prototype, 'withoutSpecifier', {
    value: function() {
      return this
        .split('_')
        .filter(Boolean)
        .slice(0, -1)
        .join('_');
    },
  writable: true,      // allows the property to be changed later
  configurable: true,  // allows the property descriptor to be changed and the property to be deleted
  enumerable: false    // hides the property during enumeration
  });
}

// Usage
// const text = "hello world";
// console.log(text.capitalize()); // Output: "Hello world"

if (!String.prototype.specifier) {
  String.prototype.specifier = function () {
    return this.fromPascalCaseToSnakeCase(this).split('_').last();
  };
}

// Type verifications

// Primitive Types

// string
// number (includes integers and floating-point numbers)
// bigint
// boolean
// undefined
// null
// symbol


if (!String.prototype.isString) {
  String.prototype.isString = function () {
    return (typeof this === 'string')
  };
}

if (!String.prototype.isNumber) {
  String.prototype.isNumber = function () {
    return (typeof this === 'number')
  };
}

// bigint
// boolean
// undefined / null
// symbol


if (!String.prototype.isObject) {
  String.prototype.isObject = function () {
    return (typeof this === 'object')
  };
}


if (!String.prototype.isArray) {
  String.prototype.isArray = function () {
    return (Array.isArray(this))
  };
}

if (!String.prototype.isJson) {
  String.prototype.isJson = function () {
    try {
      JSON.parse(this);
      return true;
    } catch (e) {
      return false;
    }
  };
}





