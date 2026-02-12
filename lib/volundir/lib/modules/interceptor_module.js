const BaseModule = await File.import('lib/volundir/base/base_module.js');

const RouterModule = await File.import('lib/volundir/lib/modules/router_module.js');

export class InterceptorModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['router'];

    this.modules = {
      "router":  new RouterModule()
    };

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;

    this.init();
  }

  init() {
    document.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    if (event.defaultPrevented) return;

    // console.log(` [interceptor][handleClick] this: `, this);

    const link = this.getAnchorFromEvent(event);
    if (!link) return;

    if (this.shouldIgnore(link, event)) return;

    const href = link.getAttribute('href');

    event.preventDefault();

    // ONly data-router links
    if (this.isRouterLink(link)) {
      // event.preventDefault();
      this.handleInternalRoute(href);
    } else if (this.isControllerAction(href)) {
      // event.preventDefault();
      this.handleControllerAction(href);
    } else if (this.isModalLink(href)) {
      // event.preventDefault();
      this.handleModalLink(href);
    } else if (this.isInternalURL(href)) {
      // event.preventDefault();
      this.handleInternalURL(href);
    }
  }

  getAnchorFromEvent(event) {
    return event.target.closest('a');
  }

  shouldIgnore(link, event) {
    const href = link.getAttribute('href');
    return (
      !href ||
      href.startsWith('javascript:') ||
      link.hasAttribute('download') ||
      link.getAttribute('target') === '_blank' ||
      event.ctrlKey || event.metaKey
    );
  }

  isRouterLink(link) {
    return link.hasAttribute('data-router') && link.getAttribute('href').startsWith('/');
  }

  isModalLink(href) {
    return href.startsWith('#modal-');
  }

  isControllerAction(href) {
    return href.startsWith('#action-');
  }

  isInternalURL(href) {
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  handleInternalRoute(href) {
    console.log(" [interceptor][handleInternalRoute] href: ", href);
    this.modules.router.dispatcher(href);
  }

  handleControllerAction(href) {
    console.log(" [interceptor][handleControllerAction] href: ", href);
    console.log(" [interceptor][handleControllerAction] this: ", this);
    console.log(" [interceptor][handleControllerAction] this.router: ", this.router);
    this.modules.router.dispatcher(href);
  }

  handleModalLink(href) {
    const modalId = href.slice(1);
    console.log(" [interceptor][handleModalLink] modalId: ", modalId);
    // abrirModal(modalId);
  }

  handleInternalURL(href) {
    // console.log(" [interceptor][handleInternalURL] href: ", href);
    // console.log(" [interceptor][handleInternalURL] this: ", this);
    // console.log(" [interceptor][handleInternalURL] this.router: ", this.router);
    this.modules.router.dispatcher(href);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.Interceptor = new InterceptorModule();
});
