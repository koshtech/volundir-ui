// console.log('===> ERRO aqui logger');
const BaseModel = await File.import('lib/volundir/base/base_model.js');

export class LoggerModel extends BaseModel {
  constructor() {
    super();

    // Model storage adapter used to save module data
    this.storageAdapter  = 'local_storage';

    // Rewrite default requirement values
    this.requiredModules = ['storage'];
    this.requiredModels  = [];

    // Defines database schema
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
