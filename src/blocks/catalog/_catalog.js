/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import formatPrice from '../../js-libs/_formatPrice';
import generateRateStars from '../../js-libs/_generateRateStars';
import SetupMenu from '../../js-libs/_SetupMenu';
import productObjects from '../../js-libs/_productObjects';

import img1 from './images/map_1.png';
import img2 from './images/map_2.png';
import img3 from './images/map_3.png';
import img4 from './images/map_4.png';
import img5 from './images/map_5.png';
import img6 from './images/map_6.png';

const imgs = [img1, img2, img3, img4, img5, img6];

export default function setupCatalog() {
  class RenderCards {
    constructor(productObjects, cardsPerView = 5) {
      this.originalArr = productObjects.slice();
      this.modifiedArr = this.originalArr.slice();
      this.cardsPerView = cardsPerView;
      this.buttonsPerView = 5;
      this.sortType = '';
      this.filters = {
        categories: [],
        discount: [],
      };

      this.setup();
    }

    setup() {
      this.cardBlock = document.querySelector('.catalog__card-block ');
      this.catalog = document.querySelector('.catalog');
      this.cardAmount = document.querySelector('#card-amount');

      this.cardBlock.addEventListener('click', this.buttonBagFormOpenOnClick.bind(this));

      this.initialSetupRange();
      this.initialSetupButtons();

      const cardOptions = this.sliceCards(0, this.cardsPerView);
      const cards = this.createCards(cardOptions);
      this.cardBlock.append(cards);

      this.updateCardAmount();
    }

    buttonBagFormOpenOnClick(e) {
      e.preventDefault();

      let clickedButton = e.target.closest('[data-button-bag-form-open]');

      if (!clickedButton) return;

      const card = clickedButton.closest('.catalog__card');
      const productName = card.querySelector('.catalog__card-title-link').textContent;

      const clickObserverFunc = (e) => {
        const popup = document.querySelector('.bag-and-wishlist-menu__option-form-popup-window');

        const target = e.target.closest('.bag-and-wishlist-menu__option-form-close-button')
          || e.target.closest('[data-button-bag-add]') || e.target === popup;

        if (target) {
          setTimeout(() => {
            const allCards = this.cardBlock.querySelectorAll('.catalog__card');
            allCards.forEach((card) => {
              if (card.querySelector('.catalog__card-title-link').textContent === productName) {
                clickedButton = card.querySelector('[data-button-bag-form-open]');
                clickedButton.focus();
              }
            });
          });

          document.removeEventListener('click', clickObserverFunc, { passive: true });
        }
      };

      document.addEventListener('click', clickObserverFunc, { passive: true });
    }

    hideAndShowCards(productObjects) {
      const cards = this.createCards(productObjects);

      const cardBlockHeight = this.cardBlock.offsetHeight;
      this.cardBlock.style.height = `${cardBlockHeight}px`;
      this.cardBlock.style.opacity = 0;
      this.cardBlock.style.pointerEvents = 'none';

      this.catalog.scrollIntoView();

      this.cardBlock.addEventListener('transitionend', () => {
        this.cardBlock.innerHTML = '';
        this.cardBlock.append(cards);
        this.cardBlock.style.opacity = 1;
        this.cardBlock.style.height = '';
        this.cardBlock.style.pointerEvents = '';
      }, { once: true, passive: true });
    }

    createCards(productObjects) {
      let wishlistIds = JSON.parse(localStorage.getItem('wishlistProducts')) || [];
      wishlistIds = wishlistIds.map((product) => product.id);

      let bagIds = JSON.parse(localStorage.getItem('bagProducts')) || [];
      bagIds = bagIds.map((product) => product.productObj.id);

      function createCard(productObj) {
        const card = document.createElement('div');
        card.classList.add('catalog__card');

        const inner = `
        <a class="catalog__card-img-link" href="${productObj.pageLink}" alt="${productObj.name}" aria-label="Перейти на сторінку товару ${productObj.name}">
          <img class="catalog__card-img" src="${imgs[productObj.id]}" alt="${productObj.imgAlt}">
        </a>
        <div class="catalog__card-desc-block">
          <a class="link link_ff-poppins link_18-px link_fw-500 link_c-black catalog__card-title-link" href="${productObj.pageLink}" alt="${productObj.name}" aria-label="Перейти на сторінку товару ${productObj.name}">
            ${productObj.name}
          </a>
          <div class="catalog__card-price-and-rate-block">
            <p class="text text_ff-poppins text_c-orange catalog__card-current-price">${formatPrice(productObj.basicPrice)} UAH</p>
            <p class="text text_ff-poppins text_c-grey-12 catalog__card-old-price">${formatPrice(productObj.basicOldPrice) || ''}</p>
            <div class="catalog__card-rate-block"></div>
          </div>
          <p class="text text_c-grey-14 catalog__card-desc">${productObj.descText}</p>
          <div class="catalog__card-button-block">
            <button class="button button_transparent catalog__card-buy-button" data-button-bag-add data-product-id="${productObj.id}" aria-label="Купити товар ${productObj.name} в 1 клік">Купити в 1 клік</button>
            <button class="round-button round-button_with-shadow round-button_small catalog__card-round-button" data-button-bag-form-open data-product-id="${productObj.id}" aria-label="Відкрити меню вибору параметрів товару ${productObj.name}">
              <i class="icon-bag"></i>
            </button>
            <button class="round-button round-button_with-shadow round-button_small catalog__card-round-button" data-button-wishlist-add data-product-id="${productObj.id}" aria-label="Додати товар ${productObj.name} в список бажань">
              <i class="icon-like"></i>
            </button>
            <a class="link link_ff-poppins link_c-blue catalog__card-more-info-link" href="${productObj.pageLink}" alt="Переглянути →" aria-label="Перейти на сторінку товару ${productObj.name}">
              Переглянути →
            </a>
          </div>
        </div>
        `;
        card.innerHTML = inner;

        if (wishlistIds.includes(productObj.id)) {
          const wishlistButton = card.querySelector('[data-button-wishlist-add]');
          wishlistButton.classList.add('bag-and-wishlist-menu__round-button-selected');
        }

        if (bagIds.includes(productObj.id)) {
          const bagButton = card.querySelector('[data-button-bag-form-open]');
          bagButton.classList.add('bag-and-wishlist-menu__round-button-selected');
        }

        return card;
      }
      const cards = new DocumentFragment();

      productObjects.forEach((productObj) => {
        const card = createCard(productObj);

        const cardRateBlock = card.querySelector('.catalog__card-rate-block');
        const { rate } = productObj;
        generateRateStars(rate, cardRateBlock);

        cards.append(card);
      });

      return cards;
    }

    sliceCards(a, b) {
      this.firstShowingCardId = a;
      this.lastShowingCardId = b;
      this.showingCards = this.modifiedArr.slice(a, b);

      return this.showingCards;
    }

    sortCards(sortBy) {
      this.sortType = sortBy;

      if (sortBy === 'price-down') {
        this.modifiedArr.sort((a, b) => b.basicPrice - a.basicPrice);
      } else if (sortBy === 'price-up') {
        this.modifiedArr.sort((a, b) => a.basicPrice - b.basicPrice);
      } else if (sortBy === 'rate-down') {
        this.modifiedArr.sort((a, b) => b.rate - a.rate);
      } else if (sortBy === 'rate-up') {
        this.modifiedArr.sort((a, b) => a.rate - b.rate);
      } else if (sortBy === 'name-A-Z') {
        this.modifiedArr.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'name-Z-A') {
        this.modifiedArr.sort((a, b) => -a.name.localeCompare(b.name));
      } else if (sortBy === 'default') {
        this.filterOut();
        this.sortByRangePrice();
      }
    }

    sortAndShowCards(sortBy) {
      this.sortCards(sortBy);

      const cardOptions = this.sliceCards(this.firstShowingCardId, this.lastShowingCardId);
      this.hideAndShowCards(cardOptions);
    }

    addFilter([filterName, filterValue]) {
      this.filters[filterName].push(filterValue);

      this.filterOut();
      this.sortCards(this.sortType);
      this.setupRange();
      this.sortByRangePrice();
      this.updateCardAmount();
      this.setupButtons(1, 1);

      const cards = this.sliceCards(0, this.cardsPerView);
      this.hideAndShowCards(cards);
    }

    deleteFilter([filterName, filterValue]) {
      const index = this.filters[filterName].indexOf(filterValue);
      this.filters[filterName].splice(index, 1);

      this.filterOut();
      this.sortCards(this.sortType);
      this.setupRange();
      this.sortByRangePrice();
      this.updateCardAmount();
      this.setupButtons(1, 1);

      const cards = this.sliceCards(0, this.cardsPerView);
      this.hideAndShowCards(cards);
    }

    filterOut() {
      let modifiedArr = [];

      if (this.filters.categories.length !== 0) {
        const { categories } = this.filters;

        this.originalArr.forEach((card) => {
          if (categories.includes(card.categories)) {
            modifiedArr.push(card);
          }
        });
      }

      if (this.filters.discount.length !== 0) {
        if (!modifiedArr.length) modifiedArr = this.originalArr.slice();
        const { discount } = this.filters;
        const discountArr = [];

        modifiedArr.forEach((card) => {
          if (!card.basicOldPrice) return;
          const percent = ((1 - (card.basicPrice / card.basicOldPrice)) * 100).toFixed(0);

          if (discount.includes(percent)) {
            discountArr.push(card);
          }
        });

        modifiedArr = discountArr;
      }

      if (this.filters.categories.length === 0 && this.filters.discount.length === 0) {
        modifiedArr = this.originalArr.slice();
      }

      this.modifiedArr = modifiedArr;
    }

    initialSetupRange() {
      this.rangeBlock = document.querySelector('.catalog__range-block');
      this.rangeInputMin = document.querySelector('#range-input-min');
      this.rangeInputMax = document.querySelector('#range-input-max');
      this.rangeBtnMin = document.querySelector('#range-btn-min');
      this.rangeBtnMax = document.querySelector('#range-btn-max');

      this.setupRange();
    }

    setupRange() {
      this.rangeBlock.classList.remove('catalog__range-block_disabled');
      this.rangeInputMin.removeAttribute('disabled');
      this.rangeInputMax.removeAttribute('disabled');
      this.rangeBtnMin.removeAttribute('disabled');
      this.rangeBtnMax.removeAttribute('disabled');
      this.rangeInputMin.removeAttribute('aria-disabled');
      this.rangeInputMax.removeAttribute('aria-disabled');
      this.rangeBtnMin.removeAttribute('aria-disabled');
      this.rangeBtnMax.removeAttribute('aria-disabled');

      if (!this.modifiedArr.length) return;

      const copyArr = this.modifiedArr.slice();
      copyArr.sort((a, b) => a.basicPrice - b.basicPrice);
      const minValue = copyArr[0].basicPrice;
      const maxValue = copyArr[copyArr.length - 1].basicPrice;

      this.rangeInputMin.min = minValue;
      this.rangeInputMax.min = minValue;
      this.rangeInputMin.max = maxValue;
      this.rangeInputMax.max = maxValue;

      this.rangeBtnMin.setAttribute('aria-valuemin', minValue);
      this.rangeBtnMax.setAttribute('aria-valuemin', minValue);
      this.rangeBtnMin.setAttribute('aria-valuemax', maxValue);
      this.rangeBtnMax.setAttribute('aria-valuemax', maxValue);

      if (this.setMinValue === undefined && this.setMaxValue === undefined) {
        this.rangeInputMin.value = minValue;
        this.rangeInputMin.setAttribute('value', minValue);

        this.rangeInputMax.value = maxValue;
        this.rangeInputMax.setAttribute('value', maxValue);

        this.rangeBtnMin.setAttribute('aria-valuenow', minValue);
        this.rangeBtnMax.setAttribute('aria-valuenow', maxValue);

        if (minValue === maxValue) {
          this.rangeBlock.classList.add('catalog__range-block_disabled');
          this.rangeInputMin.setAttribute('disabled', true);
          this.rangeInputMax.setAttribute('disabled', true);
          this.rangeBtnMin.setAttribute('disabled', true);
          this.rangeBtnMax.setAttribute('disabled', true);
          this.rangeInputMin.setAttribute('aria-disabled', true);
          this.rangeInputMax.setAttribute('aria-disabled', true);
          this.rangeBtnMin.setAttribute('aria-disabled', true);
          this.rangeBtnMax.setAttribute('aria-disabled', true);
        }

        return;
      }

      if (this.setMaxValue < minValue && this.setMinValue < minValue) {
        this.rangeInputMin.min = this.setMinValue;
        this.rangeInputMax.min = this.setMinValue;
        this.rangeInputMin.max = maxValue;
        this.rangeInputMax.max = maxValue;

        this.rangeBtnMin.setAttribute('aria-valuemin', this.setMinValue);
        this.rangeBtnMax.setAttribute('aria-valuemin', this.setMinValue);
        this.rangeBtnMin.setAttribute('aria-valuemax', maxValue);
        this.rangeBtnMax.setAttribute('aria-valuemax', maxValue);
      } else if (this.setMinValue > maxValue && this.setMaxValue > maxValue) {
        this.rangeInputMin.min = minValue;
        this.rangeInputMax.min = minValue;
        this.rangeInputMin.max = this.setMaxValue;
        this.rangeInputMax.max = this.setMaxValue;

        this.rangeBtnMin.setAttribute('aria-valuemin', minValue);
        this.rangeBtnMax.setAttribute('aria-valuemin', minValue);
        this.rangeBtnMin.setAttribute('aria-valuemax', this.setMaxValue);
        this.rangeBtnMax.setAttribute('aria-valuemax', this.setMaxValue);
      } else if (this.setMinValue < minValue && this.setMaxValue > maxValue) {
        this.rangeInputMin.min = this.setMinValue;
        this.rangeInputMax.min = this.setMinValue;
        this.rangeInputMin.max = this.setMaxValue;
        this.rangeInputMax.max = this.setMaxValue;

        this.rangeBtnMin.setAttribute('aria-valuemin', this.setMinValue);
        this.rangeBtnMax.setAttribute('aria-valuemin', this.setMinValue);
        this.rangeBtnMin.setAttribute('aria-valuemax', this.setMaxValue);
        this.rangeBtnMax.setAttribute('aria-valuemax', this.setMaxValue);
      } else if (this.setMinValue < minValue) {
        this.rangeInputMin.min = this.setMinValue;
        this.rangeInputMax.min = this.setMinValue;
        this.rangeInputMin.max = maxValue;
        this.rangeInputMax.max = maxValue;

        this.rangeBtnMin.setAttribute('aria-valuemin', this.setMinValue);
        this.rangeBtnMax.setAttribute('aria-valuemin', this.setMinValue);
        this.rangeBtnMin.setAttribute('aria-valuemax', maxValue);
        this.rangeBtnMax.setAttribute('aria-valuemax', maxValue);
      } else if (this.setMaxValue > maxValue) {
        this.rangeInputMin.min = minValue;
        this.rangeInputMax.min = minValue;
        this.rangeInputMin.max = this.setMaxValue;
        this.rangeInputMax.max = this.setMaxValue;

        this.rangeBtnMin.setAttribute('aria-valuemin', minValue);
        this.rangeBtnMax.setAttribute('aria-valuemin', minValue);
        this.rangeBtnMin.setAttribute('aria-valuemax', this.setMaxValue);
        this.rangeBtnMax.setAttribute('aria-valuemax', this.setMaxValue);
      } else {
        this.rangeInputMin.min = minValue;
        this.rangeInputMax.min = minValue;
        this.rangeInputMin.max = maxValue;
        this.rangeInputMax.max = maxValue;

        this.rangeBtnMin.setAttribute('aria-valuemin', minValue);
        this.rangeBtnMax.setAttribute('aria-valuemin', minValue);
        this.rangeBtnMin.setAttribute('aria-valuemax', maxValue);
        this.rangeBtnMax.setAttribute('aria-valuemax', maxValue);
      }

      rangeInstance.renderButton(this.setMinValue, 'min');
      rangeInstance.renderButton(this.setMaxValue, 'max');
    }

    sortByRangePrice() {
      const currentMinValue = +this.rangeInputMin.value;
      const currentMaxValue = +this.rangeInputMax.value;

      // eslint-disable-next-line arrow-body-style
      this.modifiedArr = this.modifiedArr.filter((card) => {
        return card.basicPrice >= currentMinValue && card.basicPrice <= currentMaxValue;
      });
    }

    sortByRangePriceAndShow() {
      const currentMinValue = +this.rangeInputMin.value;
      const currentMaxValue = +this.rangeInputMax.value;

      this.setMinValue = currentMinValue;
      this.setMaxValue = currentMaxValue;

      this.filterOut();
      this.sortCards(this.sortType);
      this.sortByRangePrice();
      this.updateCardAmount();
      this.setupButtons(1, 1);

      const cards = this.sliceCards(0, this.cardsPerView);
      this.hideAndShowCards(cards);
    }

    updateCardAmount() {
      this.cardAmount.innerHTML = ` ${this.modifiedArr.length}`;
    }

    initialSetupButtons() {
      this.buttonPrev = document.querySelector('#pagination-prev');
      this.buttonNext = document.querySelector('#pagination-next');
      this.buttonBlock = document.querySelector('.catalog__pagination-block');
      this.paginationButtonBlock = document.querySelector('.catalog__pagination-buttons');

      this.paginationButtonSelectedClass = 'catalog__pagination-button_selected';
      this.buttonDisabledClass = 'round-button_disabled';

      this.paginationButtonBlock.addEventListener('click', this.paginationButtonOnClick.bind(this));

      this.buttonPrev.addEventListener('click', this.buttonOnClick.bind(this, 'prev'), { passive: true });
      this.buttonNext.addEventListener('click', this.buttonOnClick.bind(this, 'next'), { passive: true });

      this.setupButtons(1, 1);
      this.checkButtons();
    }

    setupButtons(firstButtonId, selectedButtonId) {
      function createButton(i) {
        const button = document.createElement('button');
        button.classList.add('catalog__pagination-button');
        button.dataset.paginationId = i;
        button.innerHTML = i;
        button.setAttribute('aria-label', `Перейти на сторінку товарів номер ${i}`);

        return button;
      }

      function createOverflowButton(type) {
        const overflowButton = document.createElement('button');
        overflowButton.classList.add('catalog__pagination-button');
        overflowButton.innerHTML = '...';

        if (type === 'left') {
          overflowButton.dataset.overflowLeft = true;
          overflowButton.setAttribute('aria-label', `Перейти на ${this.buttonsPerView} сторінок назад`);
        } else if (type === 'right') {
          overflowButton.dataset.overflowRight = true;
          overflowButton.setAttribute('aria-label', `Перейти на ${this.buttonsPerView} сторінок вперед`);
        }
        return overflowButton;
      }

      const buttonAmount = Math.ceil(this.modifiedArr.length / this.cardsPerView);

      if (buttonAmount > 1) {
        const lastShowButtonId = firstButtonId + this.buttonsPerView - 1;

        this.selectedButtonId = selectedButtonId;
        this.buttonBlock.style.display = 'flex';

        const buttons = new DocumentFragment();

        for (let i = firstButtonId; i <= lastShowButtonId; i += 1) {
          if (i > buttonAmount) break;

          const button = createButton(i);
          if (i === selectedButtonId) button.classList.add(this.paginationButtonSelectedClass);

          buttons.append(button);
        }

        if (firstButtonId === 2) {
          const firstButton = createButton(1);
          buttons.prepend(firstButton);
        } else if (firstButtonId === 3) {
          const firstButton = createButton(1);
          const secondButton = createButton(2);

          buttons.prepend(secondButton);
          buttons.prepend(firstButton);
        } else if (firstButtonId > 3) {
          const overflowButtonLeft = createOverflowButton('left');
          overflowButtonLeft.addEventListener('click', this.overflowButtonOnClick.bind(this, 'left'), { passive: true });
          buttons.prepend(overflowButtonLeft);

          const firstButton = createButton(1);
          buttons.prepend(firstButton);
        }

        if (buttonAmount - firstButtonId - this.buttonsPerView === 1) {
          const penultButton = createButton(buttonAmount - 1);
          buttons.append(penultButton);

          const lastButton = createButton(buttonAmount);
          buttons.append(lastButton);
        } else if (buttonAmount - firstButtonId - this.buttonsPerView === 0) {
          const lastButton = createButton(buttonAmount);
          buttons.append(lastButton);
        } else if (buttonAmount - firstButtonId >= this.buttonsPerView) {
          const overflowButtonRight = createOverflowButton('right');
          overflowButtonRight.addEventListener('click', this.overflowButtonOnClick.bind(this, 'right'), { passive: true });

          const lastButton = createButton(buttonAmount);

          buttons.append(overflowButtonRight);
          buttons.append(lastButton);
        }

        this.paginationButtonBlock.innerHTML = '';
        this.paginationButtonBlock.append(buttons);
      } else {
        this.buttonBlock.style.display = 'none';
      }
    }

    moveButton() {
      const buttonAmount = Math.ceil(this.modifiedArr.length / this.cardsPerView);
      const middleButton = +(Math.ceil(this.buttonsPerView / 2)).toFixed(0);

      let firstShownButton = this.selectedButtonId - (middleButton - 1);
      const lastShownButton = this.selectedButtonId + (middleButton - 1);

      if (firstShownButton < 1) {
        firstShownButton = 1;
      } else if (lastShownButton > buttonAmount) {
        const diff = lastShownButton - buttonAmount;
        firstShownButton = this.selectedButtonId - (middleButton - 1) - diff;

        if (firstShownButton < 1) firstShownButton = 1;
      }

      this.setupButtons(firstShownButton, this.selectedButtonId);
    }

    buttonOnClick(buttonType) {
      const oldPaginationButton = this.paginationButtonBlock.querySelector(`[data-pagination-id = '${this.selectedButtonId}']`);
      oldPaginationButton.classList.remove(this.paginationButtonSelectedClass);
      let cards;

      if (buttonType === 'prev') {
        this.selectedButtonId -= 1;
        cards = this.sliceCards(
          this.firstShowingCardId - this.cardsPerView,
          this.firstShowingCardId,
        );
      } else if (buttonType === 'next') {
        this.selectedButtonId += 1;
        cards = this.sliceCards(
          this.lastShowingCardId,
          this.lastShowingCardId + this.cardsPerView,
        );
      }

      this.checkButtons();

      const newPaginationButton = this.paginationButtonBlock.querySelector(`[data-pagination-id = '${this.selectedButtonId}']`);
      newPaginationButton.classList.add(this.paginationButtonSelectedClass);

      this.moveButton();
      this.hideAndShowCards(cards);
    }

    paginationButtonOnClick(e) {
      const currentButton = e.target.closest('[data-pagination-id]');
      if (!currentButton) return;

      const currentId = +currentButton.dataset.paginationId;

      if (this.selectedButtonId === currentId) return;

      const oldButton = this.paginationButtonBlock.querySelector(`[data-pagination-id = '${this.selectedButtonId}']`);
      oldButton.classList.remove(this.paginationButtonSelectedClass);
      currentButton.classList.add(this.paginationButtonSelectedClass);

      this.selectedButtonId = currentId;

      this.moveButton();
      this.checkButtons();

      const cards = this.sliceCards(
        (currentId - 1) * this.cardsPerView,
        currentId * this.cardsPerView,
      );

      this.hideAndShowCards(cards);
    }

    overflowButtonOnClick(type) {
      if (type === 'left') {
        const firstButton = this.paginationButtonBlock.querySelectorAll('[data-pagination-id]')[1];
        const firstButtonId = +firstButton.dataset.paginationId;

        this.selectedButtonId = firstButtonId - 1;
      } else if (type === 'right') {
        let lastButton = this.paginationButtonBlock.querySelectorAll('[data-pagination-id]');
        lastButton = lastButton[lastButton.length - 2];
        const lastButtonId = +lastButton.dataset.paginationId;

        this.selectedButtonId = lastButtonId + 1;
      }

      const cards = this.sliceCards(
        (this.selectedButtonId - 1) * this.cardsPerView,
        this.selectedButtonId * this.cardsPerView,
      );

      this.moveButton();
      this.hideAndShowCards(cards);
    }

    checkButtons() {
      this.buttonPrev.classList.remove(this.buttonDisabledClass);
      this.buttonPrev.disabled = false;
      this.buttonNext.classList.remove(this.buttonDisabledClass);
      this.buttonNext.disabled = false;

      const buttonAmount = Math.ceil(this.modifiedArr.length / this.cardsPerView);

      if (this.selectedButtonId === 1) {
        this.buttonPrev.classList.add(this.buttonDisabledClass);
        this.buttonPrev.disabled = true;
      } else if (this.selectedButtonId === buttonAmount) {
        this.buttonNext.classList.add(this.buttonDisabledClass);
        this.buttonNext.disabled = true;
      }
    }
  }

  class Select {
    constructor(selectSelector, renderCardsInstance, selectedId = 0) {
      this.select = document.querySelector(selectSelector);
      this.renderCardsInstance = renderCardsInstance;
      this.selectedId = selectedId;
      this.isOpen = false;

      this.selectedButtonClass = 'catalog__select-button_selected';
      this.rotatedIconClass = 'catalog__select-chosen-icon_rotated';

      this.setup();
    }

    setup() {
      this.selectChosenButton = this.select.querySelector('.catalog__select-chosen-block');
      this.selectChosenText = this.select.querySelector('.catalog__select-chosen-text');
      this.selectArrowIcon = this.select.querySelector('.catalog__select-chosen-icon');
      this.selectButtonBlock = this.select.querySelector('.catalog__select-button-block');
      this.selectButtons = this.select.querySelectorAll('.catalog__select-button');

      for (let i = 0; i < this.selectButtons.length; i += 1) {
        this.selectButtons[i].setAttribute('data-select-btn-id', i);
        this.selectButtons[i].setAttribute('tabindex', -1);
        this.selectButtons[i].setAttribute('aria-hidden', true);
        this.selectButtons[i].setAttribute('role', 'option');
        this.selectButtons[i].setAttribute('aria-selected', false);
        this.selectButtons[i].setAttribute('id', `selectopt${i}`);
        if (i === this.selectedId) {
          this.selectButtons[i].classList.add(this.selectedButtonClass);
          this.selectChosenText.textContent = this.selectButtons[i].textContent;
          this.selectButtons[i].setAttribute('aria-selected', true);
        }
      }

      this.selectButtonBlock.setAttribute('aria-activedescendant', this.selectButtons[this.selectedId].id);
      this.selectChosenButton.setAttribute('aria-label', `Вибрана опція: Сортувати ${this.selectChosenText.textContent}. Натисніть щоб відкрити меню опцій`);

      this.select.addEventListener('click', this.clickHandle.bind(this), { passive: true });
      document.addEventListener('keydown', this.onKeyDown.bind(this));
      window.addEventListener('resize', this.onOrientationChange.bind(this), { passive: true });
    }

    clickHandle(e) {
      const { target } = e;

      if (target.closest('.catalog__select-chosen-block')) this.toggle();
      if (target.closest('.catalog__select-button')) this.chooseOption(target);
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.select.style.height = `${this.selectHeight + this.selectButtonBlockHeight}px`;
      this.selectArrowIcon.classList.add(this.rotatedIconClass);
      this.selectButtons.forEach((button) => {
        button.setAttribute('tabindex', 0);
        button.setAttribute('aria-hidden', false);
      });
      this.selectButtons[0].focus();
    }

    close() {
      this.isOpen = false;
      this.select.style.height = `${this.selectHeight - this.selectButtonBlockHeight}px`;
      this.selectArrowIcon.classList.remove(this.rotatedIconClass);
      this.selectButtons.forEach((button) => {
        button.setAttribute('tabindex', -1);
        button.setAttribute('aria-hidden', true);
      });
    }

    chooseOption(target) {
      const newButton = target.closest('.catalog__select-button');
      const oldButton = this.selectButtons[this.selectedId];

      oldButton.classList.remove(this.selectedButtonClass);
      oldButton.setAttribute('aria-selected', false);
      newButton.classList.add(this.selectedButtonClass);
      newButton.setAttribute('aria-selected', true);

      this.selectChosenText.textContent = newButton.textContent;
      this.selectedId = +newButton.dataset.selectBtnId;

      this.selectButtonBlock.setAttribute('aria-activedescendant', this.selectButtons[this.selectedId].id);
      this.selectChosenButton.setAttribute('aria-label', `Вибрана опція: Сортувати ${this.selectChosenText.textContent}. Натисніть щоб відкрити меню опцій`);

      const { selectType } = newButton.dataset;
      this.renderCardsInstance.sortAndShowCards(selectType);

      this.close();
      this.selectChosenButton.focus();
    }

    onKeyDown(e) {
      if (!this.isOpen) return;

      if (e.code === 'ArrowDown') {
        e.preventDefault();

        if (!document.activeElement.classList.contains('catalog__select-button')) {
          this.selectButtons[0].focus();
          return;
        }

        let currentFocusedButtonId = +document.activeElement.dataset.selectBtnId;
        const lastButtonId = this.selectButtons.length - 1;

        if (currentFocusedButtonId === lastButtonId) {
          this.selectButtons[0].focus();
        } else {
          currentFocusedButtonId += 1;
          this.selectButtons[currentFocusedButtonId].focus();
        }
      }

      if (e.code === 'ArrowUp') {
        e.preventDefault();

        if (!document.activeElement.classList.contains('catalog__select-button')) {
          this.selectButtons[this.selectButtons.length - 1].focus();
          return;
        }

        let currentFocusedButtonId = +document.activeElement.dataset.selectBtnId;

        if (currentFocusedButtonId === 0) {
          this.selectButtons[this.selectButtons.length - 1].focus();
        } else {
          currentFocusedButtonId -= 1;
          this.selectButtons[currentFocusedButtonId].focus();
        }
      }

      if (e.code === 'Home') {
        e.preventDefault();

        this.selectButtons[0].focus();
      }

      if (e.code === 'End') {
        e.preventDefault();

        this.selectButtons[this.selectButtons.length - 1].focus();
      }
    }

    onOrientationChange() {
      if (this.isOpen) this.close();
    }

    get selectHeight() {
      return this.select.offsetHeight;
    }

    get selectButtonBlockHeight() {
      return this.selectButtonBlock.offsetHeight;
    }
  }

  class Checkbox {
    constructor(checkboxBlockSelector, renderCardsInstance) {
      this.checkboxBlock = document.querySelector(checkboxBlockSelector);
      this.renderCardsInstance = renderCardsInstance;
      this.buttonActiveClass = 'catalog__checkbox-button_checked';

      this.setup();
    }

    setup() {
      this.checkboxName = this.checkboxBlock.dataset.checkboxName;
      this.checkboxBlock.addEventListener('click', this.toggle.bind(this), { passive: true });

      const checkboxBtns = this.checkboxBlock.querySelectorAll('.catalog__checkbox-button');
      checkboxBtns.forEach((button) => {
        button.setAttribute('role', 'checkbox');
        button.setAttribute('aria-checked', false);
      });
    }

    toggle(e) {
      const button = e.target.closest('.catalog__checkbox-button');
      if (!button) return;

      const { checkboxValue } = button.dataset;
      const filter = [this.checkboxName, checkboxValue];

      if (!button.classList.contains(this.buttonActiveClass)) {
        this.renderCardsInstance.addFilter(filter);
        button.classList.add(this.buttonActiveClass);
        button.setAttribute('aria-checked', true);
      } else {
        this.renderCardsInstance.deleteFilter(filter);
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
      }
    }
  }

  class Range {
    constructor(rangeBlockSelector, renderCardsInstance) {
      this.rangeBlock = document.querySelector(rangeBlockSelector);
      this.renderCardsInstance = renderCardsInstance;

      this.setup();
    }

    setup() {
      this.rangeLine = this.rangeBlock.querySelector('.catalog__range-line');
      this.buttonMin = this.rangeBlock.querySelector('#range-btn-min');
      this.buttonMax = this.rangeBlock.querySelector('#range-btn-max');

      this.buttonMin.setAttribute('role', 'slider');
      this.buttonMax.setAttribute('role', 'slider');
      this.buttonMin.setAttribute('aria-orientation', 'horizontal');
      this.buttonMax.setAttribute('aria-orientation', 'horizontal');

      this.buttonMin.addEventListener('mousedown', this.onDownEvent.bind(this, 'min', false));
      this.buttonMin.addEventListener('touchstart', this.onDownEvent.bind(this, 'min', true));

      this.buttonMax.addEventListener('mousedown', this.onDownEvent.bind(this, 'max', false));
      this.buttonMax.addEventListener('touchstart', this.onDownEvent.bind(this, 'max', true));

      document.addEventListener('keydown', this.onKeyDown.bind(this));

      this.setupInput();

      setTimeout(() => {
        this.buttonMin.style.left = '0%';
        this.buttonMax.style.left = `${100 - this.buttonWidth}%`;
      }, 0);
    }

    setupInput() {
      this.inputMin = this.rangeBlock.querySelector('#range-input-min');
      this.inputMax = this.rangeBlock.querySelector('#range-input-max');

      this.inputMin.addEventListener('focusout', this.onSubmit.bind(this, 'min'), { passive: true });
      this.inputMax.addEventListener('focusout', this.onSubmit.bind(this, 'max'), { passive: true });

      document.addEventListener('keydown', (e) => {
        if (!document.activeElement.classList.contains('catalog__range-input')) return;

        if (e.code === 'Enter') {
          const button = document.activeElement.closest('.catalog__range-input');
          button.target = button;
          const type = button.id === 'range-input-min' ? 'min' : 'max';

          this.onSubmit(type, button);
        }
      }, { passive: true });
    }

    onSubmit(inputType, e) {
      const input = e.target.closest('input');

      if (input.value.length === 0) {
        input.value = input[inputType];
      }

      if (inputType === 'min') {
        if (+input.value < +input.min) input.value = input.min;
        if (+input.value >= +this.inputMax.value) input.value = this.inputMax.value;
      } else if (inputType === 'max') {
        if (+input.value > +input.max) input.value = input.max;
        if (+input.value < +this.inputMin.value) input.value = this.inputMin.value;
      }

      input.value = (+input.value).toFixed(0);
      const { value } = input;

      input.setAttribute('value', value);

      if (inputType === 'min') {
        this.buttonMin.setAttribute('aria-valuenow', value);
      } else if (inputType === 'max') {
        this.buttonMax.setAttribute('aria-valuenow', value);
      }

      this.renderButton(value, inputType);
      this.renderCardsInstance.sortByRangePriceAndShow();
    }

    onDownEvent(type, isMobile, e) {
      e.preventDefault();
      const button = e.target.closest('.catalog__range-button');

      const clientX = isMobile ? e.targetTouches[0].clientX : e.clientX;
      const shiftX = clientX - this.getElementLeftCoord(button);

      button.style.transitionDuration = '0s';

      if (isMobile) {
        const onMouseMoveModified = this.onMoveEvent.bind(this, type, button, shiftX, true);
        document.addEventListener('touchmove', onMouseMoveModified, { passive: true });
        document.addEventListener('touchend', this.onUpEvent.bind(this, button, onMouseMoveModified, true), { once: true, passive: true });
      } else {
        const onMouseMoveModified = this.onMoveEvent.bind(this, type, button, shiftX, false);
        document.addEventListener('mousemove', onMouseMoveModified, { passive: true });
        document.addEventListener('mouseup', this.onUpEvent.bind(this, button, onMouseMoveModified, false), { once: true, passive: true });
      }
    }

    onMoveEvent(type, button, shiftX, isMobile, event) {
      const rangeLineLeftCoord = this.getElementLeftCoord(this.rangeLine);
      const clientX = isMobile ? event.targetTouches[0].clientX : event.clientX;

      let buttonShiftLeft = clientX - rangeLineLeftCoord - shiftX;
      buttonShiftLeft = +((buttonShiftLeft / this.rangeLineWidth) * 100).toFixed(2);
      buttonShiftLeft = this.calcButtonShift(buttonShiftLeft, type);

      button.style.left = `${buttonShiftLeft}%`;
      this.calcInputs(buttonShiftLeft, type);
    }

    onUpEvent(button, mouseMoveFunc, isMobile) {
      button.style.transitionDuration = '';

      if (isMobile) {
        document.removeEventListener('touchmove', mouseMoveFunc, { passive: true });
      } else {
        document.removeEventListener('mousemove', mouseMoveFunc, { passive: true });
      }

      this.renderCardsInstance.sortByRangePriceAndShow();
    }

    onKeyDown(e) {
      if (!document.activeElement.classList.contains('catalog__range-button')) return;

      const button = e.target.closest('.catalog__range-button');
      const buttonType = button.id === 'range-btn-min' ? 'min' : 'max';

      let buttonStyleLeft;

      if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
        e.preventDefault();
        buttonStyleLeft = this.getElementStyleLeft(button) + 1;
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
        e.preventDefault();
        buttonStyleLeft = this.getElementStyleLeft(button) - 1;
      } else if (e.code === 'PageUp') {
        e.preventDefault();
        buttonStyleLeft = this.getElementStyleLeft(button) + 10;
      } else if (e.code === 'PageDown') {
        e.preventDefault();
        buttonStyleLeft = this.getElementStyleLeft(button) - 10;
      } else if (e.code === 'Home') {
        e.preventDefault();
        buttonStyleLeft = 0;
      } else if (e.code === 'End') {
        e.preventDefault();
        buttonStyleLeft = 100;
      }

      if (buttonStyleLeft !== undefined) {
        buttonStyleLeft = this.calcButtonShift(buttonStyleLeft, buttonType);
        button.style.left = `${buttonStyleLeft}%`;
        this.calcInputs(buttonStyleLeft, buttonType);

        if (!this.buttonIsPressed) {
          document.addEventListener('keyup', () => {
            this.renderCardsInstance.sortByRangePriceAndShow();
            this.buttonIsPressed = false;
          }, { once: true, passive: true });

          this.buttonIsPressed = true;
        }
      }
    }

    calcButtonShift(shiftLeft, type) {
      if (type === 'min') {
        const buttonMaxLeftShift = this.getElementStyleLeft(this.buttonMax);

        if (shiftLeft < 0) {
          shiftLeft = 0;
        } else if (shiftLeft > buttonMaxLeftShift - this.buttonWidth) {
          shiftLeft = buttonMaxLeftShift - this.buttonWidth;
        }
      } else if (type === 'max') {
        const buttonMinLeftShift = this.getElementStyleLeft(this.buttonMin);

        if (shiftLeft > 100 - this.buttonWidth) {
          shiftLeft = 100 - this.buttonWidth;
        } else if (shiftLeft < buttonMinLeftShift + this.buttonWidth) {
          shiftLeft = buttonMinLeftShift + this.buttonWidth;
        }
      }

      return shiftLeft;
    }

    calcInputs(shiftLeft, type) {
      const minValue = +this.inputMin.min;
      const maxValue = +this.inputMin.max;

      let percent;

      if (type === 'min') {
        percent = shiftLeft / (100 - this.buttonWidth * 2);
      } else if (type === 'max') {
        percent = (shiftLeft - this.buttonWidth) / (100 - this.buttonWidth * 2);
      }

      percent = +(percent.toFixed(2));
      const inputValue = (((maxValue - minValue) * percent) + minValue).toFixed(0);

      if (type === 'min') {
        this.inputMin.value = inputValue;
        this.inputMin.setAttribute('value', inputValue);
        this.buttonMin.setAttribute('aria-valuenow', inputValue);
      } else if (type === 'max') {
        this.inputMax.value = inputValue;
        this.inputMax.setAttribute('value', inputValue);
        this.buttonMax.setAttribute('aria-valuenow', inputValue);
      }
    }

    renderButton(value, inputType) {
      const minValue = +this.inputMin.min;
      const maxValue = +this.inputMin.max;
      const percent = +((value - minValue) / (maxValue - minValue)).toFixed(2);

      if (inputType === 'min') {
        const leftShift = (100 - this.buttonWidth * 2) * percent;
        this.buttonMin.style.left = `${leftShift}%`;
      } else if (inputType === 'max') {
        let leftShift = (100 - this.buttonWidth * 2) * percent;
        leftShift += this.buttonWidth;
        this.buttonMax.style.left = `${leftShift}%`;
      }
    }

    getElementLeftCoord(elem) {
      const { left } = elem.getBoundingClientRect();
      return left;
    }

    getElementStyleLeft(elem) {
      return +elem.style.left.match(/\d+(\.\d+)?/)[0];
    }

    get buttonWidth() {
      return +((this.buttonMin.offsetWidth / this.rangeLineWidth) * 100).toFixed(2);
    }

    get rangeLineWidth() {
      return this.rangeLine.offsetWidth;
    }
  }

  function setupFilterMenu() {
    const content = document.querySelector('.catalog__filter-blocks');

    if (window.innerWidth <= 1024) {
      new SetupMenu({
        openButtonsSelector: '.catalog__open-filters-button',
        closeButtonsSelector: '.catalog__filter-close-button',
        contentSelector: '.catalog__filter-blocks',
        animationFromLeft: false,
        ariaToggle: true,
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1024 && !content.classList.contains('menu')) {
        new SetupMenu({
          openButtonsSelector: '.catalog__open-filters-button',
          closeButtonsSelector: '.catalog__filter-close-button',
          contentSelector: '.catalog__filter-blocks',
          animationFromLeft: false,
          ariaToggle: true,
        });
      } else if (window.innerWidth > 1024 && content.classList.contains('menu')) {
        content.classList.remove('menu', 'menu_animationRight', 'menu_animationLeft');
        content.style.cssText = '';
      }
    }, { passive: true });
  }

  const renderCardsInstance = new RenderCards(productObjects, 5);
  new Select('.catalog__select', renderCardsInstance, 0);
  new Checkbox('[data-checkbox-name="categories"]', renderCardsInstance);
  new Checkbox('[data-checkbox-name="discount"]', renderCardsInstance);
  const rangeInstance = new Range('.catalog__range-block', renderCardsInstance);

  setupFilterMenu();
  window.addEventListener('resize', setupFilterMenu, { passive: true });
}
