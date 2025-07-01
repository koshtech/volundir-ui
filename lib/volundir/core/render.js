const filters = {
  uppercase: str => String(str).toUpperCase(),
  lowercase: str => String(str).toLowerCase(),
  capitalize: str => String(str).charAt(0).toUpperCase() + str.slice(1),
  json: val => JSON.stringify(val),
};

export class Render {
  constructor() {
    console.log('Render loaded.');
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

  async renderTemplate(template, context, isPartial = false) {
    // {{form 'form_name'}}...{{end_form}}
    console.log('renderTemplate include: isPartial', isPartial)

    if (!isPartial) {
      console.log('renderTemplate ! isPartial: ', isPartial)
      console.log('renderTemplate ! template: ', template)
      console.log('renderTemplate ! context: ', context)

      template = await this.processForms(template, context);
    }

    template = await this.replaceAsync(template, /{{\s*include\s+(.+?)\s*}}/g, async (_, expr) => {
      try {
        console.log('renderTemplate include: template', template)
        console.log('renderTemplate include: expr', expr)
        console.log('renderTemplate include: context', context)

        let path = this.evaluateExpression(expr.trim(), context);

        console.log('renderTemplate path: ', path);

        if (!path || path.includes('undefined')) {
          console.warn('include com path inválido:', expr, context);
          return '';
        }

        const includedTemplate = await this.loadFromInterface(path);

        return await this.renderTemplate(includedTemplate, context, true); // true = isPartial

      } catch (err) {
        console.warn('Error processing include:', expr, 'context:', context, 'error:', err.message);
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

    // {{variavel | filtro}}
    template = template.replace(/{{\s*([\w.]+(?:\s*\|\s*\w+)*)\s*}}/g, (_, expr) => {
      return this.escapeHtml(this.applyFilters(expr, context, true));
    });

    return template;
  }

  applyFilters(expr, context, escape = true) {
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
    const formRegex = /{{form\s+'([^']+)'}}([\s\S]*?){{end_form}}/g;

    return await this.replaceAsync(template, formRegex, async (_, formName, innerContent) => {
      const formTemplate = await this.loadFromInterface(`forms/${formName}.html`);

      console.log('processForms formTemplate: ',formTemplate )

      // ({{field ...}}, {{button ...}}, etc.)
      let formBody = await this.processFormFields(innerContent, context);
      console.log('processForms formBody: ', formBody)

      return formTemplate.replace('{{form_body}}', formBody);
    });
  }

  async processFormFields(template, context) {
    console.log('context recebido em form:', JSON.stringify(context, null, 2));

    // Campo: {{field "email", value="...", class="..." }}
    template = await this.replaceAsync(template, /{{field\s+"([^"]+)"([\s\S]*?)}}/g, async (_, fieldName, rawAttrs) => {
      const attrs = this.parseAttributes(rawAttrs, context);
      const type  = attrs.type || 'text';
      attrs.name  = fieldName;
      attrs.value = attrs.value ?? this.getValue(`user.${fieldName}`, context);

      const fieldTemplate = await this.loadFromInterface(`forms/field_${type}.html`);

      return await this.renderTemplate(fieldTemplate, { ...context, field: attrs });
    });

    // {{button 'button_submit', 'Cadastrar', class="btn"}}
    template = await this.replaceAsync(
      template,
      /{{button\s+(.*?)}}/g,
      async (_, rawAttrs) => {
        const attrs = this.parseAttributes(rawAttrs, context);
        attrs.label = attrs.value ?? ''; // ← aqui o importante
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
        attrs.label = attrs.value ?? ''; // ← mesma coisa
        delete attrs.value;

        const linkTemplate = await this.loadFromInterface(`components/link_to.html`);
        return await this.renderTemplate(linkTemplate, { ...context, link: attrs });
      }
    );

    return template;
  }

  parseAttributes(attrStr, context) {
    // {{...}}
    attrStr = attrStr.replace(/{{\s*([^}]+)\s*}}/g, (match, keyExpr) => {
      if (match.includes('options=')) return match;
      return this.getValue(keyExpr, context) ?? '';
    });

    const attrs = {};

    const regex = /(\w+)=("(?:[^"]*)"|'(?:[^']*)')/g;
    let match;

    while ((match = regex.exec(attrStr))) {
      const key = match[1];
      let rawValue = match[2];

      if ((rawValue.startsWith('"') && rawValue.endsWith('"')) ||
          (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
        rawValue = rawValue.slice(1, -1);
      }

      attrs[key] = rawValue;
    }

    if (attrs.options) {
      if (typeof attrs.options === 'string') {
        const contextValue = this.getValue(attrs.options, context);
        if (Array.isArray(contextValue)) {
          attrs.options = contextValue;
        } else {
          try {
            attrs.options = JSON.parse(attrs.options);
          } catch (e) {
            console.warn('Error parsing options:', e.message, attrs.options);
            attrs.options = [];
          }
        }
      }
    }

    attrs.disabled = attrs.disabled === 'true' || attrs.disabled === true;
    attrs.readonly = attrs.readonly === 'true' || attrs.readonly === true;

    if (attrs.type === 'checkbox' && typeof attrs.value === 'string') {
      const val = attrs.value.toLowerCase();
      attrs.value = (val === 'true' || val === '1');
    }

    if (typeof attrs.options === 'string') {
      const contextValue = this.getValue(attrs.options, context);

      if (Array.isArray(contextValue)) {
        attrs.options = contextValue;
      } else {
        try {
          attrs.options = JSON.parse(attrs.options);
        } catch (e) {
          console.warn('Erro ao processar options:', e.message, attrs.options);
          attrs.options = [];
        }
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
    console.log('evaluateExpression expr: ', expr)
    console.log('context: ', context)
    const func = new Function(...Object.keys(context), `return ${expr};`);
    return func(...Object.values(context));
  }

  async loadTemplate(page) {
    const templatePath = "/app/views/" + page;

    console.log('loadTemplate: ', templatePath)
    return await this.loadFile(templatePath)
  }

  async loadFromInterface(template) {
    const templatePath = "/lib/volundir/adapters/interface/bootstrap-5.3.0/" + template;

    console.log('loadFromInterface: ', templatePath)
    return await this.loadFile(templatePath)
  }

  async loadFile(templatePath) {
    try {
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not load ${templatePath}`);
      }

      return await response.text();

    } catch (error) {
      console.error('Failed to load page:', error);
      return `<p>Failed to load page due to error: ${error.message}</p>`;
    }
  }
}
