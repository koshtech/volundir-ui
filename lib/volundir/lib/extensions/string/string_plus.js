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

// Verifications

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

if (!String.prototype.isString) {
  String.prototype.isString = function () {
    return (typeof this === 'string')
  };
}


if (!String.prototype.isArray) {
  String.prototype.isArray = function () {
    return (Array.isArray(this))
  };
}
