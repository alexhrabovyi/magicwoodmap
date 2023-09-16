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

    this.setup();
  }

  setup() {
    this.mobileNavPanel = document.querySelector('.main-nav__mobile-panel');
    this.desktopNavPanel = document.querySelector('.main-nav__desktop');
    this.backdrop = document.querySelector('.backdrop');

    if (!this.backdrop) {
      this.backdrop = document.createElement('div');
      this.backdrop.classList.add('backdrop');
      document.body.prepend(this.backdrop);
    }

    this.content.classList.add(this.menuClass, this.menuHideClass);

    setTimeout(() => {
      this.content.style.transitionProperty = 'transform';
      this.content.style.transitionDuration = '.5s';
      this.content.style.transitionTimingFunction = 'ease-in-out';

      this.backdrop.style.transitionProperty = 'all';
      this.backdrop.style.transitionDuration = '.5s';
      this.backdrop.style.transitionTimingFunction = 'ease-in-out';
    });

    this.backdrop.addEventListener('click', this.close.bind(this), { passive: true });
    window.addEventListener('resize', this.onOrientationChange.bind(this), { passive: true });

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
    if (!this.isMenuOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    if (this.isMenuOpen) return;

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
      this.content.scrollTop = 0;
    } else {
      this.content.style.overflowY = '';
    }

    this.backdrop.classList.add(this.backdropActiveClass);
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isMenuOpen) return;

    this.toggleButtons.forEach((button) => {
      button.classList.remove(this.openButtonActiveClass);
    });
    this.openButtons.forEach((button) => {
      button.classList.remove(this.openButtonActiveClass);
    });
    this.closeButtons.forEach((button) => {
      button.classList.add(this.closeButtonActiveClass);
    });

    this.content.classList.remove(this.menuActiveClass);

    this.backdrop.classList.remove(this.backdropActiveClass);
    document.body.style.overflow = '';
  }

  onOrientationChange() {
    if (this.isMenuOpen) this.close();
  }

  get contentTop() {
    let top = this.mobileNavPanel.offsetHeight || this.desktopNavPanel.offsetHeight;

    if (window.innerWidth > 768 && window.scrollY <= 70) {
      top = this.mobileNavPanel.getBoundingClientRect().bottom
        || this.desktopNavPanel.getBoundingClientRect().bottom;
    }

    return top;
  }

  get visibleContentHeight() {
    const clientHeight = window.innerHeight;
    let menuPanelHeight = this.mobileNavPanel.offsetHeight || this.desktopNavPanel.offsetHeight;

    if (window.innerWidth > 768 && window.pageYOffset <= 70) {
      menuPanelHeight = this.mobileNavPanel.getBoundingClientRect().bottom
        || this.desktopNavPanel.getBoundingClientRect().bottom;
    }

    return clientHeight - menuPanelHeight;
  }

  get isContentOverflow() {
    const contentScrollHeight = this.content.scrollHeight;
    return contentScrollHeight > this.visibleContentHeight;
  }

  get isMenuOpen() {
    return this.content.classList.contains(this.menuActiveClass);
  }
}
