export default class TelMask {
  constructor(input) {
    this.input = input;

    this.addMask();
  }

  addMask() {
    function createTel(str) {
      let tel = str.replace(/\d{1,2}/, '+38($&');
      tel = tel.replace(/(?<=\+38\(\d\d)\d(?=\d)/, '$&)');
      tel = tel.replace(/(?<=\))\d{3}(?=\d)/, '$&-');
      tel = tel.replace(/(?<=-)\d{2}(?=\d)/, '$&-');
      return tel;
    }

    this.input.addEventListener('focusin', (e) => {
      if (e.target.value.length < 3) {
        e.target.value = '+38';
      }
    }, { once: true, passive: true });

    this.input.addEventListener('input', (e) => {
      if (e.target.value.length < 3) {
        e.target.value = '+38';
      }

      e.target.value = e.target.value.replace(/(?<=\+38)[^0]/, '');
      e.target.value = e.target.value.replace(/(?<=[\d-()+])\D/, '');

      if (e.target.value.length > 3) {
        const nums = e.target.value.slice(3, 15).match(/\d/g).join('');

        e.target.value = createTel(nums);
      }
    }, { passive: true });

    this.input.addEventListener('paste', (e) => {
      e.preventDefault();

      let paste = (e.clipboardData || window.clipboardData).getData('text');

      if (paste.match(/\D/g)) return;

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
