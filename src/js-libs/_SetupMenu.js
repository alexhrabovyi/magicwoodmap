export default class SetupMenu {
  constructor(options) {
    this.openButtons = document.querySelectorAll(options.openButtonsSelector);
    this.closeButtons = document.querySelectorAll(options.closeButtonsSelector);
    this.toggleButtons = document.querySelectorAll(options.toggleButtonsSelector);
    this.content = document.querySelector(options.contentSelector);

    this.openButtonActiveClass = options.openButtonActiveClass;
    this.closeButtonActiveClass = options.closeButtonActiveClass;
    this.isAriaToggle = options.ariaToggle;
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
    this.header = document.querySelector('.header');
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
      this.content.style.outline = 'none';

      this.backdrop.style.transitionProperty = 'all';
      this.backdrop.style.transitionDuration = '.5s';
      this.backdrop.style.transitionTimingFunction = 'ease-in-out';

      if (this.isAriaToggle) {
        this.content.setAttribute('aria-hidden', true);

        const allButton = this.content.querySelectorAll('button');
        const allLinks = this.content.querySelectorAll('a');
        const allInputs = this.content.querySelectorAll('input');
        const allFocusable = this.content.querySelectorAll('[tabindex]');

        allButton.forEach((button) => {
          button.setAttribute('tabindex', '-1');
        });

        allLinks.forEach((link) => {
          link.setAttribute('tabindex', '-1');
        });

        allInputs.forEach((link) => {
          link.setAttribute('tabindex', '-1');
        });

        allFocusable.forEach((link) => {
          link.setAttribute('tabindex', '-1');
        });
      }
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

    if (this.isAriaToggle) {
      this.content.removeAttribute('aria-hidden');

      const allButton = this.content.querySelectorAll('button');
      const allLinks = this.content.querySelectorAll('a');
      const allInputs = this.content.querySelectorAll('input');
      const allFocusable = this.content.querySelectorAll('[tabindex]');

      allButton.forEach((button) => {
        button.removeAttribute('tabindex');
      });

      allLinks.forEach((link) => {
        link.removeAttribute('tabindex');
      });

      allInputs.forEach((button) => {
        button.removeAttribute('tabindex');
      });

      allFocusable.forEach((link) => {
        link.removeAttribute('tabindex');
      });

      this.content.setAttribute('tabindex', 0);
      this.content.focus();
    }

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

    this.createPadding();
    this.backdrop.classList.add(this.backdropActiveClass);
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.isMenuOpen) return;

    if (this.isAriaToggle) {
      this.content.setAttribute('aria-hidden', true);
      this.content.removeAttribute('tabindex');

      const allButton = this.content.querySelectorAll('button');
      const allLinks = this.content.querySelectorAll('a');
      const allInputs = this.content.querySelectorAll('input');
      const allFocusable = this.content.querySelectorAll('[tabindex]');

      allButton.forEach((button) => {
        button.setAttribute('tabindex', '-1');
      });

      allLinks.forEach((link) => {
        link.setAttribute('tabindex', '-1');
      });

      allInputs.forEach((button) => {
        button.setAttribute('tabindex', '-1');
      });

      allFocusable.forEach((link) => {
        link.setAttribute('tabindex', '-1');
      });
    }

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

    document.body.style.paddingRight = '';
    document.body.removeAttribute('data-padding-by-menu');
    this.desktopNavPanel.style.width = '';
    this.desktopNavPanel.style.paddingRight = '';
    this.mobileNavPanel.style.width = '';
    this.mobileNavPanel.style.paddingRight = '';
    this.header.style.width = '';
    this.header.style.paddingRight = '';

    this.backdrop.classList.remove(this.backdropActiveClass);
    document.body.style.overflow = '';
  }

  createPadding() {
    const fullWidth = window.innerWidth;
    const widthWithoutScroll = document.documentElement.clientWidth;
    const scrollWidth = fullWidth - widthWithoutScroll;

    let desktopNavPanelPaddingRight = parseFloat(getComputedStyle(this.desktopNavPanel)
      .paddingRight);
    desktopNavPanelPaddingRight += scrollWidth;
    this.desktopNavPanel.style.width = `${fullWidth}px`;
    this.desktopNavPanel.style.paddingRight = `${desktopNavPanelPaddingRight}px`;

    let mobileNavPanelPaddingRight = parseFloat(getComputedStyle(this.mobileNavPanel)
      .paddingRight);
    mobileNavPanelPaddingRight += scrollWidth;
    this.mobileNavPanel.style.width = `${fullWidth}px`;
    this.mobileNavPanel.style.paddingRight = `${mobileNavPanelPaddingRight}px`;

    let headerPaddingRight = parseFloat(getComputedStyle(this.header)
      .paddingRight);
    headerPaddingRight += scrollWidth;
    this.header.style.width = `${fullWidth}px`;
    this.header.style.paddingRight = `${headerPaddingRight}px`;

    document.body.style.paddingRight = `${scrollWidth}px`;
    document.body.setAttribute('data-padding-by-menu', true);
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
