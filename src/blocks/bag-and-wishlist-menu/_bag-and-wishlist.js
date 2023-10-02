/* eslint-disable max-classes-per-file */
import SetupMenu from '../../js-libs/_SetupMenu';
import formatPrice from '../../js-libs/_formatPrice';
import productObjects from '../../js-libs/_productObjects';
import SetupPopup from '../../js-libs/_SetupPopup';
import links from '../../js-libs/_links';

import img1 from './images/map_1.png';
import img2 from './images/map_2.png';
import img3 from './images/map_3.png';
import img4 from './images/map_4.png';
import img5 from './images/map_5.png';
import img6 from './images/map_6.png';

const imgs = [img1, img2, img3, img4, img5, img6];

export class SetupWishlistMenu {
  constructor() {
    this.wishlistMenu = document.querySelector('.wishlist-menu');

    new SetupMenu({
      toggleButtonsSelector: '[data-button-wishlist]',
      closeButtonsSelector: '[data-button-wishlist-close]',
      contentSelector: '.wishlist-menu',
      openButtonActiveClass: 'main-nav__bag-and-wishlist-buttons-active',
      animationFromLeft: true,
    });

    this.setup();
  }

  setup() {
    this.cardBlock = this.wishlistMenu.querySelector('.bag-and-wishlist-menu__card-block');
    this.wishlistMenuButtonMobile = document.querySelector('.main-nav__wishlist-button-mobile');

    window.addEventListener('storage', this.onStorageEvent.bind(this), { passive: true });
    document.addEventListener('click', this.toggle.bind(this));

    this.generateAndAddCards();
  }

  toggle(e) {
    let button = e.target.closest('[data-button-wishlist-delete]');

    if (button) {
      this.deleteButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-button-wishlist-add]');

    if (button) {
      this.addToWishlistButtonOnClick(e, button);
    }
  }

  deleteButtonOnClick(e, button) {
    e.preventDefault();
    const productId = +button.dataset.productId;

    let { wishlistProductsInStorage } = this;
    const index = wishlistProductsInStorage.findIndex((item) => item.id === productId);
    wishlistProductsInStorage.splice(index, 1);
    wishlistProductsInStorage = JSON.stringify(wishlistProductsInStorage);

    localStorage.setItem('wishlistProducts', wishlistProductsInStorage);

    this.generateAndAddCards();
  }

  addToWishlistButtonOnClick(e, button) {
    e.preventDefault();
    button.blur();

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

  onStorageEvent(e) {
    if (e.key === 'wishlistProducts') {
      this.generateAndAddCards();
    }
  }

  generateAndAddCards() {
    const cards = this.generateCards();
    this.cardBlock.innerHTML = '';
    this.cardBlock.append(cards);

    this.addCircleToButton();
    this.toggleActiveButtonClass();
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
          <img class="bag-and-wishlist-menu__card-img" src="${imgs[product.id]}" alt="${product.imgAlt}"}>
          <a class="link link_ff-poppins link_20-px link_fw-600 link_c-black-1 bag-and-wishlist-menu__card-title-link" href="${product.pageLink}" alt="${product.name}">${product.name}</a>
          <div class="bag-and-wishlist-menu__amount-and-price-block">
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price-name">Ціна</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price">${formatPrice(product.basicPrice)} ₴</p>
          </div>
          <div class="bag-and-wishlist-menu__button-block">
            <button class="button bag-and-wishlist-menu__bag-button" data-button-bag-form-open data-product-id="${product.id}">Додати до кошика</button>
            <button class="button button_transparent bag-and-wishlist-menu__delete-button" data-button-wishlist-delete data-product-id="${product.id}">Видалити</button>
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
      this.wishlistMenuButtonMobile.classList.add('bag-and-wishlist-menu__round-button-active');
      this.wishlistMenuButtonMobile.dataset.productAmount = wishlistProductAmount;
    } else {
      this.wishlistMenuButtonMobile.classList.remove('bag-and-wishlist-menu__round-button-active');
    }
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

export class SetupBagMenu {
  constructor() {
    this.popupMenu = new SetupPopup({
      contentWrapperSelector: '.bag-and-wishlist-menu__option-form-popup-window ',
      contentSelector: '[data-bag-option-form]',
      openButtonSelector: '[data-button-bag-form-open]',
      closeButtonSelector: '.bag-and-wishlist-menu__option-form-close-button',
    });

    this.bagMenuClassInstance = new SetupMenu({
      toggleButtonsSelector: '[data-button-bag]',
      closeButtonsSelector: '[data-button-bag-close]',
      contentSelector: '.bag-menu',
      openButtonActiveClass: 'main-nav__bag-and-wishlist-buttons-active',
    });

    this.optionForm = document.querySelector('[data-bag-option-form]');
    this.bagMenu = document.querySelector('.bag-menu');

    this.setup();
  }

  setup() {
    this.optionFormInitialSetup();
    this.bagMenuInitialSetup();

    document.addEventListener('click', this.toggle.bind(this));
  }

  optionFormInitialSetup() {
    this.optionButtonActiveClass = 'bag-and-wishlist-menu__filter-button_active';

    this.optionFormAddToBagButton = this.optionForm.querySelector('[data-button-bag-add]');

    this.optionFormSizeButtons = this.optionForm.querySelectorAll('[data-size-button]');
    this.optionFormTypeButtons = this.optionForm.querySelectorAll('[data-type-button]');
    this.optionFormLangButtons = this.optionForm.querySelectorAll('[data-lang-button]');
    this.optionFormButtonTitles = this.optionForm.querySelectorAll('.bag-and-wishlist-menu__button-title');

    this.optionFormAmountBlock = this.optionForm.querySelector('.bag-and-wishlist-menu__amount-block');
    this.optionFormAmountDisplay = this.optionForm.querySelector('.bag-and-wishlist-menu__amount-display');

    this.optionFormCurrentPrice = this.optionForm.querySelector('[data-current-price]');
    this.optionFormOldPrice = this.optionForm.querySelector('[data-old-price]');
    this.optionFormTotalPrice = this.optionForm.querySelector('[data-total-price]');
  }

  bagMenuInitialSetup() {
    this.bagMenu = document.querySelector('.bag-menu');
    this.bagMenuCardBlock = this.bagMenu.querySelector('.bag-and-wishlist-menu__card-block');
    this.bagMenuTotalPriceBlock = this.bagMenu.querySelector('.bag-and-wishlist-menu__total-price-block');
    this.bagMenuButtonMobile = document.querySelector('.main-nav__bag-button-mobile');

    window.addEventListener('storage', this.onStorageEvent.bind(this), { passive: true });
    this.bagMenuGenerateAndAddCards();
  }

  optionFormSetup() {
    if (this.optionFormAddToBagButton.product.productObj.productType === 'accessories') {
      this.optionFormSizeButtons.forEach((button) => {
        button.style.display = 'none';
      });
      this.optionFormTypeButtons.forEach((button) => {
        button.style.display = 'none';
      });
      this.optionFormLangButtons.forEach((button) => {
        button.style.display = 'none';
      });
      this.optionFormButtonTitles.forEach((title) => {
        title.style.display = 'none';
      });

      if (this.changeOptions) {
        this.optionFormAmountDisplay.innerHTML = this.changeOptions.amount;

        this.optionFormAddToBagButton.product.amount = this.changeOptions.amount;
        this.optionFormAddToBagButton.product.changeOptions = true;
      } else {
        this.optionFormAmountDisplay.innerHTML = 1;

        this.optionFormAddToBagButton.product.amount = 1;
        this.optionFormAddToBagButton.product.changeOptions = false;
      }
    } else {
      this.optionFormSizeButtons.forEach((button) => {
        button.classList.remove(this.optionButtonActiveClass);
        button.style.display = '';
      });
      this.optionFormTypeButtons.forEach((button) => {
        button.classList.remove(this.optionButtonActiveClass);
        button.style.display = '';
      });
      this.optionFormLangButtons.forEach((button) => {
        button.classList.remove(this.optionButtonActiveClass);
        button.style.display = '';
      });
      this.optionFormButtonTitles.forEach((title) => {
        title.style.display = '';
      });

      if (this.changeOptions) {
        this.optionFormSizeButtons.forEach((button) => {
          if (button.dataset.sizeButton === this.changeOptions.mapSize) {
            button.classList.add(this.optionButtonActiveClass);
          }
        });
        this.optionFormTypeButtons.forEach((button) => {
          if (button.dataset.typeButton === this.changeOptions.mapType) {
            button.classList.add(this.optionButtonActiveClass);
          }
        });
        this.optionFormLangButtons.forEach((button) => {
          if (button.dataset.langButton === this.changeOptions.mapLang) {
            button.classList.add(this.optionButtonActiveClass);
          }
        });

        this.optionFormAmountDisplay.innerHTML = this.changeOptions.amount;

        this.optionFormAddToBagButton.product.mapSize = this.changeOptions.mapSize;
        this.optionFormAddToBagButton.product.mapType = this.changeOptions.mapType;
        this.optionFormAddToBagButton.product.mapLang = this.changeOptions.langType;
        this.optionFormAddToBagButton.product.amount = this.changeOptions.amount;
        this.optionFormAddToBagButton.product.changeOptions = true;
      } else {
        this.optionFormSizeButtons.forEach((button) => {
          if (button.dataset.sizeButton === 'M') {
            button.classList.add(this.optionButtonActiveClass);
          }
        });
        this.optionFormTypeButtons.forEach((button) => {
          if (button.dataset.typeButton === 'Prime') {
            button.classList.add(this.optionButtonActiveClass);
          }
        });
        this.optionFormLangButtons.forEach((button) => {
          if (button.dataset.langButton === 'ukr') {
            button.classList.add(this.optionButtonActiveClass);
          }
        });

        this.optionFormAmountDisplay.innerHTML = 1;

        this.optionFormAddToBagButton.product.mapSize = 'M';
        this.optionFormAddToBagButton.product.mapType = 'Prime';
        this.optionFormAddToBagButton.product.mapLang = 'ukr';
        this.optionFormAddToBagButton.product.amount = 1;
        this.optionFormAddToBagButton.product.changeOptions = false;
      }
    }

    this.optionFormCalcPriceAndShow();
  }

  optionFormCalcPriceAndShow() {
    let { basicPrice, basicOldPrice, totalPrice } = this.optionFormCalcPrice();

    basicPrice = formatPrice(basicPrice);
    this.optionFormCurrentPrice.textContent = `${basicPrice} ₴`;

    totalPrice = formatPrice(totalPrice);
    this.optionFormTotalPrice.textContent = `${totalPrice} ₴`;

    if (basicOldPrice) {
      basicOldPrice = formatPrice(basicOldPrice);
      this.optionFormOldPrice.textContent = `${basicOldPrice} ₴`;
    } else {
      this.optionFormOldPrice.textContent = '';
    }
  }

  optionFormCalcPrice() {
    let { basicPrice, basicOldPrice } = this.optionFormAddToBagButton.product.productObj;

    if (this.optionFormAddToBagButton.product.productObj.productType !== 'accessories') {
      basicPrice += this.optionFormAddToBagButton
        .product.productObj.sizePrices[this.optionFormAddToBagButton.product.mapSize];
      basicPrice += this.optionFormAddToBagButton
        .product.productObj.typePrices[this.optionFormAddToBagButton.product.mapType];

      if (basicOldPrice) {
        basicOldPrice += this.optionFormAddToBagButton
          .product.productObj.sizePrices[this.optionFormAddToBagButton.product.mapSize];
        basicOldPrice += this.optionFormAddToBagButton
          .product.productObj.typePrices[this.optionFormAddToBagButton.product.mapType];
        this.optionFormAddToBagButton.product.basicOldPrice = basicOldPrice;
      }
    }

    const totalPrice = basicPrice * this.optionFormAddToBagButton.product.amount;

    this.optionFormAddToBagButton.product.basicPrice = basicPrice;
    this.optionFormAddToBagButton.product.totalPrice = totalPrice;

    return { basicPrice, basicOldPrice, totalPrice };
  }

  toggle(e) {
    let button = e.target.closest('[data-button-bag-form-open]');
    if (button) {
      this.bagFormOpenButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-amount-button]');
    if (button) {
      this.amountButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-size-button]');
    if (button) {
      this.optionFormSizeButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-type-button]');
    if (button) {
      this.optionFormTypeButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-lang-button]');
    if (button) {
      this.optionFormLangButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-button-bag-add]');
    if (button) {
      this.addToBagButtonOnClick(e, button);
      return;
    }

    button = e.target.closest('[data-button-bag-delete]');

    if (button) {
      this.deleteButtonOnClick(e, button);
    }
  }

  bagFormOpenButtonOnClick(e, button) {
    e.preventDefault();
    this.optionFormAddToBagButton.product = {};

    const productId = +button.dataset.productId;
    this.optionFormAddToBagButton.product.productObj = productObjects[productId];

    this.changeOptions = button.changeOptions;
    this.optionFormSetup();
  }

  amountButtonOnClick(e, button) {
    e.preventDefault();

    const buttonType = button.dataset.amountButton;

    if (buttonType === 'plus') {
      this.optionFormAddToBagButton.product.amount += 1;
    } else if (buttonType === 'minus') {
      this.optionFormAddToBagButton.product.amount -= 1;
    }

    if (this.optionFormAddToBagButton.product.amount < 1) {
      this.optionFormAddToBagButton.product.amount = 1;
    }

    this.optionFormAmountDisplay.innerHTML = this.optionFormAddToBagButton.product.amount;
    this.optionFormCalcPriceAndShow();
  }

  optionFormSizeButtonOnClick(e, button) {
    e.preventDefault();

    button.blur();

    this.optionFormSizeButtons.forEach((button) => {
      button.classList.remove(this.optionButtonActiveClass);
    });
    button.classList.add(this.optionButtonActiveClass);

    this.optionFormAddToBagButton.product.mapSize = button.dataset.sizeButton;

    this.optionFormCalcPriceAndShow();
  }

  optionFormTypeButtonOnClick(e, button) {
    e.preventDefault();

    button.blur();

    this.optionFormTypeButtons.forEach((button) => {
      button.classList.remove(this.optionButtonActiveClass);
    });
    button.classList.add(this.optionButtonActiveClass);

    this.optionFormAddToBagButton.product.mapType = button.dataset.typeButton;

    this.optionFormCalcPriceAndShow();
  }

  optionFormLangButtonOnClick(e, button) {
    e.preventDefault();

    button.blur();

    this.optionFormLangButtons.forEach((button) => {
      button.classList.remove(this.optionButtonActiveClass);
    });
    button.classList.add(this.optionButtonActiveClass);

    this.optionFormAddToBagButton.product.mapLang = button.dataset.langButton;
  }

  addToBagButtonOnClick(e, button) {
    e.preventDefault();

    button.blur();

    const { bagProductsInStorage } = this;
    let duplicate = false;

    if (!button.product) {
      const id = +button.dataset.productId;
      const productObject = productObjects[id];

      if (productObject.productType === 'accessories') {
        button.product = {
          productObj: productObject,
          amount: 1,
          basicPrice: productObject.basicPrice,
          basicOldPrice: productObject.basicOldPrice,
          totalPrice: productObject.basicPrice,
          changeOptions: false,
        };
      } else {
        button.product = {
          productObj: productObject,
          mapSize: 'M',
          mapType: 'Prime',
          mapLang: 'ukr',
          amount: 1,
          basicPrice: productObject.basicPrice,
          basicOldPrice: productObject.basicOldPrice,
          totalPrice: productObject.basicPrice,
          changeOptions: false,
        };
      }
    }

    if (button.product.changeOptions) {
      const index = bagProductsInStorage.findIndex((product) => {
        const result = product.productObj.id === this.changeOptions.id
          && product.mapSize === this.changeOptions.mapSize
          && product.mapType === this.changeOptions.mapType
          && product.mapLang === this.changeOptions.mapLang
          && product.amount === this.changeOptions.amount;

        return result;
      });
      bagProductsInStorage.splice(index, 1);
    }

    const result = {
      productObj: button.product.productObj,
      mapSize: button.product.mapSize,
      mapType: button.product.mapType,
      mapLang: button.product.mapLang,
      amount: button.product.amount,
      basicPrice: button.product.basicPrice,
      basicOldPrice: button.product.basicOldPrice,
      totalPrice: button.product.totalPrice,
    };

    for (const product of bagProductsInStorage) {
      if (product.productObj.id === result.productObj.id
        && product.mapSize === result.mapSize
        && product.mapType === result.mapType
        && product.mapLang === result.mapLang) {
        product.amount += result.amount;
        product.totalPrice += result.totalPrice;
        duplicate = true;
        break;
      }
    }

    if (!duplicate) {
      bagProductsInStorage.push(result);
      bagProductsInStorage.sort((a, b) => a.productObj.id - b.productObj.id);
    }

    localStorage.setItem('bagProducts', JSON.stringify(bagProductsInStorage));
    this.popupMenu.close(e);

    this.bagMenuGenerateAndAddCards();
  }

  deleteButtonOnClick(e, button) {
    e.preventDefault();

    let { bagProductsInStorage } = this;
    const index = bagProductsInStorage.findIndex((product) => {
      const result = product.productObj.id === button.product.id
        && product.mapSize === button.product.mapSize
        && product.mapType === button.product.mapType
        && product.mapLang === button.product.mapLang;

      return result;
    });
    bagProductsInStorage.splice(index, 1);
    bagProductsInStorage = JSON.stringify(bagProductsInStorage);

    localStorage.setItem('bagProducts', bagProductsInStorage);

    this.bagMenuGenerateAndAddCards();
    this.bagMenuClassInstance.content.scrollTop = 0;
  }

  onStorageEvent(e) {
    if (e.key === 'bagProducts') {
      this.bagMenuGenerateAndAddCards();
    }
  }

  bagMenuGenerateAndAddCards() {
    const cards = this.bagMenuGenerateCards();
    this.bagMenuCardBlock.innerHTML = '';
    this.bagMenuCardBlock.append(cards);

    this.bagMenuAddCircleToButton();
    this.bagMenuGenerateTotalPriceBlock();
    this.toggleActiveButtonClass();
  }

  bagMenuGenerateCards() {
    const { bagProductsInStorage } = this;

    const cards = new DocumentFragment();

    if (!bagProductsInStorage.length) {
      const p1 = document.createElement('p');
      p1.className = 'text text_ff-poppins text_24-px text_c-black';
      p1.innerHTML = 'Ваш кошик<br>порожній!';

      const p2 = document.createElement('p');
      p2.className = 'text text_14-px text_c-grey';
      p2.innerHTML = 'Швидше обирай!';

      cards.append(p1, p2);
    } else {
      bagProductsInStorage.forEach((product) => {
        let mapLang;
        let mapSize;

        if (product.mapLang === 'ukr') {
          mapLang = 'Українська';
        } else if (product.mapLang === 'en') {
          mapLang = 'Англійська';
        }

        if (product.mapSize === 'M') {
          mapSize = '100x60cм';
        } else if (product.mapSize === 'L') {
          mapSize = '150x90cм';
        } else if (product.mapSize === 'XL') {
          mapSize = '200x100cм';
        }

        const card = document.createElement('div');
        card.classList.add('bag-and-wishlist-menu__card');

        let inner;

        if (product.productObj.productType === 'accessories') {
          inner = `
          <img class="bag-and-wishlist-menu__card-img" src="${imgs[product.productObj.id]}" alt="${product.productObj.imgAlt}">
          <a class="link link_ff-poppins link_20-px link_fw-600 link_c-black-1 bag-and-wishlist-menu__card-title-link" href="${product.productObj.pageLink}" alt="${product.productObj.name}">${product.productObj.name}</a>
          <div class="bag-and-wishlist-menu__card-params">
            <button class="button button_transparent bag-and-wishlist-menu__options-button" data-button-bag-form-open data-product-id="${product.productObj.id}">Змінити опції</button>
          </div>
          <div class="bag-and-wishlist-menu__amount-and-price-block">
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-name">${product.productObj.name}</p>
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-amount">x ${product.amount}</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price-name">Сума</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price">${formatPrice(product.basicPrice)} ₴</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-total-price-name">Разом</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-total-price">${formatPrice(product.totalPrice)} ₴</p>
          </div>
          <div class="bag-and-wishlist-menu__button-block">
            <a class="button bag-and-wishlist-menu__bag-button" href="${links.productPage}" alt="Перейти до кошика">Перейти до кошика</a>
            <button class="button button_transparent bag-and-wishlist-menu__delete-button" data-button-bag-delete>Видалити</button>
          </div>`;
        } else {
          inner = `
          <img class="bag-and-wishlist-menu__card-img" src="${imgs[product.productObj.id]}" alt="${product.productObj.imgAlt}">
          <a class="link link_ff-poppins link_20-px link_fw-600 link_c-black-1 bag-and-wishlist-menu__card-title-link" href="${product.productObj.pageLink}" alt="${product.productObj.name}">${product.productObj.name}</a>
          <div class="bag-and-wishlist-menu__card-params">
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-param">Розмір мапи: ${product.mapSize}: ${mapSize}</p>
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-param">Тип мапи: ${product.mapType}</p>
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-param">Мова гравіювання: ${mapLang}</p>
            <button class="button button_transparent bag-and-wishlist-menu__options-button" data-button-bag-form-open data-product-id="${product.productObj.id}">Змінити опції</button>
          </div>
          <div class="bag-and-wishlist-menu__amount-and-price-block">
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-name">${product.productObj.name}</p>
            <p class="text text_ff-poppins text_fw-300 bag-and-wishlist-menu__card-amount">x ${product.amount}</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price-name">Сума</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-price">${formatPrice(product.basicPrice)} ₴</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-total-price-name">Разом</p>
            <p class="text text_ff-poppins text_fw-600 bag-and-wishlist-menu__card-total-price">${formatPrice(product.totalPrice)} ₴</p>
          </div>
          <div class="bag-and-wishlist-menu__button-block">
            <a class="button bag-and-wishlist-menu__bag-button" href="${links.productPage}" alt="Перейти до кошика">Перейти до кошика</a>
            <button class="button button_transparent bag-and-wishlist-menu__delete-button" data-button-bag-delete>Видалити</button>
          </div>`;
        }

        card.innerHTML = inner;

        const deleteButton = card.querySelector('[data-button-bag-delete]');

        deleteButton.product = {
          id: product.productObj.id,
          mapSize: product.mapSize,
          mapType: product.mapType,
          mapLang: product.mapLang,
        };

        const changeOptionButton = card.querySelector('[data-button-bag-form-open]');

        changeOptionButton.changeOptions = {
          id: product.productObj.id,
          mapSize: product.mapSize,
          mapType: product.mapType,
          mapLang: product.mapLang,
          amount: product.amount,
        };

        cards.append(card);
      });
    }

    return cards;
  }

  bagMenuAddCircleToButton() {
    const bagProductAmount = this.bagProductsInStorage.length;

    if (bagProductAmount) {
      this.bagMenuButtonMobile.classList.add('bag-and-wishlist-menu__round-button-active');
      this.bagMenuButtonMobile.dataset.productAmount = bagProductAmount;
    } else {
      this.bagMenuButtonMobile.classList.remove('bag-and-wishlist-menu__round-button-active');
    }
  }

  bagMenuGenerateTotalPriceBlock() {
    if (this.bagProductsInStorage.length) {
      let totalPrice = 0;

      this.bagProductsInStorage.forEach((product) => {
        totalPrice += product.totalPrice;
      });

      const inner = `
        <p class="text text_ff-poppins text_18-px text_fw-600 bag-and-wishlist-menu__total-price-name">Загальна ціна</p>
        <p class="text text_ff-poppins text_18-px text_fw-600 bag-and-wishlist-menu__total-price">${formatPrice(totalPrice)} ₴</p>
      `;

      this.bagMenuTotalPriceBlock.innerHTML = inner;
    } else {
      this.bagMenuTotalPriceBlock.innerHTML = '';
    }
  }

  toggleActiveButtonClass() {
    const buttons = document.querySelectorAll('[data-button-bag-form-open]') || [];
    const bagProductsInStorageIds = this.bagProductsInStorage
      .map((product) => product.productObj.id);

    buttons.forEach((button) => {
      if (bagProductsInStorageIds.includes(+button.dataset.productId)) {
        button.classList.add('bag-and-wishlist-menu__round-button-selected');
      } else {
        button.classList.remove('bag-and-wishlist-menu__round-button-selected');
      }
    });
  }

  get bagProductsInStorage() {
    return JSON.parse(localStorage.getItem('bagProducts')) || [];
  }
}

export default function setupBagAndWishlistMenu() {
  new SetupWishlistMenu();
  new SetupBagMenu();
}
