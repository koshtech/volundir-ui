
import { Render } from '/lib/volundir/core/render.js';

const render = new Render();

export class System {
  static async post(url) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    let data = JSON.stringify({'eventType' : 'test'});

    xhr.send(data);
  }

  static async flash(message, type = 'info') {
    console.log('===> Flash!');
    const alertBox = document.createElement('div');

    const template = await render.loadFromInterface(`components/alert/alert-dismissible.html`);

    console.log('message: ', message);
    console.log('type: ', type);
    console.log('template: ', template);

    this.loadCSS(`/lib/volundir/adapters/interface/${render.selectedInterface()["adapter"]}/assets/css/flash.css`);
    this.loadJS(`/lib/volundir/adapters/interface/${render.selectedInterface()["adapter"]}/assets/js/flash.js`);


    alertBox.innerHTML = await render.renderTemplate(template, { flash: { message: message, type: type }});

    const container = document.querySelector('#flash-messages') || document.body;
    container.prepend(alertBox);

    setTimeout(() => {
      alertBox.classList.remove('show');
      alertBox.classList.add('hide');
      setTimeout(() => alertBox.remove(), 5000);
    }, 4000);
  };

  static loadCSS(path) {
    if (document.querySelector(`link[href="${path}"]`)) return; // evitar duplicar

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
  }

  static loadJS(path) {
    if (document.querySelector(`script[src="${path}"]`)) return; // evitar duplicar

    const script = document.createElement('script');
    script.src = path;
    script.defer = true; // evita bloqueio de render
    document.body.appendChild(script);
  }


  static navigate(path) {
    history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  }

  static form_errors(errors) {
    document.querySelectorAll('.is-invalid').forEach(input => {
      input.classList.remove('is-invalid');
    });

    document.querySelectorAll('.invalid-feedback').forEach(feedback => {
      feedback.textContent = '';
    });

    for (const fieldName in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, fieldName)) {
        const errorMessage = errors[fieldName];

        const inputElement = document.getElementById(fieldName);

        if (inputElement) {
          inputElement.classList.add('is-invalid');

          let errorDisplayElement = document.getElementById(`${fieldName}-error`);

          if (!errorDisplayElement) {
            errorDisplayElement = document.createElement('div');
            errorDisplayElement.id = `${fieldName}-error`;
            errorDisplayElement.className = 'invalid-feedback';
            inputElement.parentNode.insertBefore(errorDisplayElement, inputElement.nextSibling);
          }

          errorDisplayElement.textContent = errorMessage;

        } else {
          console.warn(`Input element with ID '${fieldName}' not found for error: ${errorMessage}`);

          System.flash(errorMessage, 'danger');
        }
      }
    }
  }
};
