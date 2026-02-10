const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class BaseHub extends BaseObject {
  objectType = 'hub';

  constructor() {
    super();
  }

  async importedModulesOnLoad() {
    const fileName = `${this.constructor.name.fromPascalCaseToSnakeCase()}.js`;
    // console.log('[BaseHub][importedModulesOnLoad] fileName: ', fileName);

    const baseUrl  = this.baseUrl;
    // console.log('[BaseHub][importedModulesOnLoad] baseUrl: ', baseUrl);

    const modulePath = `/lib/volundir/lib/hubs/${fileName}`;
    // console.log('[BaseHub][importedModulesOnLoad] modulePath: ', modulePath);

    const url = new URL(modulePath, window.location.origin).href;
    // console.log('[BaseHub][importedModulesOnLoad] url: ', url);

    const moduleText = await File.read(url);
    // console.log('[BaseHub][importedModulesOnLoad] moduleText: ', moduleText);

    const classIndex = moduleText.search(/^export\s+class\s+/m);
    // console.log('[BaseHub][importedModulesOnLoad] classIndex: ', classIndex);
    const preClassText = classIndex !== -1
      ? moduleText.slice(0, classIndex)
      : moduleText;
    // console.log('[BaseHub][importedModulesOnLoad] preClassText: ',preClassText );

    const regexFileImports =
      /^\s*const\s+\w+\s*=\s*await\s+File\.import\(\s*['"]([^'"]+)['"]\s*\)\s*;?/gm;
    // console.log('[BaseHub][importedModulesOnLoad] regexFileImports: ', regexFileImports);

    const matches = [];
    let match;

    while ((match = regexFileImports.exec(preClassText)) !== null) {
      matches.push(match[0]);
    }
    // console.log('[BaseHub][importedModulesOnLoad] matches: ', matches);

    return matches.join('\n');
  }

  // get isLoaded(){
  //   return true
  // }
}
