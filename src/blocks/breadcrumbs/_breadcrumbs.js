// [['Головна', 'https://'], ['Головна', 'https://']]

export default function setupBreadcrumbs(arrayOfLinks) {
  function createLinks(arrayOfLinks) {
    const links = new DocumentFragment();

    arrayOfLinks.forEach((link) => {
      const [linkName, url] = link;

      const a = document.createElement('a');
      a.className = 'link link_ff-montserrat link_16-px link_fw-500 link_c-grey-4 breadcrumbs__link';
      a.setAttribute('alt', linkName);
      a.innerHTML = linkName;
      a.href = url;
      links.append(a);
    });

    return links;
  }

  function createSpansBetweenLinks(links) {
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

  const links = createLinks(arrayOfLinks);
  createSpansBetweenLinks(Array.from(links.children));

  const linksBlock = document.querySelector('.breadcrumbs__links-block ');
  linksBlock.append(links);
}
