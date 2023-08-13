import CopyTel from '../../js-libs/_copyTelButton';

export default function setupCopyTelButton() {
  new CopyTel({
    buttonSelector: '#copy-button',
    textMainSelector: '#copy-button-text-main',
    textAddSelector: '#copy-button-text-add',
    telSelector: '.header__tel',
    textHiddenClass: 'header__text_hidden',
  });
}
