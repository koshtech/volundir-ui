import { Coordinator } from '/lib/volundir/core/coordinator.js';

export class Display extends Coordinator {
  async flash(message, type = 'info') {
    // console.log('===> Flash from Display!');
    // console.log('===> Display.flash = this: ', this);

    const alertBox = document.createElement('div');

    const template = await this.render.loadFromInterface(`components/alert/alert-dismissible.html`);

    // console.log('message: ', message);
    // console.log('type: ', type);
    // console.log('template: ', template);
    // console.log('selectedInterface: ', this.render._selectedInterfaceAdapter);

    const adapter  = this.render._selectedInterfaceAdapter;
    // console.log('adapter: ', adapter);

    this.loadCSS(`/lib/volundir/adapters/interface/${adapter}/assets/css/flash.css`);
    this.loadJS(`/lib/volundir/adapters/interface/${adapter}/assets/js/flash.js`);

    let context = { flash: { message: message, type: type }}

    // Component.load(template, context);

    alertBox.innerHTML = await this.render.renderTemplate(template, context);

    const container = document.querySelector('#flash-messages') || document.body;
    container.prepend(alertBox);

    this.timer.hide(alertBox, 5);
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
