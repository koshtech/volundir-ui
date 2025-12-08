import { BaseModule } from '/lib/volundir/base/base_module.js';

const filters = {
  uppercase: str => String(str).toUpperCase(),
  lowercase: str => String(str).toLowerCase(),
  capitalize: str => String(str).charAt(0).toUpperCase() + str.slice(1),
  json: val => JSON.stringify(val),
};

export class RenderModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['file', 'storage', 'timer'];

    // Required models
    this.requiredModels = ['config_model'];

    // Module storage adapter use to save internal data
    this.storageAdapter = 'session';

    this._selectedInterfaceAdapter = 'volundir';
    this._selectedInterfaceCode    = 'vld';
    this._selectedInterfacePath    = '/lib/volundir/adapters/interface/volundir'
    this._selectedLayout           = 'application'
    this._selectedLayoutPath       = `layouts/${this._selectedLayout}.html`;

    this.defaultStylePath          = `${this._selectedInterfacePath}/assets`;
    this.defaultStyleFilePath      = `${this.defaultStylePath}/volundir-ui.css`;
  }

  getSelectedInterfaceAdapter() {
    return this._selectedInterfaceAdapter;
  }

  getSelectedInterfaceCode() {
    return this._selectedInterfaceCode;
  }

  appLayout(){
    // console.log(' [render][appLayout] Ok');

    this.renderLayout();
  }

  async renderLayout(_layout='', context={}, isPartial = false) {
    // this.selectedInterface();

    let layoutFile = _layout;

    if(layoutFile.blank()){
      layoutFile = this._selectedLayoutPath;
    }

    // console.log('_layout: ', _layout);

    this.loadLayout(layoutFile).then(htmlText => {

      htmlText = htmlText.replace(/{{load_asset\s*([\w./-]+)\s*}}/g, (_, assetFileName) => {
        return `${this._selectedInterfacePath}/assets/${assetFileName}`;
      });


      const parser = new DOMParser();
      const layout = parser.parseFromString(htmlText, 'text/html');

      const currentHead = document.head;
      const newHeadTags = layout.head.children;

      for (let tag of newHeadTags) {
        const tagSelector = tag.outerHTML.replace(/>.*<\/.*?>/, '>');

        let exists = false;
        for (let currentTag of currentHead.children) {
          if (currentTag.isEqualNode(tag)) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          currentHead.appendChild(tag.cloneNode(true));
        }
      }

      const newBody = layout.body;
      const container = document.querySelector('#main-app-container');

      if (!container) {
        console.error("#main-app-container not found.");
        return;
      }

      container.innerHTML = newBody.innerHTML;

      container.className = newBody.className;

    }).catch(error => {
      console.error("Error loading layout:", error);
    });

    // const layoutFile = _layout.empty() ? this.loadLayout(this._selectedLayoutPath) : _layout;

    // layout = layout.replace(/{{load_asset\s*([\w./-]+)\s*}}/g, (_, assetFileName) => {
    //   return `${this._selectedInterfacePath}assets/${assetFileName}`;
    // });

    // const splash = document.querySelector('#splash-screen') || document.body;
  }

  selectedInterface() {
    let _interface  = JSON.parse(sessionStorage.getItem('configuration'))['interface'];

    this._selectedInterfaceAdapter = _interface['adapter'];
    this._selectedInterfaceCode    = _interface['code'];
    this._selectedInterfacePath    = `/lib/volundir/adapters/interface/${this._selectedInterfaceAdapter}/`
    this._selectedLayout           = _interface['layouts']['main'];
    this._selectedLayoutPath       = `layouts/${this._selectedLayout}.html`;
  }

  async loadLayout(layout, customPath = null) {
    // customPath overrides default interface path entirely
    const basePath = customPath || `/app/views/${this._selectedInterfaceCode}/layouts/`;

    return await this.loadTemplate(page, basePath)
  }

  async find_or_create_element(elementID, elementOptions = {}, elementName = null) {
    let elementObject = document.getElementById(elementID);

    if (!elementObject) {
      elementObject = document.createElement('div');
      elementObject.id = elementID;

      const resolvedName = elementName || elementID.replace(/[-_]/g, ' ');
      elementObject.setAttribute('name', resolvedName);

      if (elementOptions && typeof elementOptions === 'object') {
        for (const [key, value] of Object.entries(elementOptions)) {
          if (key === 'data' && typeof value === 'object') {
            for (const [dataKey, dataValue] of Object.entries(value)) {
              elementObject.dataset[dataKey] = dataValue;
            }
          } else {
            elementObject.setAttribute(key, value);
          }
        }
      }

      document.body.appendChild(elementObject);
    }

    return elementObject;
  }

/**
 * find_or_create_element_from_template
 * -------------------------------------------------------
 * Ensures the target element exists, loads the corresponding
 * stylesheet (if present), loads an HTML template, parses it,
 * and replaces the target element's inner content.
 *
 * This method prevents multiple CSS injections by checking if
 * the stylesheet already exists in <head>.
 *
 * @async
 * @param {string} elementID
 *        ID of the target DOM element.
 *
 * @param {string} template
 *        Template filename (without extension).
 *
 * @param {string|null} customPath
 *        Override for the base path used to load templates
 *        and stylesheets.
 *
 * @param {object} elementOptions
 *        Optional attributes applied when creating the element.
 *
 * @param {string|null} elementName
 *        Optional HTML name for the element.
 *
 * @returns {Promise<HTMLElement>}
 *        Final DOM element after rendering.
 */
  async find_or_create_element_from_template(elementID, template, customPath, elementOptions = {}, elementName = null) {
    const basePath = customPath || `/app/views/${this.getSelectedInterfaceCode()}/`;

    const elementObject = await this.find_or_create_element(
      elementID,
      elementName,
      elementOptions
    );

    if (!elementObject) {
      console.error(`#${elementID} not found.`);
      return null;
    }

    const templateHTML = await this.loadTemplate(template, basePath);

    const parser = new DOMParser();
    const doc = parser.parseFromString(templateHTML, 'text/html');

    const loadedTemplate = doc.body.firstElementChild;

    if (!loadedTemplate) {
      console.error(`Template "${template}" is empty or invalid.`);
      return elementObject;
    }

    elementObject.innerHTML = "";
    elementObject.replaceWith(loadedTemplate);

    return loadedTemplate;
  }


  async renderTemplate(template, context, isPartial = false) {
    if (!isPartial) {
      template = await this.processForms(template, context);
    }

    template = await this.replaceAsync(template, /{{\s*include\s+(.+?)\s*}}/g, async (_, expr) => {
      try {
        let path = this.evaluateExpression(expr.trim(), context);
        if (!path || path.includes('undefined')) {
          // console.warn('invalid include path:', expr, context);
          return '';
        }

        const includedTemplate = await this.loadFromInterface(path);

        return await this.renderTemplate(includedTemplate, context, true); // true = isPartial

      } catch (err) {
        // console.warn('Error processing include:', expr, 'context:', context, 'error:', err.message);
        return '';
      }
    });

    // {{each item in list}}...{{end}}
    template = template.replace(/{{each\s+(\w+)\s+in\s+([a-zA-Z0-9_.]+)}}([\s\S]*?){{end}}/g, (_, itemVar, listExpr, innerTemplate) => {
      const list = this.getValue(listExpr, context);
      if (!Array.isArray(list)) return '';

      return list.map(item => {
        const loopScope = { ...context, [itemVar]: item };
        let rendered = innerTemplate;

        // if/elseif/else/endif
        rendered = rendered.replace(/{{if\s+([^}]+)}}([\s\S]*?){{endif}}/g, (_, firstCondition, fullBlock) => {
          const block = `{{if ${firstCondition}}}${fullBlock}{{endif}}`;
          const parts = [];
          const regex = /{{(if|elseif)\s+([^}]+)}}|{{else}}|{{endif}}|([\s\S]*?)(?={{(if|elseif|else|endif)|$)/g;
          let match;

          while ((match = regex.exec(block)) !== null) {
            if (match[1] === 'if' || match[1] === 'elseif') {
              parts.push({ type: match[1], condition: match[2].trim(), content: '' });
            } else if (match[0] === '{{else}}') {
              parts.push({ type: 'else', content: '' });
            } else if (match[0] === '{{endif}}') {
              break;
            } else if (match[3]) {
              if (parts.length > 0) {
                parts[parts.length - 1].content += match[3];
              }
            }
          }

          for (const part of parts) {
            if (part.type === 'if' || part.type === 'elseif') {
              if (this.evaluateCondition(part.condition, loopScope)) {
                return part.content;
              }
            } else if (part.type === 'else') {
              return part.content;
            }
          }

          return '';
        });

        // Var filters inside the loop
        rendered = rendered.replace(/{{{\s*([\w.]+)\s*}}}/g, (_, key) => {
          return this.getValue(key, loopScope) ?? '';
        });

        rendered = rendered.replace(/{{\s*([\w.]+(?:\s*\|\s*\w+)*)\s*}}/g, (_, expr) => {
          return this.escapeHtml(this.applyFilters(expr, loopScope, true));
        });

        return rendered;
      }).join('');
    });

    // {{if cond}}...{{endif}}
    template = template.replace(/{{if\s+([^}]+)}}([\s\S]*?){{endif}}/g, (_, firstCondition, fullBlock) => {
      const block = `{{if ${firstCondition}}}${fullBlock}{{endif}}`;
      const parts = [];
      const regex = /{{(if|elseif)\s+([^}]+)}}|{{else}}|{{endif}}|([\s\S]*?)(?={{(if|elseif|else|endif)|$)/g;
      let match;

      while ((match = regex.exec(block)) !== null) {
        if (match[1] === 'if' || match[1] === 'elseif') {
          parts.push({ type: match[1], condition: match[2].trim(), content: '' });
        } else if (match[0] === '{{else}}') {
          parts.push({ type: 'else', content: '' });
        } else if (match[0] === '{{endif}}') {
          break;
        } else if (match[3]) {
          if (parts.length > 0) {
            parts[parts.length - 1].content += match[3];
          }
        }
      }

      for (const part of parts) {
        if (part.type === 'if' || part.type === 'elseif') {
          if (this.evaluateCondition(part.condition, context)) {
            return part.content;
          }
        } else if (part.type === 'else') {
          return part.content;
        }
      }

      return '';
    });

    // {{{ raw }}}
    template = template.replace(/{{{\s*([\w.]+)\s*}}}/g, (_, key) => {
      return this.getValue(key, context) ?? '';
    });

    // {{vars | filters}}
    template = template.replace(/{{\s*([\w.]+(?:\s*\|\s*\w+)*)\s*}}/g, (_, expr) => {
      return this.escapeHtml(this.applyFilters(expr, context, true));
    });

    // console.log('=======>>>>>> template load_asset?: ', template);

    template = template.replace(/{{load_asset\s*([\w.\-]+)\s*}}/g, (_, assetFileName) => {
      // Construct the full asset path
      // You can customize '/assets/' if your base path is different
      // console.log('=>>>>>>>>>>> load_asset!');
      // return `/assets/${assetFileName}`;
      return `/lib/volundir/adapters/interface/${this._selectedInterfaceAdapter}/assets/${assetFileName}`;
    });

    return template;
  }

  /**
   * loadTemplate
   * -------------------------------------------------------
   * Loads a template file from the interface view directory.
   * If a customPath is provided, it fully overrides the
   * default base path used for template resolution.
   *
   * @async
   * @param {string} page
   *        The filename (or relative path) of the template
   *        that should be loaded.
   *
   * @param {string|null} customPath
   *        Optional custom base path. When present, this
   *        value replaces the default "/app/views/<interface>/"
   *        path entirely.
   *
   * @returns {Promise<string>}
   *        The file contents of the requested template.
   *
   * @example
   * // Loads "/app/views/admin/dashboard.html"
   * loadTemplate("dashboard.html");
   *
   * @example
   * // Loads "/custom/base/path/dashboard.html"
   * loadTemplate("dashboard.html", "/custom/base/path/");
   */
  async loadTemplate(template, customPath = null) {
    const basePath = customPath || `/app/views/${this.getSelectedInterfaceCode()}`;

    const templatePath = `${basePath}/${template}.html`;

    console.log(' [render] templatePath: ',templatePath );

    const loadedTemplate = await this.modules.file.readFile(templatePath);

    console.log(' [render] loadedTemplate: ',loadedTemplate );

    return loadedTemplate;
  }

  async loadFromInterface(template) {
    const templatePath = `/lib/volundir/adapters/interface/${this._selectedInterfaceAdapter}/${template}`;

    return await this.file.readFile(templatePath);
  }

  async loadStylesheet(fileName, customPath = null) {
    const basePath = customPath || this.defaultStylePath;

    const stylesheetPath = `${basePath}/${this.getSelectedInterfaceCode()}/${fileName}`;

    Log.debugger(stylesheetPath);

    if (!document.querySelector(`link[data-template-style="${stylesheetPath}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = stylesheetPath;
      link.dataset.templateStyle = stylesheetPath;
      document.head.appendChild(link);

      try {
        await new Promise(resolve => {
          link.onload = resolve;
          link.onerror = resolve;
        });
      } catch (_) {}
    }
  }

  getValue(key, scope) {
    const parts = key.split('.');
    let value = scope;

    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) return '';
    }

    return value;
  }

  applyFilters(expr, context, escape = true) {
    // console.log('=======> applyFilters')
    const parts = expr.split('|').map(s => s.trim());
    let value = this.getValue(parts[0], context);

    for (let i = 1; i < parts.length; i++) {
      const filter = filters[parts[i]];
      if (typeof filter === 'function') {
        value = filter(value);
      }
    }

    return value ?? '';
  }

  async processForms(template, context) {
    const formRegex = /{{form\s+(["'])(.+?)\1\s+([\s\S]*?)}}([\s\S]*?){{end_form}}/g;

    return await this.replaceAsync(template, formRegex, async (_, quote, formName, rawAttrs, innerContent) => {
      let attrs        = this.parseAttributes(rawAttrs, context);
      let formAttrsStr = Object.entries(attrs)
        .map(([key, val]) => `${key}="${val}"`)
        .join(' ');

      let formTemplate = await this.loadFromInterface(`forms/${formName}.html`);
      let formBody = await this.processFormFields(innerContent, context);

      // console.log('==> form  attrs: ', attrs);
      // console.log('    formAttrsStr: ', formAttrsStr);
      // console.log('    formTemplate: ', formTemplate);
      // console.log('    formBody: ', formBody);

      return await this.renderTemplate(formTemplate, {
        ...context,
        form: attrs,
        form_attrs: formAttrsStr,
        form_body: formBody
      });
    });
  }

  async processFormFields(template, context) {
    // console.log('context recebido em form:', JSON.stringify(context, null, 2));

    // {{field "email", value="...", class="..." }}
    template = await this.replaceAsync(template, /{{field\s+"([^"]+)"([\s\S]*?)}}/g, async (_, fieldName, rawAttrs) => {
      const attrs = this.parseAttributes(rawAttrs, context);
      const type  = attrs.type || 'text';
      attrs.name  = fieldName;
      attrs.value = attrs.value ?? this.getValue(`user.${fieldName}`, context);

      attrs['data_attrs'] = Object.entries(attrs)
        .filter(([k]) => k.startsWith('data-'))
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');

      // console.log(' attrs: ', attrs)
      // console.log(' data_attrs: ', attrs['data_attrs'])
      // console.log(' processFormFields: attrs', attrs);
      // console.log(' type: ', type);

      const fieldTemplate = await this.loadFromInterface(`forms/field_${type}.html`);

      return await this.renderTemplate(fieldTemplate, { ...context, field: attrs });
    });

    // {{button 'button_submit', 'text', class="btn"}}
    template = await this.replaceAsync(
      template,
      /{{button\s+(.*?)}}/g,
      async (_, rawAttrs) => {
        const attrs = this.parseAttributes(rawAttrs, context);
        attrs.label = attrs.value ?? '';
        delete attrs.value;

        const btnTemplate = await this.loadFromInterface(`components/button_submit.html`);
        return await this.renderTemplate(btnTemplate, { ...context, button: attrs });
      }
    );

    // Link: {{link_to '/', 'Cancelar', class="btn"}}
    template = await this.replaceAsync(
      template,
      /{{link_to\s+(.*?)}}/g,
      async (_, rawAttrs) => {
        const attrs = this.parseAttributes(rawAttrs, context);
        attrs.label = attrs.value ?? '';
        delete attrs.value;

        const linkTemplate = await this.loadFromInterface(`components/link_to.html`);
        return await this.renderTemplate(linkTemplate, { ...context, link: attrs });
      }
    );

    return template;
  }

  parseAttributes(attrStr, context) {
    const attrs = {};
    // const regex = /(\w+)=("(.*?)"|'(.*?)'|[^\s]+)/g;
    const regex = /([\w-]+)=("(.*?)"|'(.*?)'|[^\s]+)/g;

    let match;

    while ((match = regex.exec(attrStr))) {
      const key = match[1];
      let rawValue = match[3] ?? match[4] ?? match[2];

      if ((rawValue?.startsWith('"') && rawValue.endsWith('"')) ||
          (rawValue?.startsWith("'") && rawValue.endsWith("'"))) {
        rawValue = rawValue.slice(1, -1);
      }

      // expression, method or .variable
      if (/^[\w.]+\([^()]*\)$/.test(rawValue) || /^[\w.]+$/.test(rawValue)) {
        try {
          rawValue = this.evaluateExpression(rawValue, context);
        } catch (e) {
          // console.warn(`Erro ao avaliar expressão '${rawValue}':`, e.message);
        }
      }

      if (rawValue === 'true') rawValue = true;
      else if (rawValue === 'false') rawValue = false;
      else if (!isNaN(rawValue) && rawValue !== '') rawValue = Number(rawValue);

      attrs[key] = rawValue;
    }

    // console.log('=====>>>> parseAttributes: attrs', attrs);

    // actions via generatePath
    if (attrs.action && typeof attrs.action === 'string') {
      const actionName = attrs.action;
      const params     = attrs.params ?? '';

      // console.log('=====>>>> parseAttributes: params', params);

      // Ex: "user.id"
      let id = null;
      if (attrs.id !== undefined) {
        try {
          id = this.evaluateExpression(attrs.id, context);
        } catch (e) {
          // console.warn("ID is not present: ", e.message);
        }
      }

      const routeMatch = actionName.match(/^(\w+)_([\w]+)_path$|^([\w]+)_path$/);

      if (routeMatch) {
        let action = 'index';
        let resource = '';

        if (routeMatch[1] && routeMatch[2]) {
          action = routeMatch[1];
          resource = routeMatch[2];
        } else if (routeMatch[3]) {
          action = 'create';
          resource = routeMatch[3];
        }

        attrs.action = this.generatePath(resource, action, id, params);
      }
    }

    return attrs;
  }

  async replaceAsync(str, regex, asyncFn) {
    const matches = [];
    str.replace(regex, (...args) => {
      matches.push(asyncFn(...args));
      return '';
    });
    const results = await Promise.all(matches);
    return str.replace(regex, () => results.shift());
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  evaluateCondition(expr, context) {
    const operators = ['==', '!=', '>=', '<=', '>', '<'];
    let operator = null;

    for (const op of operators) {
      if (expr.includes(op)) {
        operator = op;
        break;
      }
    }

    if (!operator) {
      // Ex. {{if user.active}}
      return !!this.getValue(expr.trim(), context);
    }

    const [leftRaw, rightRaw] = expr.split(operator).map(s => s.trim());

    const left = this.getValue(leftRaw, context);
    let right;

    if ((rightRaw.startsWith("'") && rightRaw.endsWith("'")) || (rightRaw.startsWith('"') && rightRaw.endsWith('"'))) {
      right = rightRaw.slice(1, -1);
    } else if (!isNaN(rightRaw)) {
      right = Number(rightRaw);
    } else if (rightRaw === 'true' || rightRaw === 'false') {
      right = rightRaw === 'true';
    } else {
      right = this.getValue(rightRaw, context);
    }

    switch (operator) {
      case '==': return String(left) == String(right);
      case '!=': return String(left) != String(right);
      case '>=': return left >= right;
      case '<=': return left <= right;
      case '>':  return left > right;
      case '<':  return left < right;
      default: return false;
    }
  }

  evaluateExpression(expr, context) {
    // Ex: 'forms/field_' + field.type + '.html'
    // console.log('evaluateExpression expr: ', expr)
    // console.log('context: ', context)
    const scope = new Proxy(context, {
      get(target, prop) {
        return prop in target ? target[prop] : window[prop];
      }
    });

    return (new Function(...Object.keys(scope), `return ${expr}`))(...Object.values(scope));
  }

  static async populate(selectEl) {
    // console.log('========> populate');
    // console.log(' ==> selectEl: ', selectEl);

    const model       = selectEl.dataset.model;
    const modelIdAttr = selectEl.dataset.modelId || 'value';
    const params      = selectEl.dataset.modelParams || '';
    const targetName  = selectEl.dataset.target;
    const valueKey    = selectEl.dataset.targetValue || 'id';
    const textKey     = selectEl.dataset.targetText || 'name';

    const selectedValue = selectEl.value;

    // console.log(' model: ', model);
    // console.log(' modelIdAttr: ', modelIdAttr);
    // console.log(' params: ', params);
    // console.log(' targetName: ', targetName);
    // console.log(' valueKey: ', valueKey);
    // console.log(' textKey: ', textKey);
    // console.log(' selectedValue: ', selectedValue);

    const modelFileName = model.toLowerCase();
    // const className     = this.toPascalCase(model);
    const className     = Object.keys(model)[0];

    const loadedModule = await import(`/app/models/${modelFileName}.js`);
    // const loadedModel = await import('/app/models/user.js');
    const ModelClass = loadedModule[className];

    // console.log(' modelFileName: ', modelFileName);
    // console.log(' className: ', className);
    // console.log(' loadedModule: ', loadedModule);
    // console.log(' ModelClass: ', ModelClass);

    const response = await ModelClass.all();
    // const response = await loadedModel.User.all();

    // console.log(' response: ', response.items);

    // const list = response.toArray();
    const list = response.items;


    const target = document.querySelector(`[name="${targetName}"]`);
    if (!target) return;

    target.innerHTML = '';
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item[valueKey];
      opt.textContent = item[textKey];
      target.appendChild(opt);
    });

    // Optional helper
    const helperName = selectEl.dataset.helper;
    const helperParam = selectEl.dataset.helperParam;

    if (helperName && typeof window[helperName] === 'function') {
      window[helperName](selectEl, target, list, helperParam);
    }
  }

  // static toPascalCase(str) {
  //   return str
  //     .replace(/[-_](.)/g, (_, c) => c.toUpperCase()) // trata snake/kebab
  //     .replace(/^(.)/, (_, c) => c.toUpperCase());
  // }
}
