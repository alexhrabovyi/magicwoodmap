/* eslint-disable no-prototype-builtins */
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
//    disabledClass: 'round-button_disabled',
//   },
//   counter: {
//    currentNumSelector: '.reviews__current-slide-number',
//    totalNumSelector: '.reviews__total-slide-number',
//   },
//  breakpoints: {
//   '1024': {
//     options,
//   }
//  }
// }

export default class Slider {
  constructor(options) {
    if (options.breakpoints) {
      this.breakpointObjects = this.deepClone(options.breakpoints);
      this.breakpoints = Object.keys(options.breakpoints).map((a) => +a).sort((a, b) => a - b);

      const clientWidth = window.innerWidth;

      let noBreakpoints = true;

      for (const breakpoint of this.breakpoints) {
        if (clientWidth <= breakpoint) {
          noBreakpoints = false;
          const breakpointObject = this.breakpointObjects[`${breakpoint}`];

          const newOptions = this.deepClone(options);

          for (const key in newOptions) {
            if (breakpointObject[key] !== undefined) {
              if (typeof newOptions[key] === 'object') {
                Object.assign(newOptions[key], breakpointObject[key]);
              } else {
                newOptions[key] = breakpointObject[key];
              }
            }
          }

          this.setup(newOptions);
          break;
        }
      }

      this.setupBreakpoints(options);

      if (noBreakpoints) {
        this.setup(options);
      }
    } else {
      this.setup(options);
    }
  }

  setup(options) {
    this.container = document.querySelector(options.containerSelector);
    this.wrapper = this.container.querySelector(options.wrapperSelector);
    this.slides = this.container.querySelectorAll(options.slidesSelector);
    this.activeSlideId = options.activeSlideId || 0;
    this.slidesPerView = options.slidesPerView || 1;
    this.gap = options.gap || 0;
    this.transition = `${options.transitionDuration || 0.7}s all linear`;

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

    if (options.pagination) this.setupPagination(options);
    if (options.autoTranslateTime) this.setupAutoTranslate();
    if (options.buttons) this.setupPrevNextButtons(options);
    if (options.counter) this.setupCounter(options);

    setTimeout(() => { this.translateSlides(this.activeSlideId); }, 0);
  }

  resetup(options, breakpointObject) {
    const newOptions = this.deepClone(options);

    for (const key in newOptions) {
      if (breakpointObject[key] !== undefined) {
        if (typeof newOptions[key] === 'object') {
          Object.assign(newOptions[key], breakpointObject[key]);
        } else {
          newOptions[key] = breakpointObject[key];
        }
      }
    }

    this.wrapper.removeEventListener('touchstart', this.onMouseDownMobileModified);
    this.wrapper.removeEventListener('mousedown', this.onMouseDownDesktopModified);

    if (options.pagination) {
      this.paginationBlock.innerHTML = '';
      this.paginationBlock.removeEventListener('click', this.paginationHandleModified);
    }

    if (options.setupAutoTranslate) {
      clearTimeout(this.timerId);
    }

    if (options.buttons) {
      this.prevButton.removeEventListener('click', this.prevNextButtonOnClick);
      this.nextButton.removeEventListener('click', this.prevNextButtonOnClick);
    }

    this.setup(newOptions);
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

    this.paginationHandleModified = this.paginationHandle.bind(this);
    this.paginationBlock.addEventListener('click', this.paginationHandleModified);
  }

  setupAutoTranslate(options) {
    const { autoTranslateTime } = options;

    const autoTranslate = () => {
      this.activeSlideId += 1;
      if (this.activeSlideId === this.slides.length) this.activeSlideId = 0;

      this.translateAndToggle(this.activeSlideId);
      this.timerId = setTimeout(autoTranslate, autoTranslateTime);
    };

    this.timerId = setTimeout(autoTranslate, autoTranslateTime);
  }

  setupPrevNextButtons(options) {
    this.prevButton = document.querySelector(`${options.buttons.buttonPrevSelector}`);
    this.nextButton = document.querySelector(`${options.buttons.buttonNextSelector}`);

    this.buttonDisabledClass = options.buttons.disabledClass;

    this.prevButton.setAttribute('data-button-type', 'prev');
    this.nextButton.setAttribute('data-button-type', 'next');

    this.checkPrevNextButtons();

    this.prevNextButtonOnClick = (e) => {
      const button = e.target.closest('[data-button-type]');
      const { buttonType } = button.dataset;

      if (this.slidesPerView === 1) {
        this.activeSlideId = buttonType === 'prev' ? this.activeSlideId - 1 : this.activeSlideId + 1;

        if (this.activeSlideId <= 0) {
          this.activeSlideId = 0;
        } else if (this.activeSlideId >= this.slides.length - 1) {
          this.activeSlideId = this.slides.length - 1;
        }
      } else if (this.slidesPerView > 1) {
        const firstSlides = Math.floor(this.slidesPerView / 2);
        const lastSlides = this.slides.length - firstSlides;

        if (this.activeSlideId <= firstSlides) {
          this.activeSlideId = firstSlides;
        } else if (this.activeSlideId >= lastSlides) {
          this.activeSlideId = lastSlides - 1;
        }

        this.activeSlideId = buttonType === 'prev' ? this.activeSlideId - 1 : this.activeSlideId + 1;
      }

      this.translateAndToggle(this.activeSlideId);

      button.blur();
    };

    this.prevButton.addEventListener('click', this.prevNextButtonOnClick);
    this.nextButton.addEventListener('click', this.prevNextButtonOnClick);
  }

  setupCounter(options) {
    this.currentNum = document.querySelector(options.counter.currentNumSelector);
    this.totalNum = document.querySelector(options.counter.totalNumSelector);

    this.currentNum.innerHTML = this.formatNum(this.activeSlideId + 1);
    this.totalNum.innerHTML = this.formatNum(this.slides.length);
  }

  setupBreakpoints(options) {
    function onresize() {
      const clientWidth = window.innerWidth;

      let noBreakpoints = true;

      for (const breakpoint of this.breakpoints) {
        if (clientWidth <= breakpoint) {
          const breakpointObject = this.breakpointObjects[`${breakpoint}`];
          noBreakpoints = false;
          this.resetup(options, breakpointObject);
          break;
        }
      }

      if (noBreakpoints) {
        this.resetup(options, options);
      }
    }

    window.addEventListener('resize', onresize.bind(this));
  }

  setupDragNDrop() {
    this.onMouseDownMobileModified = this.onDownEvent.bind(this, true);
    this.onMouseDownDesktopModified = this.onDownEvent.bind(this, false);

    this.wrapper.addEventListener('touchstart', this.onMouseDownMobileModified);
    this.wrapper.addEventListener('mousedown', this.onMouseDownDesktopModified);
  }

  onDownEvent(isMobile, event) {
    event.preventDefault();

    const calcCurrentTranslate = () => {
      const currentWrapperXCoord = this.getElemCoords(this.wrapper).x;
      const containerXCoord = this.getElemCoords(this.container).x;

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

    const moveEvent = (e) => {
      const throttle = (diff, currentTranslateValue) => {
        const containerRightCoord = this.getElemCoords(this.container).right;
        const containerXCoord = this.getElemCoords(this.container).x;
        const lastSlideRightCoord = this
          .getElemCoords(this.slides[this.slides.length - 1]).right;
        const firstSlideXCoord = this.getElemCoords(this.slides[0]).x;

        if (firstSlideXCoord > containerXCoord
          || lastSlideRightCoord < containerRightCoord) {
          diff = (diff - prevDiff) / 4 + prevDiff;
          this.wrapper.style.transform = `translateX(${currentTranslateValue + diff}px)`;
          return true;
        }

        return false;
      };

      const currentX = isMobile ? e.targetTouches[0].clientX : e.clientX;
      const diff = currentX - startX;

      const isThrottled = throttle(diff, currentTranslateValue);

      if (!isThrottled) {
        prevDiff = diff;

        this.wrapper.style.transform = `translateX(${currentTranslateValue + diff}px)`;
      }
    };

    const upEvent = (e) => {
      const getSlideIdInCenter = () => {
        const containerYCoord = this.getElemCoords(this.container).y + 1;
        let containerCenterCoord = this.container.offsetWidth / 2
          + this.getElemCoords(this.container).x;

        let slideInCenterId;
        let slideInCenter = document.elementFromPoint(containerCenterCoord, containerYCoord);
        slideInCenter = slideInCenter.closest('[data-slide-id]');

        if (!slideInCenter) {
          containerCenterCoord += this.gapWidth;
          slideInCenter = document.elementFromPoint(containerCenterCoord, containerYCoord);
          slideInCenter = slideInCenter.closest('[data-slide-id]');

          if (!slideInCenter) {
            const containerXCoord = this.getElemCoords(this.container).x;
            const containerRightCoord = this.getElemCoords(this.container).right;
            const firstSlideXCoord = this.getElemCoords(this.slides[0]).x;
            const lastSlideRightCoord = this
              .getElemCoords(this.slides[this.slides.length - 1]).right;

            if (firstSlideXCoord > containerXCoord) {
              slideInCenterId = 0;
              return slideInCenterId;
            }

            if (lastSlideRightCoord < containerRightCoord) {
              slideInCenterId = this.slides.length - 1;
              return slideInCenterId;
            }
          }
        }

        slideInCenterId = slideInCenter.dataset.slideId;
        return slideInCenterId;
      };

      e.preventDefault();
      document.removeEventListener(isMobile ? 'touchmove' : 'mousemove', moveEvent);

      this.wrapper.style.transition = this.transition;
      this.wrapper.style.cursor = '';

      const endX = isMobile ? e.changedTouches[0].clientX : e.clientX;
      const diff = endX - startX;

      const minMoveWidth = this.container.offsetWidth * 0.2;

      if (Math.abs(diff) < minMoveWidth) {
        this.translateAndToggle(this.activeSlideId);
        return;
      }

      if (this.slidesPerView === 1) {
        if (diff < 0) {
          this.activeSlideId += 1;

          if (this.activeSlideId === this.slides.length) {
            this.activeSlideId = this.slides.length - 1;
          }
        } else if (diff > 0) {
          this.activeSlideId -= 1;

          if (this.activeSlideId < 0) {
            this.activeSlideId = 0;
          }
        }
      } else {
        this.activeSlideId = getSlideIdInCenter();
      }

      this.translateAndToggle(this.activeSlideId);
    };

    document.addEventListener(isMobile ? 'touchmove' : 'mousemove', moveEvent);
    document.addEventListener(isMobile ? 'touchend' : 'mouseup', upEvent, { once: true });
  }

  paginationHandle(e) {
    const button = e.target.closest(`.${this.paginationButtonClass}`);
    if (!button) return;

    const newActiveSlideId = +button.dataset.slideId;
    if (newActiveSlideId === this.activeSlideId) return;

    this.activeSlideId = newActiveSlideId;
    this.translateAndToggle(this.activeSlideId);
  }

  translateAndToggle(id) {
    if (this.paginationBlock) {
      this.togglePaginationButtons(id);
    }

    if (this.prevButton) {
      this.checkPrevNextButtons();
    }

    if (this.currentNum) {
      this.currentNum.innerHTML = this.formatNum(id + 1);
    }

    this.translateSlides(id);
  }

  translateSlides(id) {
    const slideWidth = this.slides[0].offsetWidth;
    let width;

    if (this.slidesPerView > 1) {
      const firstSlides = Math.floor(this.slidesPerView / 2);
      const lastSlides = this.slides.length - firstSlides;

      if (id <= firstSlides) {
        id = 0;
        width = id * slideWidth + this.gapWidth * id;
      } else if (id >= lastSlides) {
        id = this.slides.length - this.slidesPerView;
        width = id * slideWidth + this.gapWidth * id;
      } else {
        width = id * slideWidth + this.gapWidth * id;
        width -= this.container.offsetWidth / 2 - slideWidth / 2;
      }
    } else {
      width = id * slideWidth + this.gapWidth * id;
    }

    this.wrapper.style.transform = `translateX(-${width}px)`;
  }

  togglePaginationButtons(id) {
    const paginationButtons = this.paginationBlock.querySelectorAll(`.${this.paginationButtonClass}`);

    paginationButtons.forEach((button) => {
      if (+button.dataset.slideId === id) {
        button.classList.add(this.paginationButtonActiveClass);
      } else {
        button.blur();
        button.classList.remove(this.paginationButtonActiveClass);
      }
    });
  }

  checkPrevNextButtons() {
    this.prevButton.classList.remove(this.buttonDisabledClass);
    this.nextButton.classList.remove(this.buttonDisabledClass);

    if (this.slidesPerView <= 2) {
      if (this.activeSlideId === 0) {
        this.prevButton.classList.add(this.buttonDisabledClass);
      } else if (this.activeSlideId === this.slides.length - 1) {
        this.nextButton.classList.add(this.buttonDisabledClass);
      }
    } else if (this.slidesPerView > 1) {
      const firstSlides = Math.floor(this.slidesPerView / 2);
      const lastSlides = this.slides.length - firstSlides;

      if (this.activeSlideId <= firstSlides) {
        this.prevButton.classList.add(this.buttonDisabledClass);
      } else if (this.activeSlideId >= lastSlides - 1) {
        this.nextButton.classList.add(this.buttonDisabledClass);
      }
    }
  }

  getElemCoords(elem) {
    const { x, y, right } = elem.getBoundingClientRect();
    return {
      x,
      y,
      right,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  formatNum(num) {
    const result = num < 10 ? `0${num}` : num;
    return result;
  }

  deepClone(obj) {
    const newObj = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          newObj[key] = this.deepClone(obj[key]);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    return newObj;
  }

  get gapWidth() {
    return (this.wrapper.offsetWidth * this.gap) / 100;
  }
}
