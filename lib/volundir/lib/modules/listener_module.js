import { BaseModule } from '/lib/volundir/base/base_module.js';

export class ListenerModule extends BaseModule {
  constructor() {
    super();
  }
  is_alive(){
    console.log('==> Listener is alive!');
  }

  xxx() {
    // rewrite all code bellow

    // document.addEventListener( 'load', function( event ) {

    //   event.preventDefault();
    //   console.log('====================> beforeload');
    //   // this.init();

    // }, true );

    window.addEventListener('popstate', () => {
      this.route(location.pathname);
    });

    window.addEventListener('DOMContentLoaded', () => {
      this.route(location.pathname);
      this.delegateLinks();
    });

    window.addEventListener('submit', async (event) => {
      const form = event.target;

      // console.log('form: ', form);

      if (form.tagName === 'FORM' && form.action.startsWith(location.origin)) {
        event.preventDefault();

        const path    = new URL(form.action).pathname;
        const methodInput = form.querySelector('input[name="_method"]');
        const method = (methodInput?.value || form.method || 'get').toLowerCase();


        // console.log('=> form.method: ', form.method);
        // console.log('=> submit path: ', path, ' method: ', method);

        await this.route(path, method, new FormData(form));
      }
    });



    // window.addEventListener('change', () => {
    //   console.log('========> change!');
    // });

    window.addEventListener('DOMContentLoaded', () => {
      this.bindPopulateListeners();
      // this.init();

      setTimeout(() => console.log('Starting....'), 5000);
      const selectedLayout = `/app/views/${this.selectedInterface()["code"]}/layouts/application.html`;

      fetch(selectedLayout)
        .then(response => response.text())
        .then(htmlText => {
          const parser = new DOMParser();
          htmlText     = this.renderLayout(htmlText, {});
          const newDoc = parser.parseFromString(htmlText, 'text/html');

          document.head.innerHTML = newDoc.head.innerHTML;
          document.body.innerHTML = newDoc.body.innerHTML;

          // this.reexecuteScripts(document.body);
          // reinitializeApp();
        });
    });

    // console.log('selectedLayout: ', selectedLayout);

    Logger.info({
      date: "2025-07-04 01:01:01",
      event: "Volundir Application Started.",
      description: "The Volundir Application MyTestApp was completely loaded and started."
    });
  }

  loadDefaults() {
    console.log(' [listener] Loaded defaults.');

    // window.addEventListener('click', function(event) {
    //   event.preventDefault();
    //   alert(`Clicked link to ${event.target}`);
    //   console.log('Clicked element:', event.target);
    //   this.route(event.target);
    // });

    // window.addEventListener('click', async (event) => {
    //   const link = event.target.closest('a[data-method]');

    //   if (!link || !link.href.startsWith(location.origin)) return;

    //   event.preventDefault();

    //   const method = link.dataset.method?.toLowerCase() || 'get';
    //   const confirmMessage = link.dataset.confirm;

    //   // Confirm window
    //   if (confirmMessage && !window.confirm(confirmMessage)) {
    //     return; // Canceled
    //   }

    //   const path = new URL(link.href).pathname;

    //   console.log('=> link clicked:', path, 'method:', method);

    //   const formData = new FormData();

    //   await this.route(path, method, formData);
    // });

    // window.addEventListener('popstate', () => {
    //   alert('A click occurred anywhere in the window!');
    //   this.route(location.pathname);
    // });

  }

  bindPopulateListeners() {
    const selects = document.querySelectorAll('select[data-on-change="populate"]');
    selects.forEach(select => {
      if (!select.dataset._bound) {
        select.dataset._bound = "true";
        select.addEventListener('change', () => {
          // console.log(`[populate] disparado em`, select);
          Render.populate(select);
        });
      }
    });
  }
}

// export const listener = new ListenerModule();

// window.addEventListener('DOMContentLoaded', () => {
//   console.log('======> Load done!!!');
// });
