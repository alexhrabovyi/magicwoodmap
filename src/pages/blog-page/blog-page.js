/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import '@justinribeiro/lite-youtube';
import loadingAttributePolyfill from 'loading-attribute-polyfill/dist/loading-attribute-polyfill.module.js';
import setupCopyTelButton from '../../blocks/header/_header.js';
import setupMainNav from '../../blocks/main-nav/_main-nav.js';
import setupBreadcrumbs from '../../blocks/breadcrumbs/_breadcrumbs.js';
import setupBagAndWishlistMenu from '../../blocks/bag-and-wishlist-menu/_bag-and-wishlist.js';
import setupCallBackForm from '../../blocks/call-back-form/_call-back-form.js';
import setupFooterForm from '../../blocks/footer/_footer.js';
import links from '../../js-libs/_links.js';

setupCopyTelButton();
setupMainNav();
setupBreadcrumbs([['Головна', links.main], ['Блог', links.ourBlog], ['Сторінка блога', links.blogPage]]);
setupBagAndWishlistMenu();
setupCallBackForm();
setupFooterForm();
