import Slider from '../../js-libs/_Slider';
import generateRateStars from '../../js-libs/_generateRateStars';
import smallImg1 from './images/small-img_1.png';
import smallImg2 from './images/small-img_2.png';
import smallImg3 from './images/small-img_3.png';
import smallImg4 from './images/small-img_4.png';

export default function setupProductDesc() {
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

  const sliderOptions = {
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

  new Slider(sliderOptions);
  createImgSliderPaginationButtons();

  const starBlock = document.querySelector('.product-desc__rate-star-block');
  const starBlockMobile = document.querySelector('.product-desc__rate-star-block-mobile');
  generateRateStars(4.3, starBlock);
  generateRateStars(4.3, starBlockMobile);
}
