import { Coordinator } from '/lib/volundir/core/coordinator.js';

class FileUtilsModule extends Coordinator {
  constructor(attributes = {}) {
    super();

    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';

    // console.log(' [file] file_utils: ', file_utils);

    // this.file_utils = file_utils;
  }

  static async loadClass(filePath) {
    const loadedClass = await import(filePath);

    return loadedClass;
  }

  async read(filePath) {
    // console.log('===> readFile: ', filePath);
    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not read ${filePath}`);
      }

      return await response;
    } catch (error) {
      // console.error('Failed to read page:', error);
      return false;
    }
  }

  async readFile(filePath) {
    // console.log('===> readFile: ', filePath);
    try {
      const response = await this.read(filePath);

      return await response.text();
    } catch (error) {
      // console.error('Failed to read page:', error);
      return false;
    }
  }

  async readJSONFile(filePath) {
    // console.log('readJSONFile:', filePath);
    var content  = null;

    try {
      var response = await this.read(filePath);
      // console.log('readJSONFile response:', response);
      content = await response.json();

    } catch (error) {
      console.error('Error details:', error);

    } finally {
      // console.log('readJSONFile done:', filePath);
    }
    // console.log("content: ", content);

    return content;
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

export const file_utils = new FileUtilsModule();
