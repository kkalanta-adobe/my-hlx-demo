export default function decorate(block) {
  block.innerHTML = '';

  const wrapper = document.createElement('div');

  const copyrightEl = document.createElement('p');
  copyrightEl.textContent = '© 2023';

  const nav = document.createElement('nav');

  const links = [
    { text: 'Twitter', href: '#' },
    { text: 'LinkedIn', href: '#' },
    { text: 'Email', href: 'mailto:hello@example.com' },
    { text: 'RSS feed', href: '#' },
    { text: 'Add to Feedly', href: '#' },
  ];

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

