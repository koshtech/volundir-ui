import { BaseModule }    from '/lib/volundir/base/base_module.js';
import { StorageModule } from '/lib/volundir/lib/modules/storage_module.js';
import { LoggerModel }   from '/lib/volundir/app/models/logger_model.js';

// Log levels:
//
// info
// notice
// warn
// success
// error
// fatal
// debugger

export class LoggerModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['storage'];

    // Required models
    this.requiredModels = ['logger_model'];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';

    this.handlers = [];
    this.readers = [];
    this.levels = ['info', 'notice', 'warn', 'success', 'error', 'fatal', 'debugger'];
    this.currentLevel = 'info';

    // file/token substrings to ignore when scanning stack
    this.ignoreList = [
      'guilda',                            // Guilda Tool Kit
      'guilda_module',                     // Guilda System Module
      'panel_controller',                  // Guilda Panel Controller
      'logger'                             // Volundir Built in Logger
                                           // Logger wil not log it self
    ];

    this.modules = {
      "storage": new StorageModule()
    };

    this.models = {
      "logger_model": new LoggerModel()
    };

    this.init(); // populate loaded modules dependencies
  }

  init() {
    this.models['logger_model']['modules']['storage'] = this.modules['storage'];

    globalThis.Log = this.models.logger_model
  }

  info(message) {
    return this.save(message, 'info', 1);
  }

  notice(message) {
    return this.save(message, 'notice', 1);
  }

  warn(message) {
    return this.save(message, 'warn', 1);
  }

  success(message) {
    return this.save(message, 'success', 1);
  }

  error(message) {
    return this.save(message, 'error', 1);
  }

  fatal(message) {
    message = ` [FATAL] ${message}`;

    this.save(message, 'error', 1);

    throw new Error(message);

    return false;
  }

  debugger(message) {
    return this.save(message, 'debugger', 1);
  }

  save(message, level = 'info', depth = 0) {
    if(message.blank()) return;

    this.setLevel(level);

    const caller = this.#getCaller(depth + 1); // +1 to skip this.save frame
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...caller
    };

    this.handlers.forEach((handler) => handler(entry));

    return true;
  }

  async registerHandler(handler) {
    // console.log(' ===> registerHandler : handler', handler);

    this.handlers.push(handler);

    // console.log(' ===> registerHandler : this.handlers', this.handlers);

  }

  async updateHandler(handlerName) {
    console.log(' ===> registerHandler: handlerName: ', handlerName);

    const logs = await this.readers[0]();
    console.log(' ===> registerHandler: logs: ', logs);

    console.log(' ===> registerHandler: this.handlers: ', this.handlers);

    const handler = this.handlers[1];
    console.log(' ===> registerHandler: handler: ', handler);

    for(let log in logs) {
      let entry = JSON.parse(logs[log]);

      console.log(' ===> registerHandler for: log: ', entry);

      handler(entry);
    }
  }

  registerReader(reader) {
    this.readers.push(reader);

    // console.log(' ===> registerReader : reader', reader);
    // console.log(' ===> registerReader : this.readers', this.readers);
  }

  setIgnoreList(list) {
    if (!Array.isArray(list)) return;
    this.ignoreList = list.slice();
  }

  setLevel(level) {
    if (!this.levels.includes(level)) return;

    if (this.levels.indexOf(level) == this.levels.indexOf(this.currentLevel)) return;

    this.currentLevel = level;
  }

  /**
   *Private Methods
   */

  /**
   * getCaller(depth = 0)
   * - Uses navigator.userAgent to decide how to parse stack lines.
   * - Skips frames that match ignoreList.
   * - Returns { class, method, file, line, column }
   */
  #getCaller(depth = 0) {
    // detect browser engine
    const ua = (typeof navigator !== "undefined" && navigator.userAgent) ? navigator.userAgent : "";
    const isFirefox = /\bFirefox\/\d+/i.test(ua);
    const isEdgeChromium = /\bEdg\/\d+/i.test(ua); // Microsoft Edge (Chromium)
    const isChrome = /\bChrome\/\d+/i.test(ua) && !isEdgeChromium && !isFirefox;
    const isSafari = /\bSafari\/\d+/i.test(ua) && !isChrome && !isEdgeChromium && !isFirefox;

    // get raw stack
    const err = new Error();
    const raw = err.stack || "";
    const rawLines = raw.split("\n").map(l => l.trim()).filter(Boolean);

    // drop leading "Error" line sometimes present
    if (rawLines[0] && /^error\b/i.test(rawLines[0])) {
      rawLines.shift();
    }

    // helper to check ignore
    const shouldIgnore = (line) => {
      const low = (line || "").toLowerCase();
      for (const token of this.ignoreList) {
        if (!token) continue;
        if (low.includes(token.toLowerCase())) return true;
      }
      return false;
    };

    // parsing functions
    const parseChromeLike = (line) => {
      // examples:
      // at Class.method (http://host/path/file.js:23:16)
      // at Object.<anonymous> (file.js:1:2)
      // at /path/file.js:23:16
      const chromeFull = /^\s*at (?:new\s+)?(?:(.*?)\.)?([^\s(]+)\s*\((.*?):(\d+):(\d+)\)\s*$/;
      const chromeAnon = /^\s*at (.*?):(\d+):(\d+)\s*$/;
      let m = line.match(chromeFull);
      if (m) {
        return {
          className: m[1] || null,
          methodName: m[2] || null,
          file: (m[3] || "").split("/").pop(),
          line: parseInt(m[4], 10) || 0,
          column: parseInt(m[5], 10) || 0,
          raw: line
        };
      }
      m = line.match(chromeAnon);
      if (m) {
        return {
          className: null,
          methodName: "<anonymous>",
          file: (m[1] || "").split("/").pop(),
          line: parseInt(m[2], 10) || 0,
          column: parseInt(m[3], 10) || 0,
          raw: line
        };
      }
      return null;
    };

    const parseFirefoxLike = (line) => {
      // examples:
      // func@http://host/path/file.js:23:16
      // Class.method@file.js:23:16
      // Class/<@file.js:18:23
      // @file.js:3:11
      const ffFull = /^(?:(.*?)@)?(.+):(\d+):(\d+)$/;
      const m = line.match(ffFull);
      if (!m) return null;
      const token = (m[1] || "").trim(); // may be 'Class.method' or 'method' or 'Class/<'
      const file = (m[2] || "").split("/").pop();
      const ln = parseInt(m[3], 10) || 0;
      const col = parseInt(m[4], 10) || 0;

      let className = null;
      let methodName = null;

      if (token.includes(".")) {
        const parts = token.split(".");
        methodName = parts.pop();
        className = parts.join(".") || null;
      } else if (token.includes("/")) {
        // e.g. "Class/<"
        className = token.split("/")[0] || null;
        methodName = "<anonymous>";
      } else if (token) {
        methodName = token;
      } else {
        methodName = "<anonymous>";
      }

      return {
        className,
        methodName,
        file,
        line: ln,
        column: col,
        raw: line
      };
    };

    // Build parsed frames array (skip logger internals)
    const frames = [];
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      if (!line) continue;
      // try UA-specific parse first
      let parsed = null;
      if (isFirefox) parsed = parseFirefoxLike(line);
      else parsed = parseChromeLike(line) || parseFirefoxLike(line); // chrome-like first, fallback firefox-like

      // if parsed but should ignore, skip; if not parsed keep raw for fallback
      if (parsed) {
        if (shouldIgnore(parsed.raw)) continue;
        frames.push(parsed);
      } else {
        // fallback: raw line, skip if matches ignore
        if (shouldIgnore(line)) continue;
        frames.push({
          className: null,
          methodName: null,
          file: null,
          line: 0,
          column: 0,
          raw: line
        });
      }
    }

    // if no frames, return unknown
    if (!frames.length) {
      return { class: "Unknown", method: "Unknown", file: "Unknown", line: 0, column: 0 };
    }

    // pick target frame by depth; ensure index exists
    let index = depth;
    if (index < 0) index = 0;
    if (index >= frames.length) index = frames.length - 1;

    let frame = frames[index];

    // Heuristic: firefox often has method on earlier line and class on next line
    if ((isFirefox || !frame.className) && frame.methodName && (!frame.className || frame.className === null)) {
      // look forward up to 3 frames for a class-like token
      for (let j = index + 1; j <= index + 3 && j < frames.length; j++) {
        const f2 = frames[j];
        if (!f2) continue;
        // f2.className present?
        if (f2.className) {
          frame.className = frame.className || f2.className;
          break;
        }
        // sometimes methodName is capitalized class candidate
        if (f2.methodName && /^[A-Z]\w+/.test(f2.methodName)) {
          frame.className = f2.methodName;
          break;
        }
      }
    }

    return {
      class: frame.className || "Unknown",
      method: frame.methodName || "Unknown",
      file: frame.file || "Unknown",
      line: frame.line || 0,
      column: frame.column || 0
    };
  }

  #wrap(obj, fn) {
    const name = fn.name;

    return async (...args) => {
      const ctx = this.#getCaller();
      this.save("info", `Call ${obj.constructor.name}.${name}()`, ctx);

      const result = await fn.apply(obj, args);

      this.save("info", `Return ${obj.constructor.name}.${name}()`, {
        ...ctx,
        result
      });

      return result;
    };
  }
}
