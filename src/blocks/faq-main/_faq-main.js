export default function setupFaqAccordion() {
  class SetupFaqAccordion {
    constructor() {
      this.contentBlocks = document.querySelector('.faq-main__content-blocks');
      this.iconActiveClass = 'faq-main__button-icon_active';

      this.contentBlocks.addEventListener('click', this.toggle.bind(this));
      window.addEventListener('resize', this.resetup.bind(this), { passive: true });

      setTimeout(() => {
        this.setup();
      });
    }

    setup() {
      const contentBlocks = this.contentBlocks.querySelectorAll('.faq-main__content-block');

      contentBlocks.forEach((block, i) => {
        block.style.height = `${this.getElementHeight(block)}px`;

        const buttonDesc = block.querySelector('.faq-main__subtitle').textContent;

        const content = block.querySelector('.faq-main__text');
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('id', `tabcontent${i}`);

        const buttons = block.querySelectorAll('button');
        buttons.forEach((button) => {
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-selected', false);
          button.setAttribute('aria-expanded', false);
          button.setAttribute('aria-controls', `tabcontent${i}`);
          button.setAttribute('aria-label', `Розкрити вкладку ${buttonDesc}`);
        });
      });
    }

    resetup() {
      const contentBlocks = this.contentBlocks.querySelectorAll('.faq-main__content-block');

      contentBlocks.forEach((block) => {
        const buttonBlock = block.querySelector('.faq-main__button-block');
        const buttonBlockHeight = this.getElementHeight(buttonBlock);

        if (block.dataset.isShown) {
          const hiddenText = block.querySelector('.faq-main__text');
          const hiddenTextHeight = this.getElementHeight(hiddenText);

          block.style.height = `${hiddenTextHeight + buttonBlockHeight}px`;
        } else {
          block.style.height = `${buttonBlockHeight}px`;
        }
      });
    }

    toggle(e) {
      e.preventDefault();

      const button = e.target.closest('[data-toggle-button]');
      if (!button) return;

      const contentBlock = button.closest('.faq-main__content-block');
      const hiddenText = contentBlock.querySelector('.faq-main__text');
      const icon = contentBlock.querySelector('.faq-main__button-icon');

      if (contentBlock.dataset.isShown) {
        this.hide(button, icon, contentBlock, hiddenText);
      } else {
        this.show(button, icon, contentBlock, hiddenText);
      }
    }

    show(button, icon, contentBlock, hiddenText) {
      icon.classList.add(this.iconActiveClass);

      contentBlock.setAttribute('data-is-shown', true);

      const contentBlockHeight = this.getElementHeight(contentBlock);
      const hiddenTextHeight = this.getElementHeight(hiddenText);

      contentBlock.style.height = `${contentBlockHeight + hiddenTextHeight}px`;
      contentBlock.style.pointerEvents = 'none';

      const onTransitionEndFunc = (e) => {
        if (e.propertyName === 'height') {
          contentBlock.style.pointerEvents = 'all';

          contentBlock.removeEventListener('transitionend', onTransitionEndFunc, { passive: true });
        }
      };

      contentBlock.addEventListener('transitionend', onTransitionEndFunc, { passive: true });

      const ariaControlsValue = button.getAttribute('aria-controls');
      const buttons = contentBlock.querySelectorAll(`[aria-controls="${ariaControlsValue}"]`);
      buttons.forEach((button) => {
        button.setAttribute('aria-selected', true);
        button.setAttribute('aria-expanded', true);
      });
    }

    hide(button, icon, contentBlock, hiddenText) {
      icon.classList.remove(this.iconActiveClass);

      contentBlock.removeAttribute('data-is-shown');

      const contentBlockHeight = this.getElementHeight(contentBlock);
      const hiddenTextHeight = this.getElementHeight(hiddenText);

      contentBlock.style.height = `${contentBlockHeight - hiddenTextHeight}px`;
      contentBlock.style.pointerEvents = 'none';

      const onTransitionEndFunc = (e) => {
        if (e.propertyName === 'height') {
          contentBlock.style.pointerEvents = 'all';

          contentBlock.removeEventListener('transitionend', onTransitionEndFunc, { passive: true });
        }
      };

      contentBlock.addEventListener('transitionend', onTransitionEndFunc, { passive: true });

      const ariaControlsValue = button.getAttribute('aria-controls');
      const buttons = contentBlock.querySelectorAll(`[aria-controls="${ariaControlsValue}"]`);
      buttons.forEach((button) => {
        button.setAttribute('aria-selected', false);
        button.setAttribute('aria-expanded', false);
      });
    }

    getElementHeight(el) {
      return el.offsetHeight;
    }
  }

  new SetupFaqAccordion();
}
