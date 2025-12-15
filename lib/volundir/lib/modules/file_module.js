import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file_utils'];
  }

  async readClass(filePath) {
    // console.log(' [FileModule][readClass] filePath: ', filePath);
    const readedClass = await import(filePath);
    // console.log(' [FileModule][readClass] readedClass: ', readedClass);

    return readedClass;
  }

  async loadClass(filePath) {
    // const loadedClass = await import(filePath);
    const readedClass = await this.readClass(filePath);
    // console.log(' [FileModule][loadClass] readedClass: ', readedClass);

    const instanceName = this.getObjectInstanceName(readedClass);

    // console.log(' [FileModule][loadClass] instanceName: ', instanceName);

    const loadedClass = new readedClass[instanceName];
    // console.log(' [FileModule][loadClass] loadedClass: ', loadedClass);


    return loadedClass;
  }

  async read(filePath) {
    // console.log('===> readFile: ', filePath);
    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not read ${filePath}`);
      }

      return response;
    } catch (error) {
      // console.error('Failed to read page:', error);
      return false;
    }
  }

  async readFile(filePath) {
    // console.log(' [file] ===> readFile: ', filePath);
    try {
      let response = await this.read(filePath);

      return response.text();
    } catch (error) {
      console.error('Failed to read file:', error);
      return false;
    }
  }

  async readJSONFile(filePath) {
    // console.log('readJSONFile:', filePath);
    var content  = false;

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
}
