export default class CopyTel {
  constructor(options) {
    this.button = document.querySelector(options.buttonSelector);
    this.descText = document.querySelector(options.descTextSelector);
    this.descTextHiddenClass = options.descTextHiddenClass;

    this.copiedText = options.copiedText;
    this.descTextMainContent = options.descTextMainContent;
    this.descTextAdditionalContent = options.descTextAdditionalContent;

    this.isActive = false;

    this.setup();
  }

  setup() {
    this.descText.textContent = this.descTextMainContent;
    this.button.addEventListener('click', this.onClick.bind(this));
  }

  onClick(e) {
    e.preventDefault();

    navigator.clipboard.writeText(this.copiedText);

    if (!this.isActive) {
      this.isActive = true;
      this.showMessage();
    }
  }

  showMessage() {
    this.descText.classList.add(this.descTextHiddenClass);

    this.descText.addEventListener('transitionend', () => {
      this.descText.removeAttribute('aria-hidden');
      this.descText.setAttribute('aria-live', 'assertive');
      this.descText.textContent = this.descTextAdditionalContent;
      this.descText.classList.remove(this.descTextHiddenClass);

      setTimeout(() => {
        this.descText.classList.add(this.descTextHiddenClass);
        this.descText.removeAttribute('aria-live');
        this.descText.setAttribute('aria-hidden', true);

        this.descText.addEventListener('transitionend', () => {
          this.descText.textContent = this.descTextMainContent;
          this.descText.classList.remove(this.descTextHiddenClass);

          this.isActive = false;
        }, { once: true });
      }, 3000);
    }, { once: true });
  }
}

// {
//   buttonSelector: '#copy-button',
//   copiedText: '+380 (97) 17 033 21',
//   descTextSelector: '.header__desc-text',
//   descTextHiddenClass: 'header__desc-text_hidden',
//   descTextMainContent: 'Натисніть, щоб скопіювати',
//   descTextAdditionalContent: 'Скопійовано',
// };
