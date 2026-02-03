import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileUtilsModule extends BaseModule {
  // Statically loaded modules are resolved by default
  resolved = true;

  constructor() {
    super();
  }

  async open(filePath) {
    try {
      if(this.fileExist(filePath)) {
        const objectName = this.getObjectNameFromFilePath(filePath);
        const openedFile = await fetch(filePath);

        await this.saveCache(objectName, openedFile);

        return openedFile;
      }
    } catch (error) {
      log.error(`Failed to open file: ${filePath} Error: ${error}`);
    }

    return false;
  }

  async openClass(filePath) {
    try {
      const filePathUrl = this.getFilePathUrl(filePath);

      if(await this.fileExist(filePath)) {
        const objectName  = this.getObjectNameFromFilePath(filePath);
        const openedClass = await import(filePathUrl);

        await this.saveCache(objectName, openedClass);

        return openedClass;
      }
    } catch (error) {
      log.error(`Failed to open class: ${filePath} Error: ${error}`);
    }

    return null;
  }

  async fileExist(filePath){
    let response = await fetch(filePath, { method: 'HEAD' });

    return response.ok;
  }
}
