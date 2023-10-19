import ValidationError from './_ValidationError';

export default class AddInputValidation {
  constructor(input) {
    this.input = input;
    this.errorClass = 'input_invalid';

    this.input.addEventListener('focusin', () => {
      this.hideErrorClass();
      this.hideErrorMessage();
      this.removeInvalidAttribute();
    });
  }

  showErrorClass() {
    this.input.classList.add(this.errorClass);
    this.input.setAttribute('aria-invalid', true);
  }

  hideErrorClass() {
    this.input.classList.remove(this.errorClass);
    this.input.removeAttribute('aria-invalid');
  }

  addInvalidAttribute() {
    this.input.setAttribute('aria-invalid', true);
    this.input.setAttribute('aria-errormessage', Array.from(this.input.classList).join(''));
  }

  removeInvalidAttribute() {
    this.input.removeAttribute('aria-invalid');
    this.input.removeAttribute('aria-errormessage');
  }

  createErrorMessage(message) {
    this.errorMessage = document.createElement('div');
    this.errorMessage.classList.add('input-error-block');
    this.errorMessage.setAttribute('id', Array.from(this.input.classList).join(''));
    this.errorMessage.setAttribute('aria-live', 'assertive');
    this.errorMessage.innerHTML = message;
  }

  showErrorMessage(message) {
    if (this.input.nextElementSibling !== this.errorMessage) {
      this.createErrorMessage(message);
      this.input.after(this.errorMessage);
    }
  }

  hideErrorMessage() {
    if (this.input.nextElementSibling === this.errorMessage) {
      this.errorMessage.remove();
    }
  }

  validate() {
    switch (this.input.type) {
      case 'tel':
        if (!this.validateTel()) {
          this.showErrorClass();
          this.showErrorMessage('Некоректний номер телефона');
          this.addInvalidAttribute();
          throw this.createError('Incorrect telephone number');
        }
        return this.input.value;
      case 'email':
        if (!this.validateEmail()) {
          this.showErrorClass();
          this.showErrorMessage('Некоректний email');
          this.addInvalidAttribute();
          throw this.createError('Incorrect email');
        }
        return this.input.value;
      case 'text':
        if (this.input.required) {
          if (!this.validateRequiredText()) {
            this.showErrorClass();
            this.showErrorMessage('Поле має бути обов\'язково заповнено');
            this.addInvalidAttribute();
            throw this.createError('Field is not filled');
          }

          return this.input.value;
        }
        return this.input.value;
      case 'search':
        if (!this.validateRequiredText()) {
          this.showErrorClass();
          this.showErrorMessage('Введіть пошуковий запит');
          this.addInvalidAttribute();
          throw this.createError('Search field is not filled');
        }
        return this.input.value;
      default:
        return this.input.value;
    }
  }

  validateTel() {
    return this.input.value.length === 17;
  }

  validateEmail() {
    // eslint-disable-next-line prefer-regex-literals, no-control-regex, no-useless-escape
    const regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    return regex.test(this.input.value);
  }

  validateRequiredText() {
    return this.input.value.length;
  }

  createError(message) {
    return new ValidationError(message);
  }
}
