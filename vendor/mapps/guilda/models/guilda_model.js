// console.log('===> ERRO aqui logger');
// import { BaseModel } from '/lib/volundir/base/base_model.js';

export class GuildaModel extends BaseModel {
  constructor() {
    super();

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
