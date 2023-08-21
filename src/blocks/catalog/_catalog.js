/* eslint-disable max-classes-per-file */
export default function setupCatalog() {
  class Select {
    constructor(selectSelector, selectedId = 0) {
      this.select = document.querySelector(selectSelector);
      this.selectedId = selectedId;
      this.isOpen = false;

      this.selectedButtonClass = 'catalog__select-button_selected';
      this.rotatedIconClass = 'catalog__select-chosen-icon_rotated';

      this.setup();
    }

    setup() {
      this.selectChosenButton = this.select.querySelector('.catalog__select-chosen-block');
      this.selectChosenText = this.select.querySelector('.catalog__select-chosen-text');
      this.selectArrowIcon = this.select.querySelector('.catalog__select-chosen-icon');
      this.selectButtonBlock = this.select.querySelector('.catalog__select-button-block');
      this.selectButtons = this.select.querySelectorAll('.catalog__select-button');

      for (let i = 0; i < this.selectButtons.length; i += 1) {
        this.selectButtons[i].setAttribute('data-select-btn-id', i);
        if (i === this.selectedId) this.selectButtons[i].classList.add(this.selectedButtonClass);
      }

      this.select.addEventListener('click', this.clickHandle.bind(this), { passive: true });
      window.addEventListener('orientationchange', this.onOrientationChange.bind(this));
    }

    clickHandle(e) {
      const { target } = e;

      if (target.closest('.catalog__select-chosen-block')) this.toggle();
      if (target.closest('.catalog__select-button')) this.chooseOption(target);
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.select.style.height = `${this.selectHeight + this.selectButtonBlockHeight}px`;
      this.selectArrowIcon.classList.add(this.rotatedIconClass);
    }

    close() {
      this.isOpen = false;
      this.select.style.height = `${this.selectHeight - this.selectButtonBlockHeight}px`;
      this.selectArrowIcon.classList.remove(this.rotatedIconClass);
    }

    chooseOption(target) {
      const newButton = target.closest('.catalog__select-button');
      const oldButton = this.selectButtons[this.selectedId];

      oldButton.classList.remove(this.selectedButtonClass);
      newButton.classList.add(this.selectedButtonClass);

      this.selectChosenText.textContent = newButton.textContent;
      this.selectedId = +newButton.dataset.selectBtnId;

      this.close();
    }

    onOrientationChange() {
      if (this.isOpen) this.close();
    }

    get selectHeight() {
      return this.select.offsetHeight;
    }

    get selectButtonBlockHeight() {
      return this.selectButtonBlock.offsetHeight;
    }
  }

  class Checkbox {
    constructor(checkboxBlockSelector) {
      this.checkboxBlock = document.querySelector(checkboxBlockSelector);
      this.buttonActiveClass = 'catalog__checkbox-button_checked';

      this.setup();
    }

    setup() {
      this.checkboxBlock.addEventListener('click', this.toggle.bind(this), { passive: true });
    }

    toggle(e) {
      const button = e.target.closest('.catalog__checkbox-button');
      button.classList.toggle(this.buttonActiveClass);
    }
  }

  new Select('.catalog__select', 0);
  new Checkbox('[data-checkbox-name="categories"]');
  new Checkbox('[data-checkbox-name="promotions"]');
}
