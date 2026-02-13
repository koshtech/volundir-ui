import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileUtilsModule extends BaseModule {
  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  async open(filePath) {
    let openedFile  = null;
    // try {
      if(this.fileExist(filePath)) {
        const key = this.keyFromFilePath(filePath);

        if(await this.modules.file_cache.isCached(key)) {
          // const objectName = this.getObjectNameFromFilePath(filePath);
          openedFile = await fetch(filePath);
        }
        else {
          // console.log('[FileUtilsModule][import] isNotCached');
          if(await this.fileExist(filePath)) {
            // console.log('[FileUtilsModule][import] fileExist');

            openedFile     = await fetch(filePath);
            // aqui deve ser algo como
            // this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/base/base_model.js'), BaseModel)

            await this.modules.file_cache.save(key, openedFile)
          // await this.saveObject(objectName, openedFile);
          }
        }
      }
    // } catch (error) {
    //   log.error(`Failed to open file: ${filePath} Error: ${error}`);
    // }

    return openedFile;
  }

  async import(filePath) {
    // console.log('[FileUtilsModule][import] filePath: ',filePath );
    let importedFile   = null;
    let importedObject = null;

    // try {
      const filePathUrl = this.getFilePathUrl(filePath);
      // console.log('[FileUtilsModule][import] filePathUrl: ', filePathUrl);

      const key         = this.keyFromFilePath(filePath);
      // console.log('[FileUtilsModule][import] key: ', key);

      if(await this.modules.file_cache.isCached(key)) {
        // console.log('[FileUtilsModule][import] isCached');
        importedObject = await this.modules.file_cache.cache(key);
        // console.log('[FileUtilsModule][import] cached importedObject: ', importedObject);
      }
      else {
        // console.log('[FileUtilsModule][import] isNotCached');
        if(await this.fileExist(filePath)) {
          // console.log('[FileUtilsModule][import] fileExist');

          const objectName  = this.getObjectNameFromFilePath(filePath);
          // console.log('[FileUtilsModule][import] objectName: ', objectName);

          importedFile   = await import(filePathUrl);
          // console.log('[FileUtilsModule][import] importedFile: ', importedFile);

          importedObject = importedFile[objectName];
          // console.log('[FileUtilsModule][import] loaded importedObject: ', importedObject);

          this.modules.file_cache.save(key, importedObject);
        }
      }
    // } catch (error) {
    //   // log.error(`Failed to import class file: ${filePath} Error: ${error}`);
    //   console.error(`Failed to import class file: ${filePath} Error: ${error}`);
    // }

    // console.log('[FileUtilsModule][import] final importedObject: ', importedObject);

    return importedObject;
  }

  async fileExist(filePath){
    let response = await fetch(filePath, { method: 'HEAD' });

    return response.ok;
  }
}
