
import { BaseModel } from '/lib/volundir/core/base_model.js';

const filters = {
  uppercase: str => String(str).toUpperCase(),
  lowercase: str => String(str).toLowerCase(),
  capitalize: str => String(str).charAt(0).toUpperCase() + str.slice(1),
  json: val => JSON.stringify(val),
};

export class Render extends BaseModel {
  constructor() {
    super();
    // console.log('Render loaded.');
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

  selectedInterface() {
    // Todo: Settings must have its class
    let _settings        = JSON.parse(sessionStorage.getItem('settings'));
    // console.log('  => settings: ', _settings);

    // console.log('  => interface: ', interface);
    let _interface = _settings['interface']; // || 'volundir';
    // console.log('  => interface: ', _interface);

    return _interface;
  }

  renderLayout(layout, context, isPartial = false) {
    let _interface = this.selectedInterface();

    layout = layout.replace(/{{load_asset\s*([\w./-]+)\s*}}/g, (_, assetFileName) => {
      // Get current selected interface adapter
      return `/lib/volundir/adapters/interface/${_interface["adapter"]}/assets/${assetFileName}`;
    });

    return layout;
  }

  async renderTemplate(template, context, isPartial = false) {

    if (!isPartial) {
      // console.log('renderTemplate ! isPartial: ', isPartial)
      // console.log('renderTemplate ! template: ', template)
      // console.log('renderTemplate ! context: ', context)

      template = await this.processForms(template, context);
    }

    // {{form 'form_name'}}...{{end_form}}
    // console.log('renderTemplate include: isPartial', isPartial)
    template = await this.replaceAsync(template, /{{\s*include\s+(.+?)\s*}}/g, async (_, expr) => {
      try {
        // console.log('renderTemplate include: template', template)
        // console.log('renderTemplate include: expr', expr)
        // console.log('renderTemplate include: context', context)

        let path = this.evaluateExpression(expr.trim(), context);

        // console.log('renderTemplate path: ', path);

        if (!path || path.includes('undefined')) {
          // console.warn('include com path inválido:', expr, context);
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
      return `/lib/volundir/adapters/interface/${_interface["adapter"]}/assets/${assetFileName}`;
    });

    return template;
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
    const className     = this.toPascalCase(model);

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

  static toPascalCase(str) {
    return str
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase()) // trata snake/kebab
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  }

  async loadTemplate(page) {
    // console.log('===> loadTemplate(page): ', page);
    const templatePath = "/app/views/" + page;

    // console.log('loadTemplate: ', templatePath)
    return await this.loadFile(templatePath)
  }

  async loadFromInterface(template) {
    // console.log('===> loadFromInterface(template): ', template);
    const templatePath = `/lib/volundir/adapters/interface/${this.selectedInterface()["adapter"]}/${template}`;

    // console.log('loadFromInterface: ', templatePath);
    return await this.loadFile(templatePath);
  }

  async loadFile(templatePath) {
    // console.log('===> loadFile(templatePath): ', templatePath);
    try {
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not load ${templatePath}`);
      }

      return await response.text();

    } catch (error) {
      // console.error('Failed to load page:', error);
      return `<p>Failed to load page due to error: ${error.message}</p>`;
    }
  }
}
