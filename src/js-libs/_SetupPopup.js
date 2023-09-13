export default class SetupPopup {
  constructor(options) {
    this.contentWrapper = document.querySelector(options.contentWrapperSelector);
    this.content = document.querySelector(options.contentSelector);
    this.openButtons = document.querySelectorAll(options.openButtonSelector);
    this.closeButtons = document.querySelectorAll(options.closeButtonSelector);

    this.contentWrapperClass = 'popup';
    this.contentWrapperActiveClass = 'popup_active';

    this.setup();
  }

  setup() {
    this.contentWrapper.classList.add(this.contentWrapperClass);

    this.openButtons.forEach((button) => {
      button.addEventListener('click', this.open.bind(this), { passive: true });
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener('click', this.close.bind(this), { passive: true });
    });

    this.contentWrapper.addEventListener('click', this.wrapperOnClick.bind(this), { passive: true });
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });
  }

  wrapperOnClick(e) {
    if (e.target !== this.contentWrapper) return;
    this.close();
  }

  onResize() {
    if (this.isOpen) {
      this.close();
    }
  }

  open() {
    if (this.isOpen) return;

    if (this.isContentOverflow) {
      this.contentWrapper.style.alignItems = 'flex-start';
      this.content.style.height = `${this.clientHeight}px`;
      this.content.style.overflowY = 'scroll';
    }

    document.body.style.overflow = 'hidden';
    this.contentWrapper.classList.add(this.contentWrapperActiveClass);
  }

  close() {
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
