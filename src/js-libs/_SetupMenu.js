export default class SetupMenu {
  constructor(options) {
    this.openAndCloseButtons = document.querySelectorAll(options.buttonsSelector);
    this.content = document.querySelector(options.contentSelector);
    this.backdrop = document.querySelector(options.backdropSelector);
    this.buttonActiveClass = options.buttonActiveClass;
    this.contentActiveClass = options.contentActiveClass;
    this.backdropActiveClass = options.backdropActiveClass;

    this.isShown = false;

    this.setup();
  }

  setup() {
    this.openAndCloseButtons.forEach((openButton) => {
      openButton.addEventListener('click', this.onClickToggle.bind(this), { passive: true });
    });
    this.backdrop.addEventListener('click', this.close.bind(this), { passive: true });
    window.addEventListener('orientationchange', this.onOrientationChange.bind(this), { passive: true });
  }

  getVisibleContentHeight() {
    const clientHeight = window.innerHeight;

    if (this.content.classList.contains('main-nav__mobile-content')) {
      const menuPanelHeight = document.querySelector('.main-nav__mobile-panel').offsetHeight;
      return clientHeight - menuPanelHeight;
    }
    return clientHeight;
  }

  isContentOverflow() {
    const contentScrollHeight = this.content.scrollHeight;
    return contentScrollHeight > this.getVisibleContentHeight();
  }

  onOrientationChange() {
    if (this.isShown) this.close();
  }

  onClickToggle() {
    if (this.isShown) {
      this.close();
    } else {
      this.show();
    }
  }

  show() {
    this.isShown = true;
    this.content.scrollTop = 0;
    this.content.style.height = `${this.getVisibleContentHeight()}px`;

    this.openAndCloseButtons.forEach((openButton) => {
      openButton.classList.add(this.buttonActiveClass);
    });
    this.backdrop.classList.add(this.backdropActiveClass);
    this.content.classList.add(this.contentActiveClass);

    document.body.style.overflow = 'hidden';
    if (this.isContentOverflow()) this.content.style.overflowY = 'scroll';
  }

  close() {
    this.isShown = false;

    this.openAndCloseButtons.forEach((openButton) => {
      openButton.classList.remove(this.buttonActiveClass);
    });
    this.backdrop.classList.remove(this.backdropActiveClass);
    this.content.classList.remove(this.contentActiveClass);

    document.body.style.overflow = '';
  }
}

// export default function setupMenu() {
//   class SetupMenu {
//     constructor(options) {
//       this.openButtons = document.querySelectorAll(options.openButtonsSelector);
//       this.closeButtons = document.querySelectorAll(options.closeButtonsSelector);
//       this.content = document.querySelector(options.contentSelector);
//       this.backdrop = document.querySelector(options.backdropSelector);

//       this.openButtonActiveClass = options.openButtonActiveClass;
//       this.closeButtonActiveClass = options.closeButtonActiveClass;
//       this.contentActiveClass = options.contentActiveClass;
//       this.backdropActiveClass = options.backdropActiveClass;

//       this.setup();
//     }

//     setup() {
//       this.openButtons.forEach((button) => {
//         button.addEventListener('click', this.show.bind(this), { passive: true });
//       });
//       this.closeButtons.forEach((button) => {
//         button.addEventListener('click', this.close.bind(this), { passive: true });
//       });
//       this.backdrop.addEventListener('click', this.close.bind(this), { passive: true });
//       window.addEventListener('orientationchange', this.close.bind(this), { passive: true });
//     }

//     get clientHeight() {
//       const { clientHeight } = document.documentElement;
//       return clientHeight;
//     }

//     isContentOverflow() {
//       const contentScrollHeight = this.content.scrollHeight;
//       return contentScrollHeight > this.clientHeight;
//     }

//     show() {
//       this.content.scrollTop = 0;
//       this.content.style.height = `${this.clientHeight}px`;

//       this.openButtons.forEach((openButton) => {
//         openButton.classList.add(this.openButtonActiveClass);
//       });
//       this.closeButtons.forEach((closeButton) => {
//         closeButton.classList.remove(this.closeButtonActiveClass);
//       });

//       this.backdrop.classList.add(this.backdropActiveClass);
//       this.content.classList.add(this.contentActiveClass);

//       document.body.style.overflow = 'hidden';
//       if (this.isContentOverflow()) this.content.style.overflowY = 'scroll';
//     }

//     close() {
//       this.openButtons.forEach((openButton) => {
//         openButton.classList.remove(this.openButtonActiveClass);
//       });
//       this.closeButtons.forEach((closeButton) => {
//         closeButton.classList.add(this.closeButtonActiveClass);
//       });

//       this.backdrop.classList.remove(this.backdropActiveClass);
//       this.content.classList.remove(this.contentActiveClass);

//       document.body.style.overflow = '';
//     }
//   }
// }
