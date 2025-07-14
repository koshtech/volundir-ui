export class System {
  static async post(url) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    let data = JSON.stringify({'eventType' : 'test'});

    xhr.send(data);
  }

  static flash(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type} alert-dismissible fade show`;
    alertBox.role = 'alert';
    alertBox.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;

    const container = document.querySelector('#flash-messages') || document.body;
    container.prepend(alertBox);

    setTimeout(() => {
      alertBox.classList.remove('show');
      alertBox.classList.add('hide');
      setTimeout(() => alertBox.remove(), 5000);
    }, 4000);
  };

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
