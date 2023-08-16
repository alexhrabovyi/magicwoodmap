import ValidateForm from '../../js-libs/_ValidateForm';

export default function setupFooterForm() {
  const form = document.querySelector('.footer__form');
  new ValidateForm(form);
}
