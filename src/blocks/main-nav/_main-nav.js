import SetupMenu from '../../js-libs/_SetupMenu';
import CopyTel from '../../js-libs/_CopyTel';
import ValidateForm from '../../js-libs/_ValidateForm';

export default function setupMainNav() {
  new SetupMenu({
    buttonsSelector: '.main-nav__content-open-button',
    contentSelector: '.main-nav__mobile-content',
    backdropSelector: '.main-nav__backdrop',
    buttonActiveClass: 'main-nav__content-open-button_active',
    contentActiveClass: 'main-nav__mobile-content_active',
    backdropActiveClass: 'backdrop_active',
  });

  new CopyTel({
    buttonSelector: '.main-nav__tel-button',
    textMainSelector: '.main-nav__tel-text',
    textAddSelector: '.main-nav__tel-text_additional',
    telSelector: '.main-nav__tel-number',
    textHiddenClass: 'main-nav__tel-text_hidden',
  });

  const form = document.querySelector('.main-nav__search-form');
  new ValidateForm(form);
}
