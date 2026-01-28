export class BaseHelper {
  constructor () {
    super();
    /*
      propagateTo valid values
      [
        'handlers',     // Data handlers
        'modules'       // Modules
      ]
    */

    this.propagateToValues = ['controllers'];

    this.propagateTo = [];
  }

  static async attachDynamicBehavior(form) {
    const fields = form.querySelectorAll('[data-options]');

    console.log('  fields: ', fields);

    for (const field of fields) {
      const triggerFieldName = field.dataset.options;
      const modelName        = field.dataset.model;
      const idKey            = field.dataset.id || 'id';
      const labelKey         = field.dataset.label || 'name';
      const helperFuncName   = field.dataset.onChange;
      const helperParamsRaw  = field.dataset.helperParam;

      console.log('    field: ', field);
      console.log('      triggerFieldName: ', triggerFieldName);
      console.log('      modelName: ', modelName);
      console.log('      idKey: ', idKey);
      console.log('      labelKey: ', labelKey);
      console.log('      helperFuncName: ', helperFuncName);
      console.log('      helperParamsRaw: ', helperParamsRaw);

      const triggerField = form.querySelector(`[name="${triggerFieldName}"]`);
      if (!triggerField) continue;

      triggerField.addEventListener('change', async (event) => {
        const selectedValue = event.target.value;

        try {
          const response = await fetch(`/${modelName}s?${triggerFieldName}=${encodeURIComponent(selectedValue)}`);
          if (!response.ok) throw new Error("Erro ao buscar dados.");

          const list = await response.json();

          field.innerHTML = ''; // limpa opções
          list.forEach(item => {
            const option = document.createElement('option');
            option.value = item[idKey];
            option.textContent = item[labelKey];
            field.appendChild(option);
          });

          // Carrega helper automaticamente
          const pathParts = location.pathname.split('/');
          const controllerName = pathParts[1] || 'application';

          if (helperFuncName) {
            const helperModule = await import(`/app/helpers/${controllerName}_helper.js`);
            const helperFunc = helperModule?.[helperFuncName];
            if (typeof helperFunc === 'function') {
              const firstOption = list[0] || {};
              const params = parseParams(helperParamsRaw);
              helperFunc({
                ...params,
                id: firstOption[idKey],
                label: firstOption[labelKey],
              });
            }
          }

        } catch (err) {
          console.error('Erro ao popular campo dinâmico:', err.message);
        }
      });
    }

    function parseParams(paramStr) {
      if (!paramStr) return {};
      return Object.fromEntries(paramStr.split('&').map(p => {
        const [k, v] = p.split('=');
        return [k, v];
      }));
    }
  }
}
