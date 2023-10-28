export default function setupNewsAccordion() {
  class NewsAccordion {
    constructor(wrapperSelector, buttonSelector) {
      this.wrapper = document.querySelector(wrapperSelector);
      this.cardsBlock = this.wrapper.firstElementChild;
      this.card = this.cardsBlock.firstElementChild;
      this.button = document.querySelector(buttonSelector);
      this.isOpen = false;

      this.setup();
    }

    setup() {
      setTimeout(() => this.setupHeight(), 0);

      this.button.addEventListener('click', this.toggle.bind(this), { passive: true });
      window.addEventListener('resize', () => {
        setTimeout(this.close.bind(this), 0);
      }, { passive: true });
    }

    setupHeight() {
      const windowWidth = window.innerWidth;
      const dimensions = this.getDimensions();

      if (windowWidth <= 1024 && windowWidth > 768) {
        this.wrapper.style.height = `${dimensions.cardHeight * 2 + dimensions.cardsBlockRowGap}px`;
      } else if (windowWidth <= 768) {
        this.wrapper.style.height = `${dimensions.cardHeight * 3 + dimensions.cardsBlockRowGap * 2}px`;
      }
    }

    getDimensions() {
      const cardsBlockHeight = this.cardsBlock.offsetHeight;
      const cardsBlockRowGap = +getComputedStyle(this.cardsBlock).rowGap.match(/\d+/)[0];
      const cardHeight = this.card.offsetHeight;

      return {
        cardsBlockHeight,
        cardsBlockRowGap,
        cardHeight,
      };
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      const dimensions = this.getDimensions();
      this.isOpen = true;
      this.button.innerHTML = 'Приховати';
      this.wrapper.style.height = `${dimensions.cardsBlockHeight}px`;
    }

    close() {
      this.isOpen = false;
      this.button.innerHTML = 'Показати більше';
      this.wrapper.scrollIntoView();
      this.setupHeight();
    }
  }

  new NewsAccordion('.news__cards-block-wrapper', '.news__button');
}
