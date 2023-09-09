import Slider from '../../js-libs/_Slider';
import generateRateStars from '../../js-libs/_generateRateStars';
import smallImg1 from './images/small-img_1.png';
import smallImg2 from './images/small-img_2.png';
import smallImg3 from './images/small-img_3.png';
import smallImg4 from './images/small-img_4.png';

export default function setupProductDesc() {
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
        this.tabContents[i].dataset.tabContentId = i;
      }

      this.tabButtons[this.selectedId].classList.add(this.tabButtonActiveClass);
      this.tabContents[this.selectedId].classList.add(this.tabContentActiveClass);

      this.tabContentBlock.style.height = `${this.getContentHeight(this.tabContents[this.selectedId])}px`;

      this.tabButtonBlock.addEventListener('click', this.toggle.bind(this), { passive: true });
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
      newButton.classList.add(this.tabButtonActiveClass);

      this.tabButtonBlock.style.pointerEvents = 'none';
      this.tabContentBlock.style.height = `${this.getContentHeight(this.tabContents[this.selectedId])}px`;

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
    },
    gap: 2,
  };

  new Slider(imgSliderOptions);
  createImgSliderPaginationButtons();

  const starBlock = document.querySelector('.product-desc__rate-star-block');
  const starBlockMobile = document.querySelector('.product-desc__rate-star-block-mobile');
  generateRateStars(4.3, starBlock);
  generateRateStars(4.3, starBlockMobile);

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
    },
  };

  const clientWidth = window.innerWidth;

  if (clientWidth <= 576) {
    recommendationSliderOptions.slidesPerView = 1;
    recommendationSliderOptions.gap = 5;
  } else if (clientWidth <= 768) {
    recommendationSliderOptions.slidesPerView = 2;
    recommendationSliderOptions.gap = 5;
  } else if (clientWidth <= 1024) {
    recommendationSliderOptions.slidesPerView = 3;
    recommendationSliderOptions.gap = 5;
  }

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
