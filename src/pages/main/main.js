// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import loadingAttributePolyfill from 'loading-attribute-polyfill/dist/loading-attribute-polyfill.module.js';
import setupCopyTelButton from '../../blocks/header/_header.js';
import setupMainNav from '../../blocks/main-nav/_main-nav.js';
import setupBagAndWishlistMenu from '../../blocks/bag-and-wishlist-menu/_bag-and-wishlist.js';
import setupFashionableSolutionForm from '../../blocks/fashionable-solution/_fashionable-solution.js';
import setupMainSliderBlock from '../../blocks/main-slider/_main-slider.js';
import createSliders from '../../blocks/reviews/_reviews.js';
import setupSubscribeForm from '../../blocks/subscribe/_subscribe.js';
import setupFooterForm from '../../blocks/footer/_footer.js';

setTimeout(() => { setupCopyTelButton(); });
setTimeout(() => { setupMainNav(); });
setTimeout(() => { setupBagAndWishlistMenu(); });
setTimeout(() => { setupFashionableSolutionForm(); });
setTimeout(() => { setupMainSliderBlock(); });
setTimeout(() => { createSliders(); });
setTimeout(() => { setupSubscribeForm(); });
setTimeout(() => {
  setupFooterForm();
});
