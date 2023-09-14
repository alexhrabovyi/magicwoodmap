import SetupMenu from '../../js-libs/_SetupMenu';

export default function setupBagAndWishlistMenu() {
  new SetupMenu({
    toggleButtonsSelector: '[data-button-bag]',
    closeButtonsSelector: '[data-button-bag-close]',
    contentSelector: '.bag-menu',
    openButtonActiveClass: 'main-nav__bag-and-wishlist-buttons-active',
  });

  new SetupMenu({
    toggleButtonsSelector: '[data-button-wishlist]',
    closeButtonsSelector: '[data-button-wishlist-close]',
    contentSelector: '.wishlist-menu',
    openButtonActiveClass: 'main-nav__bag-and-wishlist-buttons-active',
    animationFromLeft: true,
  });
}
