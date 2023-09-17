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

    document.body.style.overflow = 'hidden';
    this.contentWrapper.classList.add(this.contentWrapperActiveClass);
  }

  close(e) {
    e.preventDefault();

    if (!this.isOpen) return;

    this.contentWrapper.style.alignItems = '';
    this.content.style.height = '';
    this.content.style.overflowY = '';

    document.body.style.overflow = '';
    this.contentWrapper.classList.remove(this.contentWrapperActiveClass);
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
