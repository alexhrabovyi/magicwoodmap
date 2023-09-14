import SetupMenu from '../../js-libs/_SetupMenu';
import formatPrice from '../../js-libs/_formatPrice';

import img1 from './images/map_1.png';
import img2 from './images/map_2.png';
import img3 from './images/map_3.png';
import img4 from './images/map_4.png';
import img5 from './images/map_5.png';
import img6 from './images/map_6.png';

const imgs = [img1, img2, img3, img4, img5, img6];

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

export class SetupWishlistMenu {
  constructor() {
    this.wishlistMenu = document.querySelector('.wishlist-menu');

    this.setup();
  }

  setup() {
    this.cardBlock = this.wishlistMenu.querySelector('.bag-and-wishlist-menu__card-block');
    window.addEventListener('storage', this.generateAndAddCards.bind(this));

    this.generateAndAddCards();
  }

  generateCards() {
    const wishlistProducts = JSON.parse(localStorage.getItem('wishlistProducts')) || [];

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
          <a class="button bag-and-wishlist-menu__bag-link" href="#" alt="Перейти до кошику">Перейти до кошику</a>
        `;

        card.innerHTML = inner;
        cards.append(card);
      });
    }

    return cards;
  }

  generateAndAddCards() {
    const cards = this.generateCards();
    this.cardBlock.innerHTML = '';
    this.cardBlock.append(cards);
  }
}
