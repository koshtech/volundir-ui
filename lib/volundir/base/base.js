export class Base {
  constructor () {

    /*
      propagateTo valid values
      [
        'all',          // Entire system components
        'extensions',   // System extensions
        'handlers',     // Data handlers
        'models',       // Data models
        'controllers',  // Controllers
        'modules'       // Modules
      ]
    */

    this.propagateToValues = [];

    this.propagateTo = [];

    /*
      accessibleFrom valid values
      [
        'public',       // Entire application
        'application'   // The application side
        'mapps',        // Only Mini Applications
        'base',         // Base Volundir System
        'extensions',   // System extensions
        'handlers',     // Data handlers
        'models',       // Data models
        'controllers',  // Controllers
        'modules'       // Modules
      ]
    */
    this.accessibleFromValues = [
      'public',       // Entire application
      'application',  // The application side
      'mapps',        // Only Mini Applications
      'base',         // Base Volundir System
      'extensions',   // System extensions
      'handlers',     // Data handlers
      'models',       // Data models
      'controllers',  // Controllers
      'modules'       // Modules
    ];

    // Array with valid and default accessible system components
    this.accessibleFrom = ['public'];
  }

  // argumentValues() {
  //   let returnedValues = {};

  //   if (arguments.length === 0) {
  //     throw new TypeError("At least one string is required");
  //   }

  //   for (const arg of arguments) {
  //     if (arg.length > longest.length) {
  //       returnedValues = arg;
  //     }
  //   }

  //   return returnedValues;
  // }


  // myTest(objectFunction, seconds=1, timeout=60, attemps=3);
}
