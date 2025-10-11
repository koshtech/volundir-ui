import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file_utils'];
  }

  async loadClass(filePath) {
    const loadedClass = await import(filePath);
    // console.log(' [HubModule][importObject] loadedClass: ', loadedClass);

    const instanceName = this.getObjectInstanceName(loadedClass);

    // console.log(' [HubModule][importObject] instanceName: ', instanceName);

    const loadedObject = new loadedClass[instanceName];
    // console.log(' [HubModule][importObject] loadedObject: ', loadedObject);


    return loadedObject;
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
    // console.log('===> readFile: ', filePath);
    try {
      let response = await this.read(filePath);

      return response.text();
    } catch (error) {
      // console.error('Failed to read page:', error);
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
