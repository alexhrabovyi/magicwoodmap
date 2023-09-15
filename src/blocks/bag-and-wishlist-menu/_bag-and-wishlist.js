import SetupMenu from '../../js-libs/_SetupMenu';
import formatPrice from '../../js-libs/_formatPrice';
import productObjects from '../../js-libs/_productObjects';

import img1 from './images/map_1.png';
import img2 from './images/map_2.png';
import img3 from './images/map_3.png';
import img4 from './images/map_4.png';
import img5 from './images/map_5.png';
import img6 from './images/map_6.png';

const imgs = [img1, img2, img3, img4, img5, img6];

export default function setupBagAndWishlistMenu() {
  class SetupWishlistMenu {
    constructor() {
      this.wishlistMenu = document.querySelector('.wishlist-menu');

      this.setup();
    }

    setup() {
      this.cardBlock = this.wishlistMenu.querySelector('.bag-and-wishlist-menu__card-block');
      this.wishlistMenuButtonMobile = document.querySelector('.main-nav__wishlist-button-mobile');

      window.addEventListener('storage', this.generateAndAddCards.bind(this), { passive: true });
      document.addEventListener('click', this.toggle.bind(this), { passive: true });

      this.generateAndAddCards();
    }

    toggle(e) {
      let button = e.target.closest('.bag-and-wishlist-menu__wishlist-delete-button');

      if (button) {
        this.deleteButtonOnClick(button);
        return;
      }

      button = e.target.closest('[data-button-wishlist-add]');

      if (button) {
        this.addToWishlistButtonOnClick(button);
      }
    }

    generateCards() {
      const wishlistProducts = this.wishlistProductsInStorage;

      const cards = new DocumentFragment();

      if (!wishlistProducts.length) {
        const p1 = document.createElement('p');
        p1.className = 'text text_ff-poppins text_24-px text_c-black';
        p1.innerHTML = 'Ваш лист бажань<br>порожній!';

        const p2 = document.createElement('p');
        p2.className = 'text text_14-px text_c-grey';
        p2.innerHTML = 'Швидше обирай!';

        cards.append(p1, p2);
      } else {
        wishlistProducts.forEach((product) => {
          const card = document.createElement('div');
          card.classList.add('bag-and-wishlist-menu__card');

          const inner = `
            <img class="bag-and-wishlist-menu__card-img" src="${imgs[product.id]}" alt="Дерев\`яна мапа"}>
            <a class="link link_ff-poppins link_20-px link_fw-600 link_c-black-1 bag-and-wishlist-menu__card-title-link" href="${product.pageLink}" alt="${product.name}">${product.name}</a>
            <div class="bag-and-wishlist-menu__amount-and-price-block">
              <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price-name">Ціна</p>
              <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price">${formatPrice(product.basicPrice)} ₴</p>
            </div>
            <div class="bag-and-wishlist-menu__button-block">
              <button class="button bag-and-wishlist-menu__bag-button">Додати до кошика</button>
              <button class="button button_transparent bag-and-wishlist-menu__wishlist-delete-button" data-product-id="${product.id}">Видалити</button>
            </div>
          `;

          card.innerHTML = inner;
          cards.append(card);
        });
      }

      return cards;
    }

    addCircleToButton() {
      const wishlistProductAmount = this.wishlistProductsInStorage.length;

      if (wishlistProductAmount) {
        this.wishlistMenuButtonMobile.classList.add('main-nav__round-button-big_with-circle');
        this.wishlistMenuButtonMobile.dataset.productAmount = wishlistProductAmount;
      } else {
        this.wishlistMenuButtonMobile.classList.remove('main-nav__round-button-big_with-circle');
      }
    }

    generateAndAddCards() {
      const cards = this.generateCards();
      this.cardBlock.innerHTML = '';
      this.cardBlock.append(cards);

      this.addCircleToButton();
      this.toggleActiveButtonClass();
    }

    deleteButtonOnClick(button) {
      const productId = +button.dataset.productId;

      let { wishlistProductsInStorage } = this;
      const index = wishlistProductsInStorage.findIndex((item) => item.id === productId);
      wishlistProductsInStorage.splice(index, 1);
      wishlistProductsInStorage = JSON.stringify(wishlistProductsInStorage);

      localStorage.setItem('wishlistProducts', wishlistProductsInStorage);

      this.generateAndAddCards();
    }

    addToWishlistButtonOnClick(button) {
      const productId = +button.dataset.productId;
      const productObj = productObjects[productId];

      let { wishlistProductsInStorage } = this;
      const wishlistProductsInStorageIds = wishlistProductsInStorage.map((product) => product.id);

      if (wishlistProductsInStorageIds.includes(productObj.id)) {
        const index = wishlistProductsInStorage.findIndex((item) => item.id === productObj.id);
        wishlistProductsInStorage.splice(index, 1);
        wishlistProductsInStorage = JSON.stringify(wishlistProductsInStorage);

        localStorage.setItem('wishlistProducts', wishlistProductsInStorage);
      } else {
        wishlistProductsInStorage.push(productObj);
        wishlistProductsInStorage.sort((a, b) => a.id - b.id);
        wishlistProductsInStorage = JSON.stringify(wishlistProductsInStorage);

        localStorage.setItem('wishlistProducts', wishlistProductsInStorage);
      }

      this.generateAndAddCards();
    }

    toggleActiveButtonClass() {
      const buttons = document.querySelectorAll('[data-button-wishlist-add]');
      const wishlistProductsInStorageIds = this.wishlistProductsInStorage.map((item) => item.id);

      buttons.forEach((button) => {
        if (wishlistProductsInStorageIds.includes(+button.dataset.productId)) {
          button.classList.add('bag-and-wishlist-menu__round-button-selected');
        } else {
          button.classList.remove('bag-and-wishlist-menu__round-button-selected');
        }
      });
    }

    get wishlistProductsInStorage() {
      return JSON.parse(localStorage.getItem('wishlistProducts')) || [];
    }
  }

  new SetupWishlistMenu();

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
