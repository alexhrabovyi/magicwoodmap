import ValidateForm from '../../js-libs/_ValidateForm';

export default function setupCallBackForm() {
  const form = document.querySelector('.call-back-form__form');
  new ValidateForm(form);
}
