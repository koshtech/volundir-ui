import { BaseModel } from '/lib/volundir/core/base_model.js';

// Log levels:
//
// info
// notice
// warn
// error
// debugger

export class Logger extends BaseModel {
  static async info(data) {
    console.log("=> Info: ", data);

    let log = new Logger(data);
    log.level = 'info'
    await log.save();

    return true;
  }

  static async notice(data) {
    console.log("=> Notice: ", data);

    let log   = new Logger(data);
    log.level = 'notice';

    await log.save();

    return true;
  }

  static async warn(data) {
    console.log("=> Warn: ", data);

    let log   = new Logger(data);
    log.level = 'warn';

    await log.save();

    return true;
  }

  static async error(data) {
    console.log("=> Error: ", data);

    let log   = new Logger(data);
    let stack = new Error().stack;

    log.level = 'error';
    log.stack = stack;

    await log.save();

    return true;
  }

  static async debugger(data) {
    console.log("=> Debugger: ", data);

    let log   = new Logger(data);
    let stack = new Error().stack;

    log.level = 'debugger'
    log.stack = stack;

    await log.save();

    return true;
  }
}

console.log('Logger Model loaded.')
