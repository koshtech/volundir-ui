import { Coordinator } from '/lib/volundir/core/coordinator.js';

class DisplayModule extends Coordinator {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['render', 'timer'];
  }

  async startSplash(){
    console.log(' [display][startSplash]');

    document.getElementById('splash-screen').style.display = 'flex';
  }

  async stopSplash(){
    console.log(' [display][stopSplash] init');

    await this.fade('splash-screen');

    console.log(' [display][stopSplash] end');
  }

  async splashMessage(idOrClass, text) {
    if (typeof idOrClass !== 'string') return;

    if (idOrClass.startsWith('#')) {
      const element = document.getElementById(idOrClass.slice(1));

      if (element) {
        element.textContent = text;
      }
    } else if (idOrClass.startsWith('.')) {
      const elements = document.getElementsByClassName(idOrClass.slice(1));

      for (const el of elements) {
        el.textContent = text;
      }
    } else {
      console.warn('Selector must start with "#" (ID) or "." (class).');
    }
  }

  async flash(message, type = 'info') {
    const alertBox = document.createElement('div');

    const template = await this.render.loadFromInterface(`components/alert/alert-dismissible.html`);

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

  async fade(element) {
    // const fadeBox = document.createElement('div');

    // const template = await this.render.loadFromInterface(`components/fade/fade.html`);

    const adapter  = this.render._selectedInterfaceAdapter;
    // console.log('adapter: ', adapter);

    this.loadCSS(`/lib/volundir/adapters/interface/${adapter}/components/fade/style.css`);
    // this.loadJS(`/lib/volundir/adapters/interface/${adapter}/components/fade/script.js`);

    // let context = {};

    // Component.load(template, context);

    // fadeBox.innerHTML = await this.render.renderTemplate(template, context);

    // const container = document.querySelector('#main-app-components') || document.body;
    // container.prepend(fadeBox);

    this.timer.fade(element);
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

export const display = new DisplayModule();
