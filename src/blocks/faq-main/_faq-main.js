export default function setupFaqAccordion() {
  class SetupFaqAccordion {
    constructor() {
      this.contentBlocks = document.querySelector('.faq-main__content-blocks');
      this.buttonActiveClass = 'faq-main__toggle-button_active';

      this.contentBlocks.addEventListener('click', this.toggle.bind(this));
      window.addEventListener('resize', this.resetup.bind(this));

      setTimeout(() => {
        this.setup();
      });
    }

    setup() {
      const contentBlocks = this.contentBlocks.querySelectorAll('.faq-main__content-block');

      contentBlocks.forEach((block) => {
        block.style.height = `${this.getElementHeight(block)}px`;
      });
    }

    resetup() {
      const contentBlocks = this.contentBlocks.querySelectorAll('.faq-main__content-block');

      contentBlocks.forEach((block) => {
        const button = block.querySelector('.faq-main__toggle-button');

        const subtitleBlock = block.querySelector('.faq-main__subtitle-and-button-block');
        const subtitleBlockHeight = this.getElementHeight(subtitleBlock);

        if (button.classList.contains(this.buttonActiveClass)) {
          const hiddenText = block.querySelector('.faq-main__text');
          const hiddenTextHeight = this.getElementHeight(hiddenText);

          block.style.height = `${hiddenTextHeight + subtitleBlockHeight}px`;
        } else {
          block.style.height = `${subtitleBlockHeight}px`;
        }
      });
    }

    toggle(e) {
      e.preventDefault();

      const button = e.target.closest('.faq-main__toggle-button');
      if (!button) return;

      const contentBlock = button.closest('.faq-main__content-block');
      const hiddenText = contentBlock.querySelector('.faq-main__text');

      if (button.classList.contains(this.buttonActiveClass)) {
        this.hide(button, contentBlock, hiddenText);
      } else {
        this.show(button, contentBlock, hiddenText);
      }
    }

    show(button, contentBlock, hiddenText) {
      button.classList.add(this.buttonActiveClass);

      const contentBlockHeight = this.getElementHeight(contentBlock);
      const hiddenTextHeight = this.getElementHeight(hiddenText);

      contentBlock.style.height = `${contentBlockHeight + hiddenTextHeight}px`;
    }

    hide(button, contentBlock, hiddenText) {
      button.classList.remove(this.buttonActiveClass);

      const contentBlockHeight = this.getElementHeight(contentBlock);
      const hiddenTextHeight = this.getElementHeight(hiddenText);

      contentBlock.style.height = `${contentBlockHeight - hiddenTextHeight}px`;
    }

    getElementHeight(el) {
      return el.offsetHeight;
    }
  }

  new SetupFaqAccordion();
}
