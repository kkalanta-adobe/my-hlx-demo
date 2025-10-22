export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'container';

  const title = document.createElement('h1');
  title.className = 'hero-title';
  title.textContent = block.textContent.trim() || 'THE BLOG';

  container.appendChild(title);

  block.textContent = '';
  block.appendChild(container);
}

