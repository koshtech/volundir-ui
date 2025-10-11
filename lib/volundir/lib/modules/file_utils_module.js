export class FileUtilsModule {
  constructor() {
    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';
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
