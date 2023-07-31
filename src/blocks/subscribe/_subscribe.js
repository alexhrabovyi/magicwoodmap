import validateEmail from '../../js-libs/_emailMask';

export default function addEmailValidation() {
  const submitButton = document.querySelector('.subscribe__button');
  const input = document.querySelector('.subscribe__input');
  const blockWithBefore = document.querySelector('.subscribe__input-block ');

  submitButton.addEventListener('click', () => {
    const email = input.value;

    if (email.length === 0) {
      blockWithBefore.dataset.before = 'Введіть email';
      input.style.borderColor = 'rgb(255 107 107)';
      return;
    }

    if (!validateEmail(email)) {
      blockWithBefore.dataset.before = 'Некоректний email';
      input.style.borderColor = 'rgb(255 107 107)';
      return;
    }

    blockWithBefore.dataset.before = '';
    input.style.borderColor = '';
  });
}
