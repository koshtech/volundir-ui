import { BaseModule } from '/lib/volundir/base/base_module.js';
import { FileUtilsModule } from '/lib/volundir/lib/modules/file_utils_module.js';

export class FileModule extends FileUtilsModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file_utils'];
  }



  async loadClass(filePath) {
    const readedClass  = await this.openClass(filePath);
    const instanceName = this.getObjectInstanceName(readedClass);

    return new readedClass[instanceName];
  }

  async readJSON(filePath) {
    try {
      var response = await this.open(filePath);

      return await response.json();
    } catch (error) {
      console.error('Error details:', error);

      return false;
    }
  }
}
