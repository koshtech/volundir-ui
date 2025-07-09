import { BaseModel } from '/lib/volundir/core/base_model.js';

export class Logger extends BaseModel {
  static async notice(data) {
    console.log("=> Notice: ", data);

    let log = new Logger(data);
    await log.save();

    return true;
  }
}

console.log('Logger Model loaded.')
