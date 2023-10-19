import SetupMenu from '../../js-libs/_SetupMenu';
import CopyTel from '../../js-libs/_CopyTel';
import ValidateForm from '../../js-libs/_ValidateForm';

export default function setupMainNav() {
  new SetupMenu({
    toggleButtonsSelector: '.main-nav__content-open-button',
    contentSelector: '.main-nav__mobile-content',
    openButtonActiveClass: 'main-nav__content-open-button_active',
    animationFromLeft: true,
  });

  new CopyTel({
    buttonSelector: '.main-nav__tel-button',
    copiedText: '+380 (97) 17 033 21',
    descTextSelector: '.main-nav__tel-text',
    descTextHiddenClass: 'main-nav__tel-text_hidden',
    descTextMainContent: 'Натисніть, щоб скопіювати',
    descTextAdditionalContent: 'Скопійовано',
  });

  const form = document.querySelector('.main-nav__search-form');
  new ValidateForm(form);

  function highlightCurrentPageLink() {
    const desktopLinks = document.querySelectorAll('.main-nav__link');
    const mobileLink = document.querySelectorAll('.main-nav__mobile-main-link');

    const desktopLinkActiveClass = 'main-nav__link_active';
    const mobileLinkActiveClass = 'main-nav__mobile-main-link_active';

    const { pathname } = window.location;

    const regExp = new RegExp(`^${pathname}$`, 'i');

    for (const link of desktopLinks) {
      if (link.href.match(regExp) && !link.href.match(/#/)) {
        link.classList.add(desktopLinkActiveClass);
      }
    }

    for (const link of mobileLink) {
      if (link.href.match(regExp) && !link.href.match(/#/)) {
        link.classList.add(mobileLinkActiveClass);
      }
    }
  }

  highlightCurrentPageLink();
}
