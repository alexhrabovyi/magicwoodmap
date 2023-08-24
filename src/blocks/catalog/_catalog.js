/* eslint-disable no-param-reassign */
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
        if (i === this.selectedId) {
          this.selectButtons[i].classList.add(this.selectedButtonClass);
          this.selectChosenText.textContent = this.selectButtons[i].textContent;
        }
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

  class Range {
    constructor(rangeBlockSelector) {
      this.rangeBlock = document.querySelector(rangeBlockSelector);

      this.setup();
    }

    setup() {
      this.rangeLine = this.rangeBlock.querySelector('.catalog__range-line');
      this.buttonMin = this.rangeBlock.querySelector('#range-btn-min');
      this.buttonMax = this.rangeBlock.querySelector('#range-btn-max');

      this.buttonMin.addEventListener('mousedown', this.onMouseDown.bind(this, 'min'));
      this.buttonMax.addEventListener('mousedown', this.onMouseDown.bind(this, 'max'));

      this.setupInput();

      setTimeout(() => {
        this.buttonMax.style.left = `${this.rangeLineWidth - this.buttonWidth}px`;
        this.buttonMin.style.left = '0';
      }, 0);
    }

    setupInput() {
      this.inputMin = this.rangeBlock.querySelector('#range-input-min');
      this.inputMax = this.rangeBlock.querySelector('#range-input-max');

      this.inputMin.addEventListener('focusout', this.onFocusOut.bind(this, 'min'), { passive: true });
      this.inputMax.addEventListener('focusout', this.onFocusOut.bind(this, 'max'), { passive: true });
    }

    onFocusOut(inputType, e) {
      const input = e.target.closest('input');

      if (input.value.length === 0) {
        input.value = input[inputType];
      }

      if (inputType === 'min') {
        if (+input.value < +input.min) input.value = input.min;
        if (+input.value >= +this.inputMax.value) input.value = this.inputMax.value;
      } else if (inputType === 'max') {
        if (+input.value > +input.max) input.value = input.max;
        if (+input.value < +this.inputMin.value) input.value = this.inputMin.value;
      }

      input.value = (+input.value).toFixed(0);
      const { value } = input;

      this.renderButton(value, inputType);
    }

    onMouseDown(type, e) {
      e.preventDefault();
      const button = e.target.closest('.catalog__range-button');

      const shiftX = e.clientX - this.getElementLeftCoord(button);

      button.style.transitionDuration = '0s';

      const onMouseMoveModified = this.onMouseMove.bind(this, type, button, shiftX);
      document.addEventListener('mousemove', onMouseMoveModified);
      document.addEventListener('mouseup', this.onMouseUp.bind(this, button, onMouseMoveModified), { once: true });
    }

    onMouseMove(type, button, shiftX, event) {
      const rangeLineLeftCoord = this.getElementLeftCoord(this.rangeLine);

      let buttonShiftLeft = event.clientX - rangeLineLeftCoord - shiftX;

      if (type === 'min') {
        const buttonMaxLeftShift = this.getElementStyleLeft(this.buttonMax);

        if (buttonShiftLeft <= 0) {
          buttonShiftLeft = 0;
        } else if (buttonShiftLeft >= buttonMaxLeftShift - this.buttonWidth) {
          buttonShiftLeft = buttonMaxLeftShift - this.buttonWidth;
        }
      } else if (type === 'max') {
        const buttonMinLeftShift = this.getElementStyleLeft(this.buttonMin);

        if (buttonShiftLeft >= this.rangeLineWidth - this.buttonWidth) {
          buttonShiftLeft = this.rangeLineWidth - this.buttonWidth;
        } else if (buttonShiftLeft <= buttonMinLeftShift + this.buttonWidth) {
          buttonShiftLeft = buttonMinLeftShift + this.buttonWidth;
        }
      }
      button.style.left = `${buttonShiftLeft}px`;
      this.calcInputs(buttonShiftLeft, type);
    }

    onMouseUp(button, mouseMoveFunc) {
      button.style.transitionDuration = '';
      document.removeEventListener('mousemove', mouseMoveFunc);
    }

    calcInputs(shiftLeft, type) {
      const minValue = +this.inputMin.min;
      const maxValue = +this.inputMin.max;

      let percent;

      if (type === 'min') {
        const rightShift = this.rangeLineWidth - shiftLeft - this.buttonWidth * 2;
        percent = rightShift / (this.rangeLineWidth - this.buttonWidth * 2);
        percent = Math.abs(percent - 1);
      } else if (type === 'max') {
        shiftLeft -= this.buttonWidth;
        percent = shiftLeft / (this.rangeLineWidth - this.buttonWidth * 2);
      }

      percent = +percent.toFixed(2);
      const inputValue = (((maxValue - minValue) * percent) + minValue).toFixed(0);

      if (type === 'min') {
        this.inputMin.value = inputValue;
      } else if (type === 'max') {
        this.inputMax.value = inputValue;
      }
    }

    renderButton(value, inputType) {
      const minValue = +this.inputMin.min;
      const maxValue = +this.inputMin.max;
      const percent = +((value - minValue) / (maxValue - minValue)).toFixed(2);

      if (inputType === 'min') {
        const leftShift = (this.rangeLineWidth - this.buttonWidth * 2) * percent;
        this.buttonMin.style.left = `${leftShift}px`;
      } else if (inputType === 'max') {
        let leftShift = (this.rangeLineWidth - this.buttonWidth * 2) * percent;
        leftShift += this.buttonWidth;
        this.buttonMax.style.left = `${leftShift}px`;
      }
    }

    getElementLeftCoord(elem) {
      const { left } = elem.getBoundingClientRect();
      return left;
    }

    getElementStyleLeft(elem) {
      return +elem.style.left.match(/\d+(\.\d+)?/)[0];
    }

    get buttonWidth() {
      return this.buttonMin.offsetWidth;
    }

    get rangeLineWidth() {
      return this.rangeLine.offsetWidth;
    }
  }

  new Select('.catalog__select', 0);
  new Checkbox('[data-checkbox-name="categories"]');
  new Checkbox('[data-checkbox-name="promotions"]');
  new Range('.catalog__range-block');
}
