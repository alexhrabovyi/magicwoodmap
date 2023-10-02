export default class SetupPopup {
  constructor(options) {
    this.contentWrapper = document.querySelector(options.contentWrapperSelector);
    this.content = document.querySelector(options.contentSelector);
    this.openButtonSelector = options.openButtonSelector;
    this.closeButtonSelector = options.closeButtonSelector;

    this.contentWrapperClass = 'popup';
    this.contentWrapperActiveClass = 'popup_active';

    this.setup();
  }

  setup() {
    this.mobileNavPanel = document.querySelector('.main-nav__mobile-panel');
    this.desktopNavPanel = document.querySelector('.main-nav__desktop');
    this.header = document.querySelector('.header');

    this.contentWrapper.classList.add(this.contentWrapperClass);

    setTimeout(() => {
      this.contentWrapper.style.transitionProperty = 'all';
      this.contentWrapper.style.transitionDuration = '.5s';
      this.contentWrapper.style.transitionTimingFunction = 'ease-in-out';
    });

    document.addEventListener('click', this.toggle.bind(this));
    this.contentWrapper.addEventListener('click', this.wrapperOnClick.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  toggle(e) {
    let button = e.target.closest(`${this.openButtonSelector}`);

    if (button) {
      this.open(e);
      return;
    }

    button = e.target.closest(`${this.closeButtonSelector}`);

    if (button) {
      this.close(e);
    }
  }

  wrapperOnClick(e) {
    if (e.target !== this.contentWrapper) return;
    this.close(e);
  }

  onResize(e) {
    if (this.isOpen) {
      this.close(e);
    }
  }

  open(e) {
    e.preventDefault();

    if (this.isOpen) return;

    if (this.isContentOverflow) {
      this.contentWrapper.style.alignItems = 'flex-start';
      this.content.style.height = `${this.clientHeight}px`;
      this.content.style.overflowY = 'scroll';
    }

    this.createPadding();
    document.body.style.overflow = 'hidden';
    this.contentWrapper.classList.add(this.contentWrapperActiveClass);
  }

  close(e) {
    e.preventDefault();

    if (!this.isOpen) return;

    this.contentWrapper.style.alignItems = '';
    this.content.style.height = '';
    this.content.style.overflowY = '';

    console.log(document.body.dataset.paddingByMenu);

    if (!document.body.dataset.paddingByMenu) {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      this.desktopNavPanel.style.width = '';
      this.desktopNavPanel.style.paddingRight = '';
      this.mobileNavPanel.style.width = '';
      this.mobileNavPanel.style.paddingRight = '';
      this.header.style.width = '';
      this.header.style.paddingRight = '';
    }
    this.contentWrapper.classList.remove(this.contentWrapperActiveClass);
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
  }

  get isOpen() {
    return this.contentWrapper.classList.contains(this.contentWrapperActiveClass);
  }

  get clientHeight() {
    return window.innerHeight;
  }

  get isContentOverflow() {
    const contentScrollHeight = this.content.scrollHeight;

    return contentScrollHeight > this.clientHeight;
  }
}
