import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileUtilsModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];

    this.resolved = true;
  }

  static async fileExist(filePath){
    try {
      const response = await fetch(filePath, { method: 'HEAD' });

      if (!response.ok) {
        console.warn(' [file_utils] File not found:', filePath);
        return false;
      }

      return true;
    } catch (error) {
      console.error(' [file_utils] Error importing file:', error);

      return false;
    }
  }
}
