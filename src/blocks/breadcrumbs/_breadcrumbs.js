export default function setupBreadcrumbs() {
  const links = Array.from(document.querySelectorAll('.breadcrumbs__link'));
  links.forEach((link) => {
    if (link.nextElementSibling) {
      const span = document.createElement('span');
      span.className = 'link link_ff-montserrat link_16-px link_fw-500 link_c-grey-4';
      span.style.pointerEvents = 'none';
      span.innerHTML = '. ';
      link.after(span);
    } else {
      link.classList.add('breadcrumbs__link_inactive');
    }
  });
}
