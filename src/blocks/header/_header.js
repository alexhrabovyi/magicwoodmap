import CopyTel from '../../js-libs/_CopyTel';

export default function setupCopyTelButton() {
  new CopyTel({
    buttonSelector: '#copy-button',
    copiedText: '+380 (97) 17 033 21',
    descTextSelector: '.header__desc-text',
    descTextHiddenClass: 'header__desc-text_hidden',
    descTextMainContent: 'Натисніть, щоб скопіювати',
    descTextAdditionalContent: 'Скопійовано',
  });
}
