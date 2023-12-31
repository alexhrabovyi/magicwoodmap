/* eslint-disable import/no-duplicates */
import { SetupWishlistMenu } from '../bag-and-wishlist-menu/_bag-and-wishlist';
import { SetupBagMenu } from '../bag-and-wishlist-menu/_bag-and-wishlist';
import formatPrice from '../../js-libs/_formatPrice';
import TelMask from '../../js-libs/_TelMask';
import AddInputValidation from '../../js-libs/_AddInputValidation';

import img1WEBP from './images/map_1.webp';
import img2WEBP from './images/map_2.webp';
import img3WEBP from './images/map_3.webp';
import img4WEBP from './images/map_4.webp';
import img5WEBP from './images/map_5.webp';
import img6WEBP from './images/map_6.webp';

import img1PNG from './images/map_1.png';
import img2PNG from './images/map_2.png';
import img3PNG from './images/map_3.png';
import img4PNG from './images/map_4.png';
import img5PNG from './images/map_5.png';
import img6PNG from './images/map_6.png';

const webpImgs = [img1WEBP, img2WEBP, img3WEBP, img4WEBP, img5WEBP, img6WEBP];
const pngImgs = [img1PNG, img2PNG, img3PNG, img4PNG, img5PNG, img6PNG];

export default function setupMainBag() {
  class SetupMainBag {
    constructor() {
      new SetupWishlistMenu();
      this.bagMenu = new SetupBagMenu();

      this.cardBlock = document.querySelector('.main-bag__product-table-cards');

      this.orderFormTotalPrice = document.querySelector('.main-bag__order-form-total-price');
      this.orderFormTotalOldPrice = document.querySelector('.main-bag__order-form-total-old-price');
      this.orderFormTotalDiscount = document.querySelector('.main-bag__order-form-total-discount');
      this.orderFormTotalProductAmount = document.querySelector('.main-bag__order-form-total-product-amount');

      this.bagClearButton = document.querySelector('[data-button-bag-clear]');

      this.mainSetup();
      this.formSetup();
    }

    mainSetup() {
      window.addEventListener('storage', this.onStorageEvent.bind(this), { passive: true });
      document.addEventListener('click', this.toggle.bind(this));

      setTimeout(() => {
        this.generateAndAddCards();
      });
    }

    formSetup() {
      this.orderFormResults = {};
      this.checkboxActiveClass = 'main-bag__payment-method-checkbox_checked';
      this.orderFormBlock = document.querySelector('.main-bag__order-form-block');
      this.paymentMethodForm = document.querySelector('[data-payment-method-form]');
      this.userInfoForm = document.querySelector('[data-user-info-form]');
      this.paymentMethodButtons = document.querySelectorAll('[data-payment-method-button]');
      this.submitButton = document.querySelector('#order-form-submit');
      this.paymentMethodNotice = document.querySelector('.main-bag__payment-method-notice');
      this.termsAgreeButton = document.querySelector('[data-button-terms-agree]');
      this.termsAgreeNotice = document.querySelector('.main-bag__terms-agree-notice');

      this.inputName = document.querySelector('#input-name');
      this.inputTel = document.querySelector('#input-tel');
      this.inputEmail = document.querySelector('#input-email');

      this.inputsAndValidationObjects = [
        [this.inputName, new AddInputValidation(this.inputName)],
        [this.inputTel, new AddInputValidation(this.inputTel)],
        [this.inputEmail, new AddInputValidation(this.inputEmail)],
      ];

      new TelMask(this.inputTel);

      window.addEventListener('resize', this.setupOrderFormBlock.bind(this), { passive: true });
      setTimeout(() => {
        this.setupOrderFormBlock();
      });
    }

    setupOrderFormBlock() {
      const desktopNav = document.querySelector('.main-nav__desktop');
      const clientWidth = window.innerWidth;
      let top;

      if (clientWidth > 1024) {
        top = desktopNav.offsetHeight + 30;
      } else {
        top = 0;
      }

      this.orderFormBlock.style.top = `${top}px`;
    }

    onStorageEvent(e) {
      if (e.key === 'bagProducts') {
        this.generateAndAddCards();
      }
    }

    toggle(e) {
      let button = e.target.closest('[data-button-bag-delete]');

      if (button) {
        this.deleteButtonOnClick(e, button);
      }

      button = e.target.closest('[data-card-amount-button]');

      if (button) {
        this.amountButtonOnClick(e, button);
      }

      button = e.target.closest('[data-button-bag-add]');

      if (button) {
        this.addToBagButtonOnClick(e);
      }

      button = e.target.closest('[data-button-bag-clear]');

      if (button) {
        this.bagClearButtonOnClick(e, button);
      }

      button = e.target.closest('[data-payment-method-button]');

      if (button) {
        this.paymentMethodButtonOnClick(e, button);
      }

      button = e.target.closest('#order-form-submit');

      if (button) {
        this.submitButtonOnClick(e);
      }

      button = e.target.closest('[data-button-terms-agree]');

      if (button) {
        this.termsAgreeButtonOnClick(e, button);
      }

      button = e.target.closest('[data-button-subscribe]');

      if (button) {
        this.buttonSubscribeOnClick(e, button);
      }
    }

    deleteButtonOnClick(e, button) {
      e.preventDefault();
      const isButtonInsideTable = button.closest('.main-bag__product-table-cards');

      this.generateAndAddCards();

      if (isButtonInsideTable) {
        setTimeout(() => {
          const deleteButton = this.cardBlock.querySelector('[data-button-bag-delete]');

          if (deleteButton) deleteButton.focus();
        });
      }
    }

    amountButtonOnClick(e, button) {
      e.preventDefault();
      const buttonType = button.dataset.cardAmountButton;

      if (buttonType === 'plus') {
        button.product.amount += 1;
      } else if (buttonType === 'minus') {
        button.product.amount -= 1;

        if (button.product.amount === 0) {
          button.product.amount = 1;
        }
      }

      const { bagProductsInStorage } = this;

      bagProductsInStorage.forEach((product) => {
        if (product.productObj.id === button.product.id
          && product.mapSize === button.product.mapSize
          && product.mapType === button.product.mapType
          && product.mapLang === button.product.mapLang) {
          product.amount = button.product.amount;
          product.totalPrice = product.basicPrice * product.amount;
        }
      });

      localStorage.setItem('bagProducts', JSON.stringify(bagProductsInStorage));

      this.generateAndAddCards();
      this.bagMenu.bagMenuGenerateAndAddCards();

      setTimeout(() => {
        const ogButtonProduct = button.product;

        const buttons = this.cardBlock.querySelectorAll(`[data-card-amount-button="${buttonType}"]`);

        buttons.forEach((button) => {
          if (ogButtonProduct.id === button.product.id
            && ogButtonProduct.mapSize === button.product.mapSize
            && ogButtonProduct.mapType === button.product.mapType
            && ogButtonProduct.mapLang === button.product.mapLang) {
            button.focus();
          }
        });
      });
    }

    addToBagButtonOnClick(e) {
      e.preventDefault();

      this.generateAndAddCards();
    }

    bagClearButtonOnClick(e, button) {
      e.preventDefault();
      button.blur();
      localStorage.removeItem('bagProducts');

      this.generateAndAddCards();
      this.bagMenu.bagMenuGenerateAndAddCards();
    }

    paymentMethodButtonOnClick(e, button) {
      e.preventDefault();

      this.paymentMethodNotice.innerHTML = '';

      this.paymentMethodButtons.forEach((button) => {
        button.classList.remove(this.checkboxActiveClass);
        button.setAttribute('aria-checked', false);
      });

      button.classList.add(this.checkboxActiveClass);
      button.setAttribute('aria-checked', true);

      this.orderFormResults.paymentMethod = button.dataset.paymentMethodButton;
    }

    submitButtonOnClick(e) {
      e.preventDefault();

      if (!this.orderFormResults.paymentMethod) {
        this.paymentMethodNotice.innerHTML = 'Необхідно обрати спосіб оплати';

        const paymentMethodButtnon = document.querySelector('[data-payment-method-button]');
        paymentMethodButtnon.focus();
        return;
      }

      try {
        this.inputsAndValidationObjects.forEach(([input, validationObj]) => {
          this.orderFormResults[input.name] = validationObj.validate();
        });
      } catch (err) {
        const form = document.querySelector('[data-user-info-form]');
        form.focus();

        console.log(err);
        return;
      }

      if (!this.orderFormResults.termsAgree) {
        this.termsAgreeNotice.textContent = 'Необхідно підтвердити, що Ви згодні з умовами';
        return;
      }

      console.log(this.orderFormResults);
      localStorage.removeItem('bagProducts');
      this.generateAndAddCards();
      this.bagMenu.bagMenuGenerateAndAddCards();

      const noticeBlock = document.createElement('tr');
      noticeBlock.classList.add('main-bag__empty-bag-notice-block');
      noticeBlock.setAttribute('aria-live', 'assertive');

      const inner = `
        <p class="title main-bag__grey-title">Дякуємо за замовлення!</p>
        <p class="text text_ff-poppins text_24-px main-bag__grey-text">Ми Вам зателефонуємо найближчим часом!</p>
      `;

      noticeBlock.innerHTML = inner;

      this.cardBlock.innerHTML = '';
      this.cardBlock.append(noticeBlock);
    }

    buttonSubscribeOnClick(e, button) {
      e.preventDefault();

      if (!button.classList.contains(this.checkboxActiveClass)) {
        button.classList.add(this.checkboxActiveClass);
        button.setAttribute('aria-checked', true);
      } else {
        button.classList.remove(this.checkboxActiveClass);
        button.setAttribute('aria-checked', false);
      }
    }

    termsAgreeButtonOnClick(e, button) {
      e.preventDefault();

      if (!button.classList.contains(this.checkboxActiveClass)) {
        button.classList.add(this.checkboxActiveClass);
        button.setAttribute('aria-checked', true);
        this.termsAgreeNotice.textContent = '';

        this.orderFormResults.termsAgree = true;
      } else {
        button.classList.remove(this.checkboxActiveClass);
        button.setAttribute('aria-checked', false);

        this.orderFormResults.termsAgree = false;
      }
    }

    generateAndAddCards() {
      const cards = this.generateCards();
      this.cardBlock.innerHTML = '';
      this.cardBlock.append(cards);

      this.updateOrderForm();
    }

    generateCards() {
      const { bagProductsInStorage } = this;

      this.bagClearButton.style.cssText = '';
      this.bagClearButton.disabled = false;
      this.bagClearButton.removeAttribute('aria-disabled');

      this.submitButton.style.cssText = '';
      this.submitButton.disabled = false;
      this.submitButton.removeAttribute('aria-disabled');

      if (bagProductsInStorage.length === 0) {
        this.bagClearButton.style.opacity = 0.7;
        this.bagClearButton.style.pointerEvents = 'none';
        this.bagClearButton.disabled = true;
        this.bagClearButton.setAttribute('aria-disabled', 'true');

        this.submitButton.style.opacity = 0.7;
        this.submitButton.style.pointerEvents = 'none';
        this.submitButton.disabled = true;

        const noticeBlock = document.createElement('tr');
        noticeBlock.classList.add('main-bag__empty-bag-notice-block');
        noticeBlock.setAttribute('aria-live', 'assertive');
        this.submitButton.setAttribute('aria-disabled', 'true');

        const inner = `
          <p class="title main-bag__grey-title">Ваш кошик порожній!</p>
          <p class="text text_ff-poppins text_24-px main-bag__grey-text">швидше обирай!</p>
        `;

        noticeBlock.innerHTML = inner;

        return noticeBlock;
      }

      const cards = new DocumentFragment();

      bagProductsInStorage.forEach((product) => {
        let mapLang;
        let mapSize;
        let basicOldPrice;

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

        if (product.basicOldPrice) {
          basicOldPrice = `${formatPrice(product.basicOldPrice)} ₴`;
        } else {
          basicOldPrice = '';
        }

        function generateDesc() {
          let desc;

          if (product.productObj.productType === 'map') {
            desc = `
              <p class="text text_ff-poppins text_12-px text_fw-600 text_c-grey-16 main-bag__card-text">Розмір мапи: ${product.mapSize}: ${mapSize}</p>
              <p class="text text_ff-poppins text_12-px text_fw-600 text_c-grey-16 main-bag__card-text">Тип мапи: ${product.mapType}</p>
              <p class="text text_ff-poppins text_12-px text_fw-600 text_c-grey-16 main-bag__card-text">Мова мапи: ${mapLang}</p>
            `;
          } else {
            desc = '';
          }

          return desc;
        }

        const card = document.createElement('tr');
        card.classList.add('main-bag__product-table-row', 'main-bag__product-table-row_for-card');

        const inner = `
          <td class="main-bag__product-table-desc-td">
            <button class="main-bag__delete-card-button" data-button-bag-delete aria-label="Видалити з кошику товар ${product.productObj.name}">+</button>
            <a class="main-bag__img-link" href="${product.productObj.pageLink}" alt="${product.productObj.name}" aria-label="Перейти на сторінку товару ${product.productObj.name}">
              <picture>
                <source type="image/webp" srcset="${webpImgs[product.productObj.id]}">
                <img class="main-bag__card-img" src="${pngImgs[product.productObj.id]}" width="87" height="87" alt="${product.productObj.imgAlt}">
              </picture>
            </a>
            <a class="link link_ff-poppins link_14-px link_fw-600 link_c-black-1 main-bag__card-link" href="${product.productObj.pageLink}" alt="${product.productObj.name}" aria-label="Перейти на сторінку товару ${product.productObj.name}">${product.productObj.name}</a>
            ${generateDesc()}
          </td>
          <td class="main-bag__product-table-price-td">
            <p class="text text_poppins text_14-px text_fw-600 text_c-orange main-bag__card-price">${formatPrice(product.basicPrice)} ₴</p>
            <p class="text text_poppins text_14-px text_fw-600 text_c-grey-12 main-bag__card-old-price">${basicOldPrice}</p>
          </td>
          <td class="main-bag__product-table-amount-td">
            <div class="main-bag__card-amount-buttons">
              <button class="main-bag__card-amount-button" data-card-amount-button="minus" aria-label="Зменшити кількість товару ${product.productObj.name} на один">-</button>
              <div class="main-bag__card-amount-display" aria-live="polite">${product.amount}</div>
              <button class="main-bag__card-amount-button" data-card-amount-button="plus" aria-label="Збільшити кількість товару ${product.productObj.name} на один">+</button>
            </div>
          </td>
          <td class="main-bag__product-table-total-price-td">
            <p class="text text_poppins text_14-px text_fw-600 text_c-orange main-bag__card-total-price">${formatPrice(product.totalPrice)} ₴</p>
          </td>
        `;

        card.innerHTML = inner;

        const deleteButton = card.querySelector('[data-button-bag-delete]');
        deleteButton.product = {
          id: product.productObj.id,
          mapSize: product.mapSize,
          mapType: product.mapType,
          mapLang: product.mapLang,
        };

        const amountButtons = card.querySelectorAll('[data-card-amount-button]');
        amountButtons.forEach((button) => {
          button.product = {
            id: product.productObj.id,
            mapSize: product.mapSize,
            mapType: product.mapType,
            mapLang: product.mapLang,
            amount: product.amount,
          };
        });

        cards.append(card);
      });

      return cards;
    }

    updateOrderForm() {
      const { bagProductsInStorage } = this;
      let totalPrice = 0;
      let totalOldPrice = 0;
      let totalDiscount = 0;
      let totalAmount = 0;

      bagProductsInStorage.forEach((product) => {
        totalPrice += product.totalPrice;
        totalAmount += product.amount;

        if (product.basicOldPrice) {
          totalOldPrice += product.basicOldPrice * product.amount;
          totalDiscount += product.basicOldPrice * product.amount - product.totalPrice;
        } else {
          totalOldPrice += product.totalPrice;
        }
      });

      totalPrice = `${formatPrice(totalPrice)} ₴`;
      totalOldPrice = `${formatPrice(totalOldPrice)} ₴`;
      totalDiscount = `${formatPrice(totalDiscount)} ₴`;

      this.orderFormTotalPrice.innerHTML = totalPrice;
      this.orderFormTotalOldPrice.innerHTML = totalOldPrice;
      this.orderFormTotalDiscount.innerHTML = totalDiscount;
      this.orderFormTotalProductAmount.innerHTML = totalAmount;
    }

    get bagProductsInStorage() {
      return JSON.parse(localStorage.getItem('bagProducts')) || [];
    }
  }

  new SetupMainBag();
}
