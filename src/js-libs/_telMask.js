export default class TelMask {
  constructor(el, errorClass) {
    this.el = el;
    this.errorClass = errorClass;

    this.addValidation();
  }

  showError() {
    this.el.classList.add(this.errorClass);
    this.el.setAttribute('aria-invalid', true);
  }

  hideError() {
    this.el.classList.remove(this.errorClass);
    this.el.removeAttribute('aria-invalid');
  }

  addValidation() {
    function createTel(str) {
      let tel = str.replace(/\d{1,2}/, '+38($&');
      tel = tel.replace(/(?<=\+38\(\d\d)\d(?=\d)/, '$&)');
      tel = tel.replace(/(?<=\))\d{3}(?=\d)/, '$&-');
      tel = tel.replace(/(?<=-)\d{2}(?=\d)/, '$&-');
      return tel;
    }
    this.el.addEventListener('focusin', (e) => {
      if (e.target.value.length < 3) {
        e.target.value = '+38';
      }
    }, { once: true });

    this.el.addEventListener('focusin', () => {
      this.hideError();
    });

    this.el.addEventListener('focusout', (e) => {
      if (e.target.value.length !== 17) this.showError();
    });

    this.el.addEventListener('input', (e) => {
      if (e.target.value.length < 3) {
        e.target.value = '+38';
      }

      e.target.value = e.target.value.replace(/(?<=\+38)[^0]/, '');
      e.target.value = e.target.value.replace(/(?<=[\d-()+])\D/, '');

      if (e.target.value.length > 3) {
        const nums = e.target.value.slice(3, 15).match(/\d/g).join('');

        e.target.value = createTel(nums);
      }
    });

    this.el.addEventListener('paste', (e) => {
      e.preventDefault();

      let paste = (e.clipboardData || window.clipboardData).getData('text');

      if (paste.match(/\D/g)) {
        this.el.blur();
        return;
      }

      if (paste.startsWith('38')) {
        paste = paste.slice(2);
      }

      if (paste[0] !== '0') {
        paste = `0${paste}`;
      }

      e.target.value = createTel(paste);
    });
  }
}
