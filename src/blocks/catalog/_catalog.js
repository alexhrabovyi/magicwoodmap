/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import formatPrice from '../../js-libs/_formatPrice';
import generateRateStars from '../../js-libs/_generateRateStars';
import SetupMenu from '../../js-libs/_SetupMenu';
import SetupPopup from '../../js-libs/_SetupPopup';
import productObjects from '../../js-libs/_productObjects';
import { SetupWishlistMenu } from '../bag-and-wishlist-menu/_bag-and-wishlist';

import img1 from './images/map_1.png';
import img2 from './images/map_2.png';
import img3 from './images/map_3.png';
import img4 from './images/map_4.png';
import img5 from './images/map_5.png';
import img6 from './images/map_6.png';

export default function setupCatalog() {
  const arr = [{
    linkHref: '#',
    linkAlt: 'Одношарова мапа',
    imgSrc: img1,
    imgAlt: 'Дерев\'яна мапа',
    titleLinkText: 'Одношарова мапа',
    currentPrice: 3000,
    descText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    rate: 3.5,
    categories: 'Одношарові мапи',
    productId: 0,
  },
  {
    linkHref: '#',
    linkAlt: 'Двошарова мапа',
    imgSrc: img5,
    imgAlt: 'Дерев\'яна мапа',
    titleLinkText: 'Двошарова мапа',
    currentPrice: 3515,
    oldPrice: 3700,
    descText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    rate: 3.7,
    categories: 'Багатошарові мапи',
    productId: 1,
  },
  {
    linkHref: '#',
    linkAlt: 'Двошарова мапа з підсвічуванням',
    imgSrc: img2,
    imgAlt: 'Дерев\'яна мапа з підсвічуванням',
    titleLinkText: 'Двошарова мапа з підсвічуванням',
    currentPrice: 4050,
    oldPrice: 4500,
    descText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    rate: 4.1,
    categories: 'Мапи з підсвічуванням',
    productId: 2,
  },
  {
    linkHref: '#',
    linkAlt: 'Тришарова мапа',
    imgSrc: img4,
    imgAlt: 'Дерев\'яна мапа',
    titleLinkText: 'Тришарова мапа',
    currentPrice: 4500,
    oldPrice: 5000,
    descText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    rate: 5,
    categories: 'Багатошарові мапи',
    productId: 3,
  },
  {
    linkHref: '#',
    linkAlt: 'Тришарова мапа з підсвічуванням',
    imgSrc: img3,
    imgAlt: 'Дерев\'яна мапа з підсвічуванням',
    titleLinkText: 'Тришарова мапа з підсвічуванням',
    currentPrice: 5130,
    oldPrice: 5700,
    descText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    rate: 4.4,
    categories: 'Мапи з підсвічуванням',
    productId: 4,
  },
  {
    linkHref: '#',
    linkAlt: 'Додатки до мап',
    imgSrc: img6,
    imgAlt: 'Піни з прапорами країн світу',
    titleLinkText: 'Додатки до мап',
    currentPrice: 800,
    oldPrice: 1000,
    descText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Magna in est adipiscing in phasellus non in justo.',
    rate: 4,
    categories: 'Додатки до мап',
    productId: 5,
  },
  ];

  class RenderCards {
    constructor(arrOfCardOptions, cardsPerView = 5) {
      this.originalArr = arrOfCardOptions.slice();
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

      this.initialSetupRange();
      this.initialSetupButtons();

      const cardOptions = this.sliceCards(0, this.cardsPerView);
      const cards = this.createCards(cardOptions);
      this.cardBlock.append(cards);

      this.updateCardAmount();
    }

    hideAndShowCards(arrOfCardOptions) {
      const cards = this.createCards(arrOfCardOptions);

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
      }, { once: true });
    }

    createCards(arrOfCardOptions) {
      let wishlistIds = JSON.parse(localStorage.getItem('wishlistProducts')) || [];
      wishlistIds = wishlistIds.map((item) => item.id);

      function createCard(options) {
        function setupRoundButtons() {
          if (wishlistIds.includes(options.productId)) {
            const wishlistButton = card.querySelector('[data-button-wishlist-add]');
            wishlistButton.classList.add('catalog__card-round-button_selected');
          }
        }

        const card = document.createElement('div');
        card.classList.add('catalog__card');
        card.dataset.productId = options.productId;

        const inner = `
        <a class="catalog__card-img-link" href="${options.linkHref}" alt="${options.linkAlt}">
          <img class="catalog__card-img" src="${options.imgSrc}" alt="${options.imgAlt}">
        </a>
        <div class="catalog__card-desc-block">
          <a class="link link_ff-poppins link_18-px link_fw-500 link_c-black catalog__card-title-link" href="${options.linkHref}" alt="${options.linkAlt}">
            ${options.titleLinkText}
          </a>
          <div class="catalog__card-price-and-rate-block">
            <p class="text text_ff-poppins text_c-orange catalog__card-current-price">${formatPrice(options.currentPrice)} UAH</p>
            <p class="text text_ff-poppins text_c-grey-12 catalog__card-old-price">${formatPrice(options.oldPrice) || ''}</p>
            <div class="catalog__card-rate-block"></div>
          </div>
          <p class="text text_c-grey-14 catalog__card-desc">${options.descText}</p>
          <div class="catalog__card-button-block">
            <button class="button button_transparent catalog__card-buy-button">Купити в 1 клік</button>
            <button class="round-button round-button_with-shadow round-button_small catalog__card-round-button">
              <i class="icon-bag"></i>
            </button>
            <button class="round-button round-button_with-shadow round-button_small catalog__card-round-button" data-button-wishlist-add>
              <i class="icon-like"></i>
            </button>
            <a class="link link_ff-poppins link_c-blue catalog__card-more-info-link" href="${options.linkHref}" alt="Переглянути →">
              Переглянути →
            </a>
          </div>
        </div>
        `;
        card.innerHTML = inner;

        setupRoundButtons();

        return card;
      }
      const cards = new DocumentFragment();

      arrOfCardOptions.forEach((option) => {
        const card = createCard(option);

        const cardRateBlock = card.querySelector('.catalog__card-rate-block');
        const { rate } = option;
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
        this.modifiedArr.sort((a, b) => b.currentPrice - a.currentPrice);
      } else if (sortBy === 'price-up') {
        this.modifiedArr.sort((a, b) => a.currentPrice - b.currentPrice);
      } else if (sortBy === 'rate-down') {
        this.modifiedArr.sort((a, b) => b.rate - a.rate);
      } else if (sortBy === 'rate-up') {
        this.modifiedArr.sort((a, b) => a.rate - b.rate);
      } else if (sortBy === 'name-A-Z') {
        this.modifiedArr.sort((a, b) => a.titleLinkText.localeCompare(b.titleLinkText));
      } else if (sortBy === 'name-Z-A') {
        this.modifiedArr.sort((a, b) => -a.titleLinkText.localeCompare(b.titleLinkText));
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
          if (!card.oldPrice) return;
          const percent = ((1 - (card.currentPrice / card.oldPrice)) * 100).toFixed(0);

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

      this.setupRange();
    }

    setupRange() {
      this.rangeBlock.classList.remove('catalog__range-block_disabled');

      if (!this.modifiedArr.length) return;

      const copyArr = this.modifiedArr.slice();
      copyArr.sort((a, b) => a.currentPrice - b.currentPrice);
      const minValue = copyArr[0].currentPrice;
      const maxValue = copyArr[copyArr.length - 1].currentPrice;

      this.rangeInputMin.min = minValue;
      this.rangeInputMax.min = minValue;
      this.rangeInputMin.max = maxValue;
      this.rangeInputMax.max = maxValue;

      if (this.setMinValue === undefined && this.setMaxValue === undefined) {
        this.rangeInputMin.value = minValue;
        this.rangeInputMax.value = maxValue;

        if (minValue === maxValue) this.rangeBlock.classList.add('catalog__range-block_disabled');
        return;
      }

      if (this.setMaxValue < minValue && this.setMinValue < minValue) {
        this.rangeInputMin.min = this.setMinValue;
        this.rangeInputMax.min = this.setMinValue;
        this.rangeInputMin.max = maxValue;
        this.rangeInputMax.max = maxValue;
      } else if (this.setMinValue > maxValue && this.setMaxValue > maxValue) {
        this.rangeInputMin.min = minValue;
        this.rangeInputMax.min = minValue;
        this.rangeInputMin.max = this.setMaxValue;
        this.rangeInputMax.max = this.setMaxValue;
      } else if (this.setMinValue < minValue && this.setMaxValue > maxValue) {
        this.rangeInputMin.min = this.setMinValue;
        this.rangeInputMax.min = this.setMinValue;
        this.rangeInputMin.max = this.setMaxValue;
        this.rangeInputMax.max = this.setMaxValue;
      } else if (this.setMinValue < minValue) {
        this.rangeInputMin.min = this.setMinValue;
        this.rangeInputMax.min = this.setMinValue;
        this.rangeInputMin.max = maxValue;
        this.rangeInputMax.max = maxValue;
      } else if (this.setMaxValue > maxValue) {
        this.rangeInputMin.min = minValue;
        this.rangeInputMax.min = minValue;
        this.rangeInputMin.max = this.setMaxValue;
        this.rangeInputMax.max = this.setMaxValue;
      } else {
        this.rangeInputMin.min = minValue;
        this.rangeInputMax.min = minValue;
        this.rangeInputMin.max = maxValue;
        this.rangeInputMax.max = maxValue;
      }

      rangeInstance.renderButton(this.setMinValue, 'min');
      rangeInstance.renderButton(this.setMaxValue, 'max');
    }

    sortByRangePrice() {
      const currentMinValue = +this.rangeInputMin.value;
      const currentMaxValue = +this.rangeInputMax.value;

      // eslint-disable-next-line arrow-body-style
      this.modifiedArr = this.modifiedArr.filter((card) => {
        return card.currentPrice >= currentMinValue && card.currentPrice <= currentMaxValue;
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
      this.buttonDisabledClass = 'catalog__pagination-round-button_disabled';

      this.paginationButtonBlock.addEventListener('click', this.paginationButtonOnClick.bind(this));

      this.buttonPrev.addEventListener('click', this.buttonOnClick.bind(this, 'prev'));
      this.buttonNext.addEventListener('click', this.buttonOnClick.bind(this, 'next'));

      this.setupButtons(1, 1);
      this.checkButtons();
    }

    setupButtons(firstButtonId, selectedButtonId) {
      function createButton(i) {
        const button = document.createElement('button');
        button.classList.add('catalog__pagination-button');
        button.dataset.paginationId = i;
        button.innerHTML = i;

        return button;
      }

      function createOverflowButton(type) {
        const overflowButton = document.createElement('button');
        overflowButton.classList.add('catalog__pagination-button');
        overflowButton.innerHTML = '...';

        if (type === 'left') {
          overflowButton.dataset.overflowLeft = true;
        } else if (type === 'right') {
          overflowButton.dataset.overflowRight = true;
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
          overflowButtonLeft.addEventListener('click', this.overflowButtonOnClick.bind(this, 'left'));
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
          overflowButtonRight.addEventListener('click', this.overflowButtonOnClick.bind(this, 'right'));

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
        if (i === this.selectedId) {
          this.selectButtons[i].classList.add(this.selectedButtonClass);
          this.selectChosenText.textContent = this.selectButtons[i].textContent;
        }
      }

      this.select.addEventListener('click', this.clickHandle.bind(this), { passive: true });
      window.addEventListener('resize', this.onOrientationChange.bind(this));
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
    }

    close() {
      this.isOpen = false;
      this.select.style.height = `${this.selectHeight - this.selectButtonBlockHeight}px`;
      this.selectArrowIcon.classList.remove(this.rotatedIconClass);
    }

    chooseOption(target) {
      const newButton = target.closest('.catalog__select-button');
      const oldButton = this.selectButtons[this.selectedId];

      oldButton.classList.remove(this.selectedButtonClass);
      newButton.classList.add(this.selectedButtonClass);

      this.selectChosenText.textContent = newButton.textContent;
      this.selectedId = +newButton.dataset.selectBtnId;

      const { selectType } = newButton.dataset;
      this.renderCardsInstance.sortAndShowCards(selectType);

      this.close();
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
    }

    toggle(e) {
      const button = e.target.closest('.catalog__checkbox-button');
      if (!button) return;

      const { checkboxValue } = button.dataset;
      const filter = [this.checkboxName, checkboxValue];

      if (!button.classList.contains(this.buttonActiveClass)) {
        this.renderCardsInstance.addFilter(filter);
        button.classList.add(this.buttonActiveClass);
      } else {
        this.renderCardsInstance.deleteFilter(filter);
        button.classList.remove(this.buttonActiveClass);
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

      this.buttonMin.addEventListener('mousedown', this.onMouseDown.bind(this, 'min'));
      this.buttonMax.addEventListener('mousedown', this.onMouseDown.bind(this, 'max'));

      this.setupInput();

      setTimeout(() => {
        this.buttonMin.style.left = '0%';
        this.buttonMax.style.left = `${100 - this.buttonWidth}%`;
      }, 0);
    }

    setupInput() {
      this.inputMin = this.rangeBlock.querySelector('#range-input-min');
      this.inputMax = this.rangeBlock.querySelector('#range-input-max');

      this.inputMin.addEventListener('focusout', this.onFocusOut.bind(this, 'min'), { passive: true });
      this.inputMax.addEventListener('focusout', this.onFocusOut.bind(this, 'max'), { passive: true });
    }

    onFocusOut(inputType, e) {
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

      this.renderButton(value, inputType);
      this.renderCardsInstance.sortByRangePriceAndShow();
    }

    onMouseDown(type, e) {
      e.preventDefault();
      const button = e.target.closest('.catalog__range-button');

      const shiftX = e.clientX - this.getElementLeftCoord(button);

      button.style.transitionDuration = '0s';

      const onMouseMoveModified = this.onMouseMove.bind(this, type, button, shiftX);
      document.addEventListener('mousemove', onMouseMoveModified);
      document.addEventListener('mouseup', this.onMouseUp.bind(this, button, onMouseMoveModified), { once: true });
    }

    onMouseMove(type, button, shiftX, event) {
      const rangeLineLeftCoord = this.getElementLeftCoord(this.rangeLine);

      let buttonShiftLeft = event.clientX - rangeLineLeftCoord - shiftX;
      buttonShiftLeft = +((buttonShiftLeft / this.rangeLineWidth) * 100).toFixed(2);

      if (type === 'min') {
        const buttonMaxLeftShift = this.getElementStyleLeft(this.buttonMax);

        if (buttonShiftLeft < 0) {
          buttonShiftLeft = 0;
        } else if (buttonShiftLeft > buttonMaxLeftShift - this.buttonWidth) {
          buttonShiftLeft = buttonMaxLeftShift - this.buttonWidth;
        }
      } else if (type === 'max') {
        const buttonMinLeftShift = this.getElementStyleLeft(this.buttonMin);

        if (buttonShiftLeft > 100 - this.buttonWidth) {
          buttonShiftLeft = 100 - this.buttonWidth;
        } else if (buttonShiftLeft < buttonMinLeftShift + this.buttonWidth) {
          buttonShiftLeft = buttonMinLeftShift + this.buttonWidth;
        }
      }
      button.style.left = `${buttonShiftLeft}%`;
      this.calcInputs(buttonShiftLeft, type);
    }

    onMouseUp(button, mouseMoveFunc) {
      button.style.transitionDuration = '';
      document.removeEventListener('mousemove', mouseMoveFunc);

      this.renderCardsInstance.sortByRangePriceAndShow();
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
      } else if (type === 'max') {
        this.inputMax.value = inputValue;
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
      });
    } else {
      content.classList.remove('menu', 'menu_animationRight', 'menu_animationLeft');
      content.style.cssText = '';
    }
  }

  function setupAddToWishlistButtons() {
    function addToWishlist(e) {
      const button = e.target.closest('[data-button-wishlist-add]');
      if (!button) return;

      const card = button.closest('.catalog__card');
      const productId = +card.dataset.productId;
      const productObj = productObjects[productId];

      let wishlistProductsInStorage = JSON.parse(localStorage.getItem('wishlistProducts')) || [];

      button.classList.toggle('catalog__card-round-button_selected');

      if (button.classList.contains('catalog__card-round-button_selected')) {
        wishlistProductsInStorage.push(productObj);
        wishlistProductsInStorage.sort((a, b) => a.id - b.id);
        wishlistProductsInStorage = JSON.stringify(wishlistProductsInStorage);

        localStorage.setItem('wishlistProducts', wishlistProductsInStorage);
      } else {
        const index = wishlistProductsInStorage.findIndex((item) => item.id === productObj.id);
        wishlistProductsInStorage.splice(index, 1);
        wishlistProductsInStorage = JSON.stringify(wishlistProductsInStorage);

        localStorage.setItem('wishlistProducts', wishlistProductsInStorage);
      }

      console.log(localStorage.getItem('wishlistProducts'));
      wishlistMenu.generateAndAddCards();
    }

    document.addEventListener('click', addToWishlist, { passive: true });
  }

  const renderCardsInstance = new RenderCards(arr, 5);
  new Select('.catalog__select', renderCardsInstance, 0);
  new Checkbox('[data-checkbox-name="categories"]', renderCardsInstance);
  new Checkbox('[data-checkbox-name="discount"]', renderCardsInstance);
  const rangeInstance = new Range('.catalog__range-block', renderCardsInstance);
  new SetupPopup({
    contentWrapperSelector: '.catalog__option-form-popup-window ',
    contentSelector: '.catalog__option-form',
    openButtonSelector: '.catalog__card-bag-button',
    closeButtonSelector: '.catalog__option-form-close-button',
  });

  setupFilterMenu();
  window.addEventListener('resize', setupFilterMenu, { passive: true });

  const wishlistMenu = new SetupWishlistMenu();
  setupAddToWishlistButtons();
}
