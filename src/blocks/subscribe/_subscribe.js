import { addEmailValidation } from '../../js-libs/_emailMask';

export default function subscribeAddEmailValidation() {
  addEmailValidation(
    '.subscribe__button',
    '.subscribe__input',
    '.subscribe__input-block',
    'subscribe__input_incorrect',
  );
}
