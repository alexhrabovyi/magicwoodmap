export function validateEmail(str) {
  // eslint-disable-next-line prefer-regex-literals, no-control-regex, no-useless-escape
  const regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

  return regex.test(str);
}

export function addEmailValidation(
  submitButtonSelector,
  inputSelector,
  blockWithBeforeSelector,
  incorrectClass,
) {
  const submitButton = document.querySelector(submitButtonSelector);
  const input = document.querySelector(inputSelector);
  const blockWithBefore = document.querySelector(blockWithBeforeSelector);

  submitButton.addEventListener('click', () => {
    const email = input.value;

    if (email.length === 0) {
      blockWithBefore.dataset.before = 'Введіть email';
      input.classList.add(incorrectClass);
      return;
    }

    if (!validateEmail(email)) {
      blockWithBefore.dataset.before = 'Некоректний email';
      input.classList.add(incorrectClass);
      return;
    }

    blockWithBefore.dataset.before = '';
    input.classList.remove(incorrectClass);
  });
}
