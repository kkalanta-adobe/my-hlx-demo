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

  block.innerHTML = '';

  const wrapper = document.createElement('div');

  const copyrightEl = document.createElement('p');
  copyrightEl.textContent = copyright;

  const nav = document.createElement('nav');

  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    nav.appendChild(a);
  });

  wrapper.appendChild(copyrightEl);
  wrapper.appendChild(nav);
  block.appendChild(wrapper);
}

