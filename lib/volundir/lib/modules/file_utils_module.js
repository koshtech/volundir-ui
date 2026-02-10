import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileUtilsModule extends BaseModule {

  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
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
    // try {
      // console.log('[FileUtilsModule][openedClass] filePath: ', filePath);
      const filePathUrl = this.getFilePathUrl(filePath);

      // console.log('[FileUtilsModule][openedClass] filePathUrl: ', filePathUrl);

      if(await this.fileExist(filePath)) {
        // console.log('[FileUtilsModule][openedClass] fileExist: ', await this.fileExist(filePath));
        const objectName  = this.getObjectNameFromFilePath(filePath);
        // console.log('[FileUtilsModule][openedClass] objectName: ', objectName);

        const openedClass = await import(filePathUrl);
        // console.log('[FileUtilsModule][openedClass] openedClass: ', openedClass);

        await this.saveCache(objectName, openedClass);

        // console.log('[FileUtilsModule][openedClass] saveCache!');

        return openedClass;
      }



    return null;
  }

  async fileExist(filePath){
    let response = await fetch(filePath, { method: 'HEAD' });

    return response.ok;
  }
}
