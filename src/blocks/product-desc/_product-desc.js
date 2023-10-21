/* eslint-disable max-classes-per-file */
import Slider from '../../js-libs/_Slider';
import generateRateStars from '../../js-libs/_generateRateStars';
import productObjects from '../../js-libs/_productObjects';
import formatPrice from '../../js-libs/_formatPrice';
import smallImg1 from './images/small-img_1.png';
import smallImg2 from './images/small-img_2.png';
import smallImg3 from './images/small-img_3.png';
import smallImg4 from './images/small-img_4.png';

export default function setupProductDesc() {
  class SetupOptionForm {
    constructor() {
      this.form = document.querySelector('.product-desc__checkout-form');
      this.id = 0;

      this.setup();
    }

    setup() {
      this.buttonActiveClass = 'product-desc__filter-button_active';

      this.addToBagButton = this.form.querySelector('[data-button-bag-add]');

      this.sizeButtons = this.form.querySelectorAll('[data-checkout-size-button]');
      this.typeButtons = this.form.querySelectorAll('[data-checkout-type-button]');
      this.langButtons = this.form.querySelectorAll('[data-checkout-lang-button]');

      this.currentPrice = this.form.querySelector('[data-checkout-current-price]');
      this.oldPrice = this.form.querySelector('[data-checkout-old-price]');

      this.addToBagButton.product = {};
      this.addToBagButton.product.productObj = productObjects[this.id];
      this.addToBagButton.product.mapSize = 'M';
      this.addToBagButton.product.mapType = 'Prime';
      this.addToBagButton.product.mapLang = 'ukr';
      this.addToBagButton.product.amount = 1;

      this.sizeButtons.forEach((button) => {
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
        if (button.dataset.checkoutSizeButton === 'M') {
          button.classList.add(this.buttonActiveClass);
          button.setAttribute('aria-checked', true);
        }
      });
      this.typeButtons.forEach((button) => {
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
        if (button.dataset.checkoutTypeButton === 'Prime') {
          button.classList.add(this.buttonActiveClass);
          button.setAttribute('aria-checked', true);
        }
      });
      this.langButtons.forEach((button) => {
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
        if (button.dataset.checkoutLangButton === 'ukr') {
          button.classList.add(this.buttonActiveClass);
          button.setAttribute('aria-checked', true);
        }
      });

      this.calcPriceAndShow();

      document.addEventListener('click', this.toggle.bind(this));
    }

    calcPriceAndShow() {
      let { basicPrice, basicOldPrice } = this.addToBagButton.product.productObj;

      basicPrice += this.addToBagButton
        .product.productObj.sizePrices[this.addToBagButton.product.mapSize];
      basicPrice += this.addToBagButton
        .product.productObj.typePrices[this.addToBagButton.product.mapType];

      if (basicOldPrice) {
        basicOldPrice += this.addToBagButton
          .product.productObj.sizePrices[this.addToBagButton.product.mapSize];
        basicOldPrice += this.addToBagButton
          .product.productObj.typePrices[this.addToBagButton.product.mapType];
      }

      const totalPrice = basicPrice * this.addToBagButton.product.amount;

      this.addToBagButton.product.basicPrice = basicPrice;
      this.addToBagButton.product.totalPrice = totalPrice;

      this.currentPrice.textContent = `${formatPrice(basicPrice)} ₴`;

      if (basicOldPrice) {
        this.oldPrice.textContent = `${formatPrice(basicOldPrice)} ₴`;
      } else {
        this.oldPrice.textContent = '';
      }
    }

    toggle(e) {
      let button = e.target.closest('[data-checkout-size-button]');
      if (button) {
        this.sizeButtonOnClick(e, button);
        return;
      }

      button = e.target.closest('[data-checkout-type-button]');
      if (button) {
        this.typeButtonOnClick(e, button);
        return;
      }

      button = e.target.closest('[data-checkout-lang-button]');
      if (button) {
        this.langButtonOnClick(e, button);
      }
    }

    sizeButtonOnClick(e, button) {
      e.preventDefault();

      this.sizeButtons.forEach((button) => {
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
      });
      button.classList.add(this.buttonActiveClass);
      button.setAttribute('aria-checked', true);

      this.addToBagButton.product.mapSize = button.dataset.checkoutSizeButton;

      this.calcPriceAndShow();
    }

    typeButtonOnClick(e, button) {
      e.preventDefault();

      this.typeButtons.forEach((button) => {
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
      });
      button.classList.add(this.buttonActiveClass);
      button.setAttribute('aria-checked', true);

      this.addToBagButton.product.mapType = button.dataset.checkoutTypeButton;

      this.calcPriceAndShow();
    }

    langButtonOnClick(e, button) {
      e.preventDefault();

      this.langButtons.forEach((button) => {
        button.classList.remove(this.buttonActiveClass);
        button.setAttribute('aria-checked', false);
      });
      button.classList.add(this.buttonActiveClass);
      button.setAttribute('aria-checked', true);

      this.addToBagButton.product.mapLang = button.dataset.checkoutLangButton;

      this.calcPriceAndShow();
    }
  }

  class SetupTab {
    constructor(options) {
      this.tabButtonBlock = document.querySelector(options.tabButtonBlockSelector);
      this.tabContentBlock = document.querySelector(options.tabContentBlockSelector);
      this.tabButtons = document.querySelectorAll(options.tabButtonSelector);
      this.tabContents = document.querySelectorAll(options.tabContentSelector);

      this.tabButtonActiveClass = options.tabButtonActiveClass;
      this.tabContentActiveClass = options.tabContentActiveClass;

      this.selectedId = options.selectedId || 0;

      this.setup();
    }

    setup() {
      for (let i = 0; i < this.tabButtons.length; i += 1) {
        this.tabButtons[i].dataset.tabButtonId = i;
        this.tabButtons[i].setAttribute('role', 'tab');
        this.tabButtons[i].setAttribute('aria-selected', false);
        this.tabButtons[i].setAttribute('aria-controls', `tabcontent${i}`);
        this.tabContents[i].dataset.tabContentId = i;
        this.tabContents[i].setAttribute('role', 'tabpanel');
        this.tabContents[i].setAttribute('id', `tabcontent${i}`);
      }

      this.tabButtons[this.selectedId].classList.add(this.tabButtonActiveClass);
      this.tabContents[this.selectedId].classList.add(this.tabContentActiveClass);

      this.tabButtonBlock.addEventListener('click', this.toggle.bind(this), { passive: true });

      setTimeout(() => {
        this.tabContentBlock.style.minHeight = `${this.getContentHeight(this.tabContents[this.selectedId])}px`;
      });
    }

    toggle(e) {
      const newButton = e.target.closest('button');
      if (!newButton) return;

      const newId = +newButton.dataset.tabButtonId;
      if (newId === this.selectedId) return;

      const newContent = this.tabContents[newId];
      const oldButton = this.tabButtons[this.selectedId];
      const oldContent = this.tabContents[this.selectedId];

      this.selectedId = newId;

      oldButton.classList.remove(this.tabButtonActiveClass);
      oldButton.setAttribute('aria-selected', false);
      newButton.classList.add(this.tabButtonActiveClass);
      newButton.setAttribute('aria-selected', true);

      this.tabButtonBlock.style.pointerEvents = 'none';
      this.tabContentBlock.style.minHeight = `${this.getContentHeight(this.tabContents[this.selectedId])}px`;

      oldContent.classList.remove(this.tabContentActiveClass);
      oldContent.addEventListener('transitionend', () => {
        newContent.classList.add(this.tabContentActiveClass);
        this.tabButtonBlock.style.pointerEvents = 'all';
      }, { once: true });
    }

    getContentHeight(el) {
      return el.offsetHeight;
    }
  }

  function createImgSliderPaginationButtons() {
    const paginationButtons = document.querySelectorAll('.product-desc__img-slider-pagination-button');
    const smallImgs = [smallImg1, smallImg2, smallImg3, smallImg4];

    for (let i = 0; i < paginationButtons.length; i += 1) {
      const img = document.createElement('img');
      img.classList.add('product-desc__img-slider-pagination-img');
      img.src = smallImgs[i];

      paginationButtons[i].append(img);
    }
  }

  new SetupOptionForm();

  const imgSliderOptions = {
    containerSelector: '.product-desc__img-slider-container',
    wrapperSelector: '.product-desc__img-slider-wrapper',
    slidesSelector: '.product-desc__img-slider-slide',
    pagination: {
      paginationBlockSelector: '.product-desc__img-slider-pagination-block',
      paginationButtonClass: 'product-desc__img-slider-pagination-button',
      paginationButtonActiveClass: 'product-desc__img-slider-pagination-button_active',
    },
    buttons: {
      buttonPrevSelector: '.product-desc__img-slider-button-prev',
      buttonNextSelector: '.product-desc__img-slider-button-next',
      disabledClass: 'round-button_disabled',
    },
    gap: 2,
  };

  new Slider(imgSliderOptions);
  createImgSliderPaginationButtons();

  const starBlock = document.querySelector('.product-desc__rate-star-block');
  const starBlockMobile = document.querySelector('.product-desc__rate-star-block-mobile');
  generateRateStars(3.5, starBlock);
  generateRateStars(3.5, starBlockMobile);

  new SetupTab({
    tabButtonBlockSelector: '.product-desc__tab-button-block',
    tabContentBlockSelector: '.product-desc__tab-content-block',
    tabButtonSelector: '.product-desc__tab-button',
    tabContentSelector: '.product-desc__tab-content',
    tabButtonActiveClass: 'product-desc__tab-button_active',
    tabContentActiveClass: 'product-desc__tab-content_active',
  });

  const recommendationSliderOptions = {
    containerSelector: '.product-desc__recommendation-slider-container',
    wrapperSelector: '.product-desc__recommendation-slider-wrapper',
    slidesSelector: '.product-desc__recommendation-slider-slide',
    slidesPerView: 5,
    gap: 1.12,
    buttons: {
      buttonPrevSelector: '.product-desc__recommendation-slider-button-prev',
      buttonNextSelector: '.product-desc__recommendation-slider-button-next',
      disabledClass: 'round-button_disabled',
    },
    breakpoints: {
      576: {
        slidesPerView: 1,
        gap: 5,
      },
      768: {
        slidesPerView: 2,
        gap: 5,
      },
      1024: {
        slidesPerView: 3,
        gap: 5,
      },
    },
  };

  new Slider(recommendationSliderOptions);

  function generateRecommendationSlideRateStars() {
    const recommendationSlideStarBlocks = document.querySelectorAll('.product-desc__recommendation-slider-stars-block ');
    const recommendationSlideRates = [3.5, 3.7, 4.1, 5, 4.4, 3.5, 3.7, 4.1, 5, 4.4];

    for (let i = 0; i < recommendationSlideStarBlocks.length; i += 1) {
      generateRateStars(recommendationSlideRates[i], recommendationSlideStarBlocks[i]);
    }
  }

  generateRecommendationSlideRateStars();
}
