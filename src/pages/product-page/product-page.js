/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import loadingAttributePolyfill from 'loading-attribute-polyfill/dist/loading-attribute-polyfill.module.js';
import '@justinribeiro/lite-youtube';
import setupCopyTelButton from '../../blocks/header/_header.js';
import setupMainNav from '../../blocks/main-nav/_main-nav.js';
import setupBreadcrumbs from '../../blocks/breadcrumbs/_breadcrumbs.js';
import setupBagAndWishlistMenu from '../../blocks/bag-and-wishlist-menu/_bag-and-wishlist.js';
import setupProductDesc from '../../blocks/product-desc/_product-desc.js';
import setupCallBackForm from '../../blocks/call-back-form/_call-back-form.js';
import setupFooterForm from '../../blocks/footer/_footer.js';
import links from '../../js-libs/_links.js';

setupCopyTelButton();
setupMainNav();
setupBreadcrumbs([['Головна', links.main], ['Категорії', links.categories], ['Одношарова мапа', links.productPage]]);
setupProductDesc();
setupBagAndWishlistMenu();
setupCallBackForm();
setupFooterForm();
