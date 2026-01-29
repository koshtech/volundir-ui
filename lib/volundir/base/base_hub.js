import { BaseObject } from '/lib/volundir/base/base_object.js';

export class BaseHub extends BaseObject {
  constructor() {
    super();
  }

  async importedModulesOnLoad() {

    // console.log(' [ModuleHub][importedModulesOnLoad] name: ', this.constructor.name.toPascalCaseToSnakeCase());
    // console.log(' [ModuleHub][importedModulesOnLoad] this.metaUrl: ', this.metaUrl);

    const fileName = `${this.constructor.name.toPascalCaseToSnakeCase()}.js`;
    // console.log(' [ModuleHub][importedModulesOnLoad] fileName: ', fileName);

    const modulePath = `/lib/volundir/lib/hubs/${fileName}`;
    // console.log(' [ModuleHub][importedModulesOnLoad] modulePath: ', modulePath);

    // const url = import.meta.url;
    const url = new URL(modulePath, window.location.origin).href;
    // console.log(' [ModuleHub][importedModulesOnLoad] url: ', url);

    const response = await fetch(url);
    // console.log(' [ModuleHub][importedModulesOnLoad] response: ', response);

    const moduleText = await response.text();
    // console.log(' [ModuleHub][importedModulesOnLoad] moduleText: ', moduleText);

    const regexImports = /^import\s+[\s\S]*?from\s+['"](.*?)['"];/gm;
    // console.log(' [ModuleHub][importedModulesOnLoad] regexImports: ', regexImports);

    const parsedModuleText = moduleText.replace(regexImports, (match, importPath) => {
      // console.log(' [ModuleHub][importedModulesOnLoad] replace: match: ', match);
      // console.log(' [ModuleHub][importedModulesOnLoad] replace: importPath: ', importPath);

      if (importPath && !importPath.startsWith('http')) {
        // console.log(' [ModuleHub][importedModulesOnLoad] !importPath.startsWith(http)');

        const absoluteUrl = new URL(importPath, window.location.origin).href;

        // console.log(' [ModuleHub][importedModulesOnLoad] absoluteUrl: ', absoluteUrl);

        const returnMatch = match.replace(importPath, absoluteUrl);

        // console.log(' [ModuleHub][importedModulesOnLoad] returnMatch: ', returnMatch);

        return returnMatch;
      }

      // console.log(' [ModuleHub][importedModulesOnLoad] final match: ', match);

      return match;
    });
    // console.log(' [ModuleHub][importedModulesOnLoad] parsedModuleText: ', parsedModuleText);

    const matches = parsedModuleText.match(/^import\s+[\s\S]*?from\s+['"].*?['"];/gm);
    // console.log(' [ModuleHub][importedModulesOnLoad] matches: ', matches);

    const returnMatches = matches ? matches.join('\n') : '';
    // console.log(' [ModuleHub][importedModulesOnLoad] returnMatches: ', returnMatches);

    return returnMatches;
  }
}
