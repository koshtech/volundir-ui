const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class BaseStorageAdapter extends BaseObject {
  objectType = 'adapter';

  constructor() {
    super();

    this.ns = '';
  }

  cancanHandleNamespace() {
    return false;
  }

  // /**
  //  * Convenience factory for namespaced adapter.
  //  * @param {string} namespace
  //  */
  setNamespace(namespace = '') {
    this.ns = namespace ? String(namespace) + ':' : '';
  }

  // /**
  //  * Internal helper to build a namespaced key.
  //  * @param {string} key
  //  * @returns {string}
  //  */
  _key(key) {
    return `${this.ns}${String(key)}`;
  }

  async find(data) {
    return this.get(data);
  }

  safeSerialize(obj) {
    return JSON.stringify(obj, (key, value) => {
      // Ignore functions
      if (typeof value === 'function') return undefined;
      // Ignore class instances (heuristic: has prototype different from Object)
      if (value && typeof value === 'object' && value.constructor !== Object && !Array.isArray(value)) {
        return `[Instance of ${value.constructor.name}]`;
      }
      return value;
    });
  }
}




// (() => {
//   const entries = [];

//   function save(message, level) {
//     (async () => {
//       if (globalThis.Coordinator && typeof Coordinator.getModule === 'function') {
//         const logger = Coordinator.getModule('logger');

//         if(logger && typeof logger[level] === 'function'){
//           if(entries.length > 0 && logger.canImport()) {
//             logger.importEntries(entries, 1);
//           }

//           return logger[level](message, 1);
//         }
//       }

//       entries.push({ "message": message, "level": level});
//     })();
//   }

//   globalThis.log = {
//     info(message) {
//       save(message, 'info');
//     },

//     notice(message) {
//       save(message, 'notice');
//     },

//     warn(message) {
//       save(message, 'warn');
//     },

//     success(message) {
//       save(message, 'success');
//     },

//     error(message) {
//       save(message, 'error');
//     },

//     fatal(message) {
//       save(message, 'fatal');
//     },

//     debugger(message) {
//       save(message, 'debugger');
//     }
//   };
// })();


// (() => {
//   const entries = [];

//   function save(message, level) {
//     (async () => {
//       if (globalThis.Coordinator && typeof Coordinator.getModule === 'function') {
//         const logger = Coordinator.getModule('logger');

//         if(logger && typeof logger[level] === 'function'){
//           if(entries.length > 0 && logger.canImport()) {
//             logger.importEntries(entries, 1);
//           }

//           return logger[level](message, 1);
//         }
//       }

//       entries.push({ "message": message, "level": level});
//     })();
//   }

//   const PersonModule = class Person {
//     #name = 'Cannot be changed.';
//     #foo  = 123;
//     #internalState = { state: 'ok' };

//     constructor() {
//     }

//     get name() {
//       return this.#name;
//     }

//     set name(name) {
//       return false;
//     }

//     get foo() {
//       return this.#foo;
//     }

//     set foo(value) {
//       this.#foo = value;
//     }

//     _protectedHook() {
//       return this.#internalState;
//     }
//   }
// })();

/*
export default randomSquare;
export default function (ctx) {
  // …
}

const colors = fetch("../data/colors.json").then((response) => response.json());

export default await colors;
*/

/*

The Object.seal method will prevent property additions, still allowing the user to write to or edit the existing properties.

The Object.freeze method will completely lock an object. Objects will stay exactly as they were when you freeze them. Once an object is frozen, it cannot be unfrozen.

*/

/*

function objectHider(obj)
{
    // this.getObject=function(){return obj;}
    this.getObject=function (obj) { return $.extend({}, obj); }
}

var someData={apples:5,oranges:4}

var hider=new objectHider(someData);
*/


if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

