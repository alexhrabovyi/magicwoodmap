/* eslint-disable import/no-duplicates */
import setupCopyTelButton from '../../blocks/header/_header.js';
import setupMainNav from '../../blocks/main-nav/_main-nav.js';
import setupBreadcrumbs from '../../blocks/breadcrumbs/_breadcrumbs.js';
import setupBagAndWishlistMenu from '../../blocks/bag-and-wishlist-menu/_bag-and-wishlist.js';
import { SetupWishlistMenu } from '../../blocks/bag-and-wishlist-menu/_bag-and-wishlist.js';
import setupProductDesc from '../../blocks/product-desc/_product-desc.js';
import setupCallBackForm from '../../blocks/call-back-form/_call-back-form.js';
import setupFooterForm from '../../blocks/footer/_footer.js';

setupCopyTelButton();
setupMainNav();
setupBreadcrumbs([['Головна', '#'], ['Категорії', '#'], ['Одношарова мапа', '#']]);
setupBagAndWishlistMenu();
new SetupWishlistMenu();
setupProductDesc();
setupCallBackForm();
setupFooterForm();
