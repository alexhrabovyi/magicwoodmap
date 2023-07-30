// {
//   containerSelector: '.main-slider__slider-container',
//   wrapperSelector: '.main-slider__slider-wrapper',
//   slidesSelector: '.main-slider__slide',
//   activeSlideId: 0,
//   gap: 20,
//   transitionDuration: 0.7;
//   paginationBlockSelector: '.main-slider__pagination-block',
//   paginationButtonClass: 'main-slider__pagination-button',
//   paginationButtonActiveClass: 'main-slider__pagination-button_active',
//   autoTranslateTime: 5000,
//   buttonPrevSelector: '#prev',
//   buttonNextSelector: '#next',
// }

export default class Slider {
  constructor(options) {
    this.container = document.querySelector(options.containerSelector);
    this.wrapper = document.querySelector(options.wrapperSelector);
    this.slides = document.querySelectorAll(options.slidesSelector);
    this.activeSlideId = options.activeSlideId || 0;
    this.gap = options.gap || 0;
    this.transition = `${options.transitionDuration || 0.7}s all linear`;
    this.autoTranslateTime = options.autoTranslateTime || 0;

    this.setup();

    if (options.paginationBlockSelector) this.setupPagination(options);
    if (this.autoTranslateTime) this.setupAutoTranslate();
    if (options.buttonPrevSelector) this.setupPrevNextButtons(options);
  }

  setup() {
    this.wrapper.style.display = 'grid';
    this.wrapper.style.gridTemplateColumns = `repeat(${this.slides.length}, 100%)`;
    this.wrapper.style.gap = `${this.gap}px`;
    this.wrapper.style.transition = this.transition;

    this.container.style.overflow = 'hidden';
    this.container.style.userSelect = 'none';

    for (let i = 0; i < this.slides.length; i += 1) {
      this.slides[i].setAttribute('data-slide-id', i);
    }

    this.setupDragNDrop();

    setTimeout(() => { this.translateSlides(); }, 0);
  }

  setupPagination(options) {
    this.paginationBlock = document.querySelector(options.paginationBlockSelector);
    this.paginationButtonClass = options.paginationButtonClass;
    this.paginationButtonActiveClass = options.paginationButtonActiveClass;

    const paginationsButtons = new DocumentFragment();

    for (let i = 0; i < this.slides.length; i += 1) {
      const button = document.createElement('button');

      button.classList.add(this.paginationButtonClass);
      button.setAttribute('data-slide-id', i);

      if (i === this.activeSlideId) button.classList.add(this.paginationButtonActiveClass);

      paginationsButtons.append(button);
    }

    this.paginationBlock.append(paginationsButtons);
    this.paginationBlock.addEventListener('click', this.paginationHandle.bind(this));
  }

  paginationHandle(e) {
    const button = e.target.closest(`.${this.paginationButtonClass}`);
    if (!button) return;

    const newActiveSlideId = +button.dataset.slideId;
    if (newActiveSlideId === this.activeSlideId) return;

    this.togglePaginationButtons(this.activeSlideId, newActiveSlideId);
    this.activeSlideId = newActiveSlideId;
    this.translateSlides();
  }

  togglePaginationButtons(oldId, newId) {
    this.paginationBlock.querySelector(`[data-slide-id='${oldId}']`)
      .classList.remove(this.paginationButtonActiveClass);
    this.paginationBlock.querySelector(`[data-slide-id='${newId}']`)
      .classList.add(this.paginationButtonActiveClass);
  }

  setupAutoTranslate() {
    const autoTranslate = () => {
      let newActiveSlideId = this.activeSlideId + 1;
      if (newActiveSlideId === this.slides.length) newActiveSlideId = 0;

      this.translateAndToggle(this.activeSlideId, newActiveSlideId);
      setTimeout(autoTranslate, this.autoTranslateTime);
    };

    setTimeout(autoTranslate, this.autoTranslateTime);
  }

  setupPrevNextButtons(options) {
    const prevButton = document.querySelector(`${options.buttonPrevSelector}`);
    const nextButton = document.querySelector(`${options.buttonNextSelector}`);

    prevButton.setAttribute('data-button-type', 'prev');
    nextButton.setAttribute('data-button-type', 'next');

    const onClick = (e) => {
      const { buttonType } = e.target.closest('[data-button-type]').dataset;
      let newActiveSlideId = buttonType === 'prev' ? this.activeSlideId - 1 : this.activeSlideId + 1;

      if (newActiveSlideId < 0) newActiveSlideId = 0;
      if (newActiveSlideId === this.slides.length) return;

      this.translateAndToggle(this.activeSlideId, newActiveSlideId);
    };

    prevButton.addEventListener('click', onClick);
    nextButton.addEventListener('click', onClick);
  }

  setupDragNDrop() {
    this.wrapper.addEventListener('mousedown', (event) => {
      event.preventDefault();

      const calcCurrentTranslate = () => {
        const currentWrapperXCoord = this.wrapper.getBoundingClientRect().x;
        const containerXCoord = this.containerCoords.x;
        let translateValue;
        if (currentWrapperXCoord > 0) {
          translateValue = -(containerXCoord - currentWrapperXCoord);
        } else {
          translateValue = -(Math.abs(currentWrapperXCoord) + containerXCoord);
        }

        return translateValue;
      };

      const currentTranslateValue = calcCurrentTranslate();
      this.wrapper.style.transform = `translateX(${currentTranslateValue}px)`;
      this.wrapper.style.transition = 'none';

      const startX = event.clientX;
      let prevDiff = 0;
      const lastSlideTranslateValue = (this.slides.length - 1) * this.slideWidth
        + this.gap * (this.slides.length - 1);

      const mouseMove = (e) => {
        const currentX = e.clientX;
        let diff = currentX - startX;

        if ((Math.abs(currentTranslateValue + diff) > lastSlideTranslateValue)
          || currentTranslateValue + diff > 0) {
          diff = (diff - prevDiff) / 4 + prevDiff;
          this.wrapper.style.transform = `translateX(${currentTranslateValue + diff}px)`;

          return;
        }

        prevDiff = diff;

        this.wrapper.style.transform = `translateX(${currentTranslateValue + diff}px)`;
      };

      const mouseUp = (e) => {
        document.removeEventListener('mousemove', mouseMove);

        this.wrapper.style.transition = this.transition;

        let endX = e.clientX;
        const diff = endX - startX;

        const getSlideUnderCursorId = () => {
          const {
            x: containerXCoord,
            y: containerYCoord,
            right: containerRightCoord,
          } = this.containerCoords;

          if (endX < containerXCoord) endX = containerXCoord + 1;
          if (endX > containerRightCoord) endX = containerRightCoord - 1;

          const slideUnderCursorId = +document.elementFromPoint(endX, containerYCoord + 1)
            .closest('[data-slide-id]').dataset.slideId;

          return slideUnderCursorId;
        };

        const slideUnderCursorId = getSlideUnderCursorId();

        const getNewActiveSlideId = () => {
          let newActiveSlideId;

          if ((Math.abs(diff) < this.minMoveWidth)
            || (diff < 0 && slideUnderCursorId === this.slides.length - 1)
            || (diff > 0 && slideUnderCursorId === 0)) {
            newActiveSlideId = slideUnderCursorId;
            return newActiveSlideId;
          }

          newActiveSlideId = diff < 0 ? slideUnderCursorId + 1 : slideUnderCursorId - 1;
          return newActiveSlideId;
        };

        const newActiveSlideId = getNewActiveSlideId();
        this.translateAndToggle(this.activeSlideId, newActiveSlideId);

        document.removeEventListener('mouseup', mouseUp);
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    });
  }

  get slideWidth() {
    return this.slides[0].offsetWidth;
  }

  get containerCoords() {
    const { x, y, right } = this.container.getBoundingClientRect();
    return {
      x,
      y,
      right,
    };
  }

  get minMoveWidth() {
    return this.slideWidth * 0.07;
  }

  translateSlides() {
    const width = this.activeSlideId * this.slideWidth + this.gap * this.activeSlideId;
    this.wrapper.style.transform = `translateX(-${width}px)`;
  }

  translateAndToggle(oldId, newId) {
    this.paginationBlock.querySelector(`[data-slide-id='${oldId}']`).blur();
    this.togglePaginationButtons(oldId, newId);

    this.activeSlideId = newId;
    this.translateSlides();
  }
}
