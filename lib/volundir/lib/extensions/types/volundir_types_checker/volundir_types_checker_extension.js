const TypeChecks = {
  isString: v => typeof v === 'string',
  isNumber: v => typeof v === 'number' && !Number.isNaN(v),
  isBoolean: v => typeof v === 'boolean',
  isBigInt: v => typeof v === 'bigint',
  isSymbol: v => typeof v === 'symbol',

  isNull: v => v === null,
  isUndefined: v => v === undefined,

  isArray: v => Array.isArray(v),
  isObject: v => v !== null && typeof v === 'object',

  isDate: v => v instanceof Date && !isNaN(v),
  isFunction: v => typeof v === 'function',
  isClass: v => typeof v === 'function' && /^class\s/.test(v.toString()),

  isJson: v => {
    if (typeof v !== 'string') return false;
    try {
      JSON.parse(v);
      return true;
    } catch {
      return false;
    }
  },

  present: v => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return true;
  },

  // Aliases to TypeChecks.present();
  isBlank(v) {
    return TypeChecks.present(v);
  }
};

// Method aliases alternative
// TypeChecks.isText = TypeChecks.isString;


Object.defineProperties(Object.prototype,
  Object.fromEntries(
    Object.entries(TypeChecks).map(([name, fn]) => [
      name,
      {
        value: function () {
          return fn(this);
        },
        writable: false,
        enumerable: false
      }
    ])
  )
);
