const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class BaseHub extends BaseObject {
  constructor() {
    super();
  }

  async importedModulesOnLoad() {
    const fileName = `${this.constructor.name.fromPascalCaseToSnakeCase()}.js`;
    const baseUrl  = this.getBaseUrl();

    const modulePath = `/lib/volundir/lib/hubs/${fileName}`;

    const url = new URL(modulePath, window.location.origin).href;

    const moduleText = await File.read(url);

    const classIndex = moduleText.search(/^export\s+class\s+/m);
    const preClassText = classIndex !== -1
      ? moduleText.slice(0, classIndex)
      : moduleText;

    const regexFileImports =
      /^\s*const\s+\w+\s*=\s*await\s+File\.import\(\s*['"]([^'"]+)['"]\s*\)\s*;?/gm;

    const matches = [];
    let match;

    while ((match = regexFileImports.exec(preClassText)) !== null) {
      matches.push(match[0]);
    }

    return matches.join('\n');
  }
}
