import CopyTel from '../../blocks/header/_header.js';
import addTelValidation from '../../blocks/fashionable-solution/_fashionable-solution.js';
import createMainSlider from '../../blocks/main-slider/_main-slider.js';
import createSliders from '../../blocks/reviews/_reviews.js';

new CopyTel('#copy-button', '#copy-button-text-main', '#copy-button-text-add', '.header__tel');
addTelValidation();
createMainSlider();
createSliders();
