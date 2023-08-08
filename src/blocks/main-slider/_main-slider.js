import Slider from '../../js-libs/_slider.js';

// export default function createMainSlider() {
//   new Slider({
//     containerSelector: '.main-slider__slider-container',
//     wrapperSelector: '.main-slider__slider-wrapper',
//     slidesSelector: '.main-slider__slide',
//     gap: 100,
//     pagination: {
//       paginationBlockSelector: '.main-slider__pagination-block',
//       paginationButtonClass: 'main-slider__pagination-button',
//       paginationButtonActiveClass: 'main-slider__pagination-button_active',
//     },
//   });
// }

export default function createMainSlider() {
  new Slider({
    containerSelector: '.main-slider__slider-container',
    wrapperSelector: '.main-slider__slider-wrapper',
    slidesSelector: '.main-slider__slide',
    gap: 5,
    pagination: {
      paginationBlockSelector: '.main-slider__pagination-block',
      paginationButtonClass: 'main-slider__pagination-button',
      paginationButtonActiveClass: 'main-slider__pagination-button_active',
    },
  });
}
