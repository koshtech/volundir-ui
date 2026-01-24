// import { BaseModule } from '/lib/volundir/base/base_module.js';

export class DisplayModule extends BaseModule {
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
    this.unloadCSS('/app/assets/css/splash-screen.css');

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

    const template = await this.modules.render.loadFromInterface(`components/flash/alert-dismissible.html`);

    const adapter  = this.modules.render._selectedInterfaceAdapter;

    this.loadCSS(`/lib/volundir/adapters/interface/${adapter}/components/flash/style.css`);
    this.loadJS(`/lib/volundir/adapters/interface/${adapter}/components/flash/script.js`);

    let context = { flash: { message: message, type: type }}

    alertBox.innerHTML = await this.modules.render.renderTemplate(template, context);

    const container = document.querySelector('#flash-messages') || document.body;
    container.prepend(alertBox);

    this.modules.timer.hide(alertBox, 5);
  };

  async fade(element) {
    const adapter  = this.modules.render._selectedInterfaceAdapter;

    this.loadCSS(`/lib/volundir/adapters/interface/${adapter}/components/fade/style.css`);

    this.modules.timer.fade(element);
  };

  loadCSS(path) {
    if (document.querySelector(`link[href="${path}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
  }

  unloadCSS(path) {
    const link = document.querySelector(`link[href="${path}"]`);
    if (link) {
      document.head.removeChild(link);
    }
  }

  loadJS(path) {
    if (document.querySelector(`script[src="${path}"]`)) return;

    const script = document.createElement('script');
    script.src = path;
    script.defer = true;
    document.body.appendChild(script);
  }
}
