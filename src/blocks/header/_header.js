export default class CopyTel {
  constructor(buttonSelector, textMainSelector, textAddSelector, telSelector) {
    this.button = document.querySelector(buttonSelector);
    this.textMain = document.querySelector(textMainSelector);
    this.textAdd = document.querySelector(textAddSelector);
    this.copiedText = document.querySelector(telSelector).textContent;

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
    this.textMain.classList.add('header__text_hidden');
    this.textMain.addEventListener('transitionend', () => {
      this.textAdd.classList.remove('header__text_hidden');

      setTimeout(() => {
        this.textAdd.classList.add('header__text_hidden');
        this.textAdd.addEventListener('transitionend', () => {
          this.textMain.classList.remove('header__text_hidden');

          this.isActive = false;
        }, { once: true });
      }, 3000);
    }, { once: true });
  }
}
