import setupCopyTelButton from '../../blocks/header/_header.js';
import setupMainNav from '../../blocks/main-nav/_main-nav.js';
import setupBreadcrumbs from '../../blocks/breadcrumbs/_breadcrumbs.js';
import setupMainBag from '../../blocks/main-bag/_main-bag.js';
import setupFooterForm from '../../blocks/footer/_footer.js';

setupCopyTelButton();
setupMainNav();
setupBreadcrumbs([['Головна', '#'], ['Кошик', '#']]);
setupMainBag();
setupFooterForm();