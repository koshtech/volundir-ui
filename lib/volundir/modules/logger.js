import { BaseModel } from '/lib/volundir/base/base_model.js';

// Log levels:
//
// none
// production
// staging
// requests
// storage
// app
// development
// errors
// debugger

class LoggerModule extends BaseModel {
  constructor() {
    super();
  }

  activity(){


    Logger.info({
      date: "2025-07-04 01:01:01",
      event: "Volundir Application Started.",
      description: "The Volundir Application MyTestApp was completely loaded and started."
    });

  }

  static async info(data) {
    // console.log("=> Info: ", data);

    let log = new Logger(data);
    log.level = 'info'
    await log.save();

    return true;
  }

  static async notice(data) {
    // console.log("=> Notice: ", data);

    let log   = new Logger(data);
    log.level = 'notice';

    await log.save();

    return true;
  }

  static async warn(data) {
    // console.log("=> Warn: ", data);

    let log   = new Logger(data);
    log.level = 'warn';

    await log.save();

    return true;
  }

  static async error(data) {
    // console.log("=> Error: ", data);

    let log   = new Logger(data);
    let stack = new Error().stack;

    log.level = 'error';
    log.stack = stack;

    await log.save();

    return true;
  }

  static async debugger(data) {
    // console.log("=> Debugger: ", data);

    let log   = new Logger(data);
    let stack = new Error().stack;

    log.level = 'debugger'
    log.stack = stack;

    await log.save();

    return true;
  }
}

export const logger = new LoggerModule();

// console.log('Logger Model loaded.')
