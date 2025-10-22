export default function decorate(block) {
  const rows = [...block.children];
  const links = [];
  let copyright = '© 2023';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      copyright = cells[0].textContent.trim();
    } else if (cells.length === 2) {
      links.push({
        text: cells[0].textContent.trim(),
        href: cells[1].textContent.trim(),
      });
    }
  });

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'container';

  const copyrightEl = document.createElement('p');
  copyrightEl.className = 'footer-copyright';
  copyrightEl.textContent = copyright;

  const nav = document.createElement('nav');
  nav.className = 'footer-nav';

  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    nav.appendChild(a);
  });

  container.appendChild(copyrightEl);
  container.appendChild(nav);
  block.appendChild(container);
}

