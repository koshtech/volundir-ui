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
    }

    return value;
  }

  async renderTemplate(template, context) {
    template = await template.replace(/{{\s*include\s+'([^']+)'\s*}}/g, async (_, path) => {
      const includedTemplate = await loadTemplate(path);
      return await this.renderTemplate(includedTemplate, context);
    });

    // {{if cond}}...{{endif}}
    template = template.replace(/{{if\s+([^}]+)}}([\s\S]*?){{endif}}/g, (_, condition, content) => {
      return this.evaluateCondition(condition.trim(), context) ? content : '';
    });

    // {{each item in list}}...{{end}}
    template = template.replace(/{{each\s+(\w+)\s+in\s+(\w+)}}([\s\S]*?){{end}}/g, (_, itemVar, listName, innerTemplate) => {
      const list = context[listName];
      if (!Array.isArray(list)) return '';

      return list.map(item => {
        const loopScope = { ...context, [itemVar]: item };

        return innerTemplate.replace(/{{\s*([\w.]+(?:\s*\|\s*\w+)*)\s*}}/g, (_, expr) => {
          return this.applyFilters(expr, loopScope, false);
        });
      }).join('');
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
    let operator;

    for (const op of operators) {
      if (expr.includes(op)) {
        operator = op;
        break;
      }
    }

    if (!operator) {
      // condição simples: {{if user.active}}
      return !!this.getValue(expr.trim(), context);
    }

    const [leftRaw, rightRaw] = expr.split(operator).map(s => s.trim());

    const left = this.getValue(leftRaw, context);
    let right = rightRaw;

    // tentar parsear número ou string
    if (right.startsWith("'") && right.endsWith("'") || right.startsWith('"') && right.endsWith('"')) {
      right = right.slice(1, -1);
    } else if (!isNaN(right)) {
      right = Number(right);
    } else {
      right = this.getValue(rightRaw, context);
    }

    switch (operator) {
      case '==': return left == right;
      case '!=': return left != right;
      case '>=': return left >= right;
      case '<=': return left <= right;
      case '>':  return left > right;
      case '<':  return left < right;
      default: return false;
    }
  }

  async loadTemplate(page) {
    const templatePath = "/app/views/" + page;

    try {
      const response = await fetch(templatePath);

      if (!response.ok) {
        throw new Error(`${response.status} - Could not load ${page}`);
      }

      return await response.text();

    } catch (error) {
      console.error('Failed to load page:', error);
      return `<p>Failed to load page due to error: ${error.message}</p>`;
    }
  }
}
