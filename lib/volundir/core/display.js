import { Coordinator } from './coordinator.js';

export class Display extends Coordinator {
  constructor() {
    super();
    console.log('================> Display Loaded.');
  }

  setParent(parent) {
    this.parent = parent;
    console.log('===> Display.setParent = this.parent: ', this.parent);
  }

  test(){
    console.log('================> Test.');
  }

  test_2(){
    console.log('================> Test from Component on Display.');
    console.log('===> Display.test_2 = this.parent: ', this.parent);
  }

  test_3(){
    console.log('================> Test from Render on Display.');
    console.log('===> Display.test_3 = this.parent: ', this.parent);
  }

  async flash(message, type = 'info') {
    console.log('===> Flash from Display!');
    console.log('===> Display.flash = this.parent: ', this.parent);

    const Render = this.parent['render'];

    Render.test_2();

    const alertBox = document.createElement('div');

    const template = await Render.loadFromInterface(`components/alert/alert-dismissible.html`);

    console.log('message: ', message);
    console.log('type: ', type);
    console.log('template: ', template);

    this.loadCSS(`/lib/volundir/adapters/interface/${Render.selectedInterface()["adapter"]}/assets/css/flash.css`);
    this.loadJS(`/lib/volundir/adapters/interface/${Render.selectedInterface()["adapter"]}/assets/js/flash.js`);

    let context = { flash: { message: message, type: type }}

    // Component.load(template, context);

    alertBox.innerHTML = await Render.renderTemplate(template, context);

    const container = document.querySelector('#flash-messages') || document.body;
    container.prepend(alertBox);

    setTimeout(() => {
      alertBox.classList.remove('show');
      alertBox.classList.add('hide');
      setTimeout(() => alertBox.remove(), 5000);
    }, 4000);
  };

  loadCSS(path) {
    if (document.querySelector(`link[href="${path}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
  }

  loadJS(path) {
    if (document.querySelector(`script[src="${path}"]`)) return;

    const script = document.createElement('script');
    script.src = path;
    script.defer = true;
    document.body.appendChild(script);
  }

}
