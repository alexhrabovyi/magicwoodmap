export default class SetupMenu {
  constructor(options) {
    this.openButtons = document.querySelectorAll(options.openButtonsSelector);
    this.closeButtons = document.querySelectorAll(options.closeButtonsSelector);
    this.toggleButtons = document.querySelectorAll(options.toggleButtonsSelector);
    this.content = document.querySelector(options.contentSelector);

    this.openButtonActiveClass = options.openButtonActiveClass;
    this.closeButtonActiveClass = options.closeButtonActiveClass;
    this.backdropActiveClass = 'backdrop_active';
    this.menuClass = 'menu';
    this.menuActiveClass = 'menu_active';

    if (options.animationFromLeft) {
      this.menuHideClass = 'menu_animationLeft';
    } else {
      this.menuHideClass = 'menu_animationRight';
    }

    this.isOpen = false;

    this.setup();
  }

  setup() {
    this.mainNavPanel = document.querySelector('.main-nav__mobile-panel');
    this.backdrop = document.querySelector('.backdrop');

    if (!this.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.classList.add('backdrop');
      document.body.prepend(this.backdrop);
    }

    this.content.classList.add(this.menuClass, this.menuHideClass);

    this.backdrop.addEventListener('click', this.close.bind(this), { passive: true });
    window.addEventListener('orientationchange', this.onOrientationChange.bind(this), { passive: true });

    if (this.toggleButtons) {
      this.toggleButtons.forEach((button) => {
        button.addEventListener('click', this.toggle.bind(this), { passive: true });
      });
    }

    if (this.openButtons) {
      this.openButtons.forEach((button) => {
        button.addEventListener('click', this.open.bind(this), { passive: true });
      });
    }

    if (this.closeButtons) {
      this.closeButtons.forEach((button) => {
        button.addEventListener('click', this.close.bind(this), { passive: true });
      });
    }
  }

  toggle() {
    if (!this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.toggleButtons.forEach((button) => {
      button.classList.add(this.openButtonActiveClass);
    });
    this.openButtons.forEach((button) => {
      button.classList.add(this.openButtonActiveClass);
    });
    this.closeButtons.forEach((button) => {
      button.classList.remove(this.closeButtonActiveClass);
    });

    const openMenus = document.querySelectorAll(`.${this.menuActiveClass}`);
    openMenus.forEach((menu) => {
      menu.classList.remove(this.menuActiveClass);
    });

    this.content.style.top = `${this.contentTop}px`;
    this.content.style.height = `${this.visibleContentHeight}px`;
    this.content.classList.add(this.menuActiveClass);

    if (this.isContentOverflow) {
      this.content.style.overflowY = 'scroll';
    }

    this.backdrop.classList.add(this.backdropActiveClass);
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.toggleButtons.forEach((button) => {
      button.classList.remove(this.openButtonActiveClass);
    });
    this.openButtons.forEach((button) => {
      button.classList.remove(this.openButtonActiveClass);
    });
    this.closeButtons.forEach((button) => {
      button.classList.add(this.closeButtonActiveClass);
    });

    if (this.isContentOverflow) {
      this.content.style.overflowY = '';
    }
    this.content.classList.remove(this.menuActiveClass);

    this.backdrop.classList.remove(this.backdropActiveClass);
    document.body.style.overflow = '';
  }

  onOrientationChange() {
    if (this.isOpen) this.close();
  }

  get contentTop() {
    let top = this.mainNavPanel.offsetHeight;

    if (window.innerWidth > 768 && window.pageYOffset <= 70) {
      top = this.mainNavPanel.getBoundingClientRect().bottom;
    }

    return top;
  }

  get visibleContentHeight() {
    const clientHeight = window.innerHeight;
    let menuPanelHeight = this.mainNavPanel.offsetHeight;

    if (window.innerWidth > 768 && window.pageYOffset <= 70) {
      menuPanelHeight = this.mainNavPanel.getBoundingClientRect().bottom;
    }

    return clientHeight - menuPanelHeight;
  }

  get isContentOverflow() {
    const contentScrollHeight = this.content.scrollHeight;
    return contentScrollHeight > this.visibleContentHeight;
  }
}
