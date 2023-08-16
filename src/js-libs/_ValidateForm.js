import TelMask from './_TelMask.js';
import AddInputValidation from './_AddInputValidation.js';

export default class ValidateForm {
  constructor(form) {
    this.form = form;
    this.formSetup();
  }

  formSetup() {
    this.submitButton = this.form.querySelector('[type="submit"]');
    this.submitButton.addEventListener('click', this.submit.bind(this));

    this.inputs = Array.from(this.form.querySelectorAll('input'));
    this.inputs.forEach((input) => {
      if (input.type === 'tel') new TelMask(input);
    });
  }

  submit(e) {
    e.preventDefault();
    const results = {};

    try {
      this.inputs.forEach((input) => {
        results[input.name] = new AddInputValidation(input).validate();
      });
    } catch (err) {
      console.log(err);
      return;
    }

    console.log(results);
  }
}
