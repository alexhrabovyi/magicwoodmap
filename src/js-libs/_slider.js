// {
//   containerSelector: '.main-slider__slider-container',
//   wrapperSelector: '.main-slider__slider-wrapper',
//   slidesSelector: '.main-slider__slide',
//   activeSlideId: 0,
//   slidesPerView: 1,
//   gap: 20,
//   transitionDuration: 0.7;
//   autoTranslateTime: 5000,
//   pagination: {
//    paginationBlockSelector: '.main-slider__pagination-block',
//    paginationButtonClass: 'main-slider__pagination-button',
//    paginationButtonActiveClass: 'main-slider__pagination-button_active',
//   },
//   buttons: {
//    buttonPrevSelector: '#prev',
//    buttonNextSelector: '#next',
//   },
//   counter: {
//    currentNumSelector: '.reviews__current-slide-number',
//    totalNumSelector: '.reviews__total-slide-number',
//   },
// }

export default class Slider {
  constructor(options) {
    this.container = document.querySelector(options.containerSelector);
    this.wrapper = this.container.querySelector(options.wrapperSelector);
    this.slides = this.container.querySelectorAll(options.slidesSelector);
    this.activeSlideId = options.activeSlideId || 0;
    this.slidesPerView = options.slidesPerView || 1;
    this.gap = options.gap || 0;
    this.transition = `${options.transitionDuration || 0.7}s all linear`;

    this.setup();

    if (options.pagination) this.setupPagination(options);
    if (options.autoTranslateTime) this.setupAutoTranslate();
    if (options.buttons) this.setupPrevNextButtons(options);
    if (options.counter) this.setupCounter(options);
  }

  setup() {
    this.wrapper.style.display = 'grid';
    this.wrapper.style.gridTemplateColumns = `repeat(${this.slides.length}, ${(100 - this.gap * (this.slidesPerView - 1)) / this.slidesPerView}%)`;
    this.wrapper.style.columnGap = `${this.gap}%`;
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
    this.paginationBlock = document.querySelector(options.pagination.paginationBlockSelector);
    this.paginationButtonClass = options.pagination.paginationButtonClass;
    this.paginationButtonActiveClass = options.pagination.paginationButtonActiveClass;

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

    this.translateAndToggle(this.activeSlideId, newActiveSlideId);
  }

  togglePaginationButtons(oldId, newId) {
    this.paginationBlock.querySelector(`[data-slide-id='${oldId}']`)
      .classList.remove(this.paginationButtonActiveClass);
    this.paginationBlock.querySelector(`[data-slide-id='${newId}']`)
      .classList.add(this.paginationButtonActiveClass);
  }

  setupAutoTranslate(options) {
    const { autoTranslateTime } = options;

    const autoTranslate = () => {
      let newActiveSlideId = this.activeSlideId + 1;
      if (newActiveSlideId === this.slides.length) newActiveSlideId = 0;

      this.translateAndToggle(this.activeSlideId, newActiveSlideId);
      setTimeout(autoTranslate, autoTranslateTime);
    };

    setTimeout(autoTranslate, autoTranslateTime);
  }

  setupPrevNextButtons(options) {
    const prevButton = document.querySelector(`${options.buttons.buttonPrevSelector}`);
    const nextButton = document.querySelector(`${options.buttons.buttonNextSelector}`);

    prevButton.setAttribute('data-button-type', 'prev');
    nextButton.setAttribute('data-button-type', 'next');

    const onClick = (e) => {
      const button = e.target.closest('[data-button-type]');
      const { buttonType } = button.dataset;
      let newActiveSlideId = buttonType === 'prev' ? this.activeSlideId - 1 : this.activeSlideId + 1;

      if (newActiveSlideId < 0) newActiveSlideId = 0;
      if (newActiveSlideId === this.slides.length) return;

      this.translateAndToggle(this.activeSlideId, newActiveSlideId);

      button.blur();
    };

    prevButton.addEventListener('click', onClick);
    nextButton.addEventListener('click', onClick);
  }

  setupCounter(options) {
    this.currentNum = document.querySelector(options.counter.currentNumSelector);
    this.totalNum = document.querySelector(options.counter.totalNumSelector);

    this.currentNum.innerHTML = this.formatNum(this.activeSlideId + 1);
    this.totalNum.innerHTML = this.formatNum(this.slides.length);
  }

  setupDragNDrop() {
    const handler = (isMobile) => {
      this.wrapper.addEventListener(isMobile ? 'touchstart' : 'mousedown', (event) => {
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
        this.wrapper.style.cursor = 'grab';
        this.wrapper.style.transform = `translateX(${currentTranslateValue}px)`;
        this.wrapper.style.transition = 'none';

        const startX = isMobile ? event.targetTouches[0].clientX : event.clientX;

        let prevDiff = 0;
        const lastSlideTranslateValue = this.slideWidth * (this.slides.length - 1)
          + this.gapWidth * (this.slides.length - 1);

        const moveEvent = (e) => {
          const currentX = isMobile ? e.targetTouches[0].clientX : e.clientX;
          let diff = currentX - startX;

          if ((Math.abs(currentTranslateValue + diff) > lastSlideTranslateValue)
            || (currentTranslateValue + diff > 0)
            || (this.slidesPerView > 1
              && Math.abs(currentTranslateValue + diff)
              > lastSlideTranslateValue - this.slideWidth / 2)) {
            diff = (diff - prevDiff) / 4 + prevDiff;
            this.wrapper.style.transform = `translateX(${currentTranslateValue + diff}px)`;

            return;
          }

          prevDiff = diff;

          this.wrapper.style.transform = `translateX(${currentTranslateValue + diff}px)`;
        };

        const upEvent = (e) => {
          document.removeEventListener(isMobile ? 'touchmove' : 'mousemove', moveEvent);

          this.wrapper.style.transition = this.transition;
          this.wrapper.style.cursor = '';

          let endX = isMobile ? e.changedTouches[0].clientX : e.clientX;
          const diff = endX - startX;

          const getSlideUnderCursorId = () => {
            const {
              x: containerXCoord,
              y: containerYCoord,
              right: containerRightCoord,
            } = this.containerCoords;

            if (endX < containerXCoord) endX = containerXCoord + 1;
            if (endX > containerRightCoord) endX = containerRightCoord - 1;

            const slideUnderCursor = document.elementFromPoint(endX, containerYCoord + 1).closest('[data-slide-id]');

            if (!slideUnderCursor) return this.activeSlideId;

            const slideUnderCursorId = +slideUnderCursor.dataset.slideId;
            return slideUnderCursorId;
          };

          const slideUnderCursorId = getSlideUnderCursorId();

          const getNewActiveSlideId = () => {
            let newActiveSlideId;

            if ((Math.abs(diff) < this.minMoveWidth)
              || (diff < 0 && slideUnderCursorId === this.slides.length - 1)
              || (diff > 0 && slideUnderCursorId === 0)
            ) {
              newActiveSlideId = slideUnderCursorId;
              return newActiveSlideId;
            }

            newActiveSlideId = diff < 0 ? slideUnderCursorId + 1 : slideUnderCursorId - 1;
            return newActiveSlideId;
          };

          const newActiveSlideId = getNewActiveSlideId();
          this.translateAndToggle(this.activeSlideId, newActiveSlideId);

          document.removeEventListener(isMobile ? 'touchend' : 'mouseup', upEvent);
        };

        document.addEventListener(isMobile ? 'touchmove' : 'mousemove', moveEvent);
        document.addEventListener(isMobile ? 'touchend' : 'mouseup', upEvent);
      });
    };

    handler(false);
    handler(true);
  }

  get gapWidth() {
    return (this.wrapper.offsetWidth * this.gap) / 100;
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
    return this.slideWidth * 0.2;
  }

  translateSlides() {
    let width = this.activeSlideId * this.slideWidth + this.gapWidth * this.activeSlideId;

    if (this.activeSlideId === this.slides.length - 1 && this.slidesPerView > 1) {
      width -= this.slideWidth / 2;
    }

    this.wrapper.style.transform = `translateX(-${width}px)`;
  }

  translateAndToggle(oldId, newId) {
    if (this.paginationBlock) {
      this.paginationBlock.querySelector(`[data-slide-id='${oldId}']`).blur();
      this.togglePaginationButtons(oldId, newId);
    }

    if (this.currentNum) {
      this.currentNum.innerHTML = this.formatNum(newId + 1);
    }

    this.activeSlideId = newId;
    this.translateSlides();
  }

  // eslint-disable-next-line class-methods-use-this
  formatNum(num) {
    const result = num < 10 ? `0${num}` : num;
    return result;
  }
}
