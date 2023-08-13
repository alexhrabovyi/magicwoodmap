import CopyTel from '../../js-libs/_copyTelButton';

export default function setupMainNav() {
  class OpenMenu {
    constructor(options) {
      this.openButtons = document.querySelectorAll(options.openButtonsSelector);
      this.content = document.querySelector(options.contentSelector);
      this.backdrop = document.querySelector(options.backdropSelector);
      this.buttonActiveClass = options.buttonActiveClass;
      this.contentActiveClass = options.contentActiveClass;
      this.backdropActiveClass = options.backdropActiveClass;

      this.isShown = false;

      this.setup();
    }

    setup() {
      this.openButtons.forEach((openButton) => {
        openButton.addEventListener('click', this.onClickToggle.bind(this), { passive: true });
      });
      this.backdrop.addEventListener('click', this.close.bind(this), { passive: true });
      window.addEventListener('orientationchange', this.onOrientationChange.bind(this), { passive: true });

      setTimeout(() => {
        this.content.style.height = `${this.getVisibleContentHeight()}px`;
      }, 0);
    }

    getVisibleContentHeight() {
      const menuPanelHeight = document.querySelector('.main-nav__mobile-panel').offsetHeight;
      const { clientHeight } = document.documentElement;
      const visibleContentHeight = clientHeight - menuPanelHeight;

      return visibleContentHeight;
    }

    isContentOverflow() {
      const contentScrollHeight = this.content.scrollHeight;

      if (contentScrollHeight > this.getVisibleContentHeight()) return true;
      return false;
    }

    onOrientationChange() {
      if (this.isShown) this.close();

      setTimeout(() => {
        this.content.style.height = `${this.getVisibleContentHeight()}px`;
      }, 1);
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

      this.openButtons.forEach((openButton) => {
        openButton.classList.add(this.buttonActiveClass);
      });
      this.backdrop.classList.add(this.backdropActiveClass);
      this.content.classList.add(this.contentActiveClass);

      document.body.style.overflow = 'hidden';
      if (this.isContentOverflow()) this.content.style.overflowY = 'scroll';
    }

    close() {
      this.isShown = false;

      this.openButtons.forEach((openButton) => {
        openButton.classList.remove(this.buttonActiveClass);
      });
      this.backdrop.classList.remove(this.backdropActiveClass);
      this.content.classList.remove(this.contentActiveClass);

      document.body.style.overflow = '';
    }
  }

  new OpenMenu({
    openButtonsSelector: '.main-nav__content-open-button',
    contentSelector: '.main-nav__mobile-content',
    backdropSelector: '.main-nav__backdrop',
    buttonActiveClass: 'main-nav__content-open-button_active',
    contentActiveClass: 'main-nav__mobile-content_active',
    backdropActiveClass: 'main-nav__backdrop_active',
  });

  new CopyTel({
    buttonSelector: '.main-nav__tel-button',
    textMainSelector: '.main-nav__tel-text',
    textAddSelector: '.main-nav__tel-text_additional',
    telSelector: '.main-nav__tel-number',
    textHiddenClass: 'main-nav__tel-text_hidden',
  });
}

// {
//   openButtonsSelector: "",
//   contentSelector: "",
//   backdropSelector: "",
//   buttonActiveClass: "",
//   contentActiveClass: "",
//   backdropActiveClass: "",
// }
