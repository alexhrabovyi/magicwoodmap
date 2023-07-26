import TelMask from '../../js-libs/_telMask.js';

export default function addTelValidation() {
  const inputTel = document.querySelector('.fashionable-solution__input_white');

  new TelMask(inputTel, 'input_invalid');
}
