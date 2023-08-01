import { addEmailValidation } from '../../js-libs/_emailMask';

export default function footerAddEmailValidation() {
  addEmailValidation(
    '.footer__button-email',
    '.footer__input-email',
    '.footer__input-block',
    'footer__input-email_invalid',
  );
}
