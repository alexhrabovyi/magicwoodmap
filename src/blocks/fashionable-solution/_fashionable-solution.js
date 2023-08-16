import ValidateForm from '../../js-libs/_ValidateForm';

export default function setupFashionableSolutionForm() {
  const form = document.querySelector('.fashionable-solution__form ');
  new ValidateForm(form);
}
