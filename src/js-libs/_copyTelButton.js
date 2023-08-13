export default class CopyTel {
  constructor(options) {
    this.button = document.querySelector(options.buttonSelector);
    this.textMain = document.querySelector(options.textMainSelector);
    this.textAdd = document.querySelector(options.textAddSelector);
    this.textHiddenClass = options.textHiddenClass;

    this.copiedText = document.querySelector(options.telSelector).textContent;

    this.button.addEventListener('click', this.onClick.bind(this));
    this.isActive = false;
  }

  onClick() {
    navigator.clipboard.writeText(this.copiedText);

    if (!this.isActive) {
      this.isActive = true;
      this.showMessage();
    }
  }

  showMessage() {
    this.textMain.classList.add(this.textHiddenClass);
    this.textMain.addEventListener('transitionend', () => {
      this.textAdd.classList.remove(this.textHiddenClass);

      setTimeout(() => {
        this.textAdd.classList.add(this.textHiddenClass);
        this.textAdd.addEventListener('transitionend', () => {
          this.textMain.classList.remove(this.textHiddenClass);

          this.isActive = false;
        }, { once: true });
      }, 3000);
    }, { once: true });
  }
}

// {
//   buttonSelector: '',
//   textMainSelector: '',
//   textAddSelector: '',
//   telSelector: '',
//   textHiddenClass: '',
// }
