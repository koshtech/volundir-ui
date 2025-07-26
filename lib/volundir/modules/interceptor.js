import { Coordinator } from '/lib/volundir/core/coordinator.js';

export class Interceptor extends Coordinator {
  constructor() {
    super();

    this.init();

    // console.log(` [interceptor] ${this.constructor.name} loaded.`);
    // console.log(' [interceptor] this: ', this);
  }

  init() {
    document.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    if (event.defaultPrevented) return;

    const link = this.getAnchorFromEvent(event);
    if (!link) return;

    if (this.shouldIgnore(link, event)) return;

    const href = link.getAttribute('href');

    // ONly data-router links
    if (this.isRouterLink(link)) {
      event.preventDefault();
      this.handleInternalRoute(href);
    } else if (this.isModalLink(href)) {
      event.preventDefault();
      this.handleModalLink(href);
    } else if (this.isInternalURL(href)) {
      event.preventDefault();
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

  isInternalURL(href) {
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  handleInternalRoute(href) {
    // console.log(" handleInternalRoute:", href);
    this.router.dispatcher(href);
  }

  handleModalLink(href) {
    const modalId = href.slice(1);
    // console.log(" handleModalLink:", modalId);
    abrirModal(modalId);
  }

  handleInternalURL(href) {
    // console.log(" handleInternalURL:", href);
    this.router.dispatcher(href);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.Interceptor = new Interceptor();
});
