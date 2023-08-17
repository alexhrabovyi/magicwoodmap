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

    this.inputs = Array.from(this.form.querySelectorAll('.input'));
    this.inputs.forEach((input) => {
      if (input.type === 'tel') new TelMask(input);
    });

    this.inputsAndValidationObjects = [];
    this.inputs.forEach((input) => {
      this.inputsAndValidationObjects.push([input, new AddInputValidation(input)]);
    });
  }

  submit(e) {
    e.preventDefault();
    const results = {};

    try {
      this.inputsAndValidationObjects.forEach(([input, validationObj]) => {
        results[input.name] = validationObj.validate();
      });
    } catch (err) {
      console.log(err);
      return;
    }

    console.log(results);
  }
}
