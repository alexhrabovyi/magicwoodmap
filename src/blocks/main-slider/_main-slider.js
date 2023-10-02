import Slider from '../../js-libs/_Slider.js';

export default function setupMainSliderBlock() {
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

  function buttonReadBelowOnClick() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-button-read-below]');

      if (!button) {
        return;
      }

      e.preventDefault();

      const advantagesBlock = document.querySelector('.advantages');
      const advantagesBlockYCoord = advantagesBlock.getBoundingClientRect().y;

      const navPanel = document.querySelector('.main-nav') || document.querySelector('.main-nav__mobile');
      const navPanelHeight = navPanel.offsetHeight;

      window.scrollTo(0, advantagesBlockYCoord - navPanelHeight);
    });
  }

  buttonReadBelowOnClick();
}
