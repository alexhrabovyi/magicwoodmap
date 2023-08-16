import Slider from '../../js-libs/_Slider.js';

export default function createSliders() {
  new Slider({
    containerSelector: '.reviews__slider-small-container',
    wrapperSelector: '.reviews__slider-small-wrapper',
    slidesSelector: '.reviews__slider-small-slide',
    gap: 11.2,
    slidesPerView: 2,
    buttons: {
      buttonPrevSelector: '#slider-small-prev',
      buttonNextSelector: '#slider-small-next',
    },
  });

  new Slider({
    containerSelector: '.reviews__slider-small-mobile-container',
    wrapperSelector: '.reviews__slider-small-mobile-wrapper',
    slidesSelector: '.reviews__slider-small-slide',
    gap: 20,
    buttons: {
      buttonPrevSelector: '#slider-small-prev',
      buttonNextSelector: '#slider-small-next',
    },
  });

  new Slider({
    containerSelector: '.reviews__slider-big-container',
    wrapperSelector: '.reviews__slider-big-wrapper',
    slidesSelector: '.reviews__slider-big-slide',
    gap: 10,
    buttons: {
      buttonPrevSelector: '#slider-big-prev',
      buttonNextSelector: '#slider-big-next',
    },
    counter: {
      currentNumSelector: '.reviews__current-slide-number',
      totalNumSelector: '.reviews__total-slide-number',
    },
  });
}
