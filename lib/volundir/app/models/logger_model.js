import { BaseModel } from '/lib/volundir/base/base_model.js';

export class LoggerModel extends BaseModel {
  constructor() {
    super();

    // Model storage adapter used to save module data
    this.storageAdapter  = 'local_storage';

    this.requiredModules = ['storage'];
    this.requiredModels  = [];

    this.schema = [
      {
        column: 'id',
        type: 'timestamp',
        validate: {
          presense: true,
          dataType: 'timestamp',
          format: 'timestamp',
          uniq: true
        }
      },
      {
        column: 'entry',
        type: 'JSON',
        validate: {
          presense: true,
          dataType: 'JSON',
          format: 'JSON',
          uniq: false
        }
      }
    ]
  }
}
