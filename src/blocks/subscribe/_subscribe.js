import ValidateForm from '../../js-libs/_ValidateForm';

export default function setupSubscribeForm() {
  const form = document.querySelector('.subscribe__form');
  new ValidateForm(form);
}
