export default function decorate(block) {
  const rows = [...block.children];
  const articles = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 6) {
      const tagsText = cells[5].textContent.trim();
      const tagPairs = tagsText.split(',').map((t) => t.trim());
      const tags = [];

      tagPairs.forEach((pair) => {
        const [text, color] = pair.split('|').map((p) => p.trim());
        if (text && color) {
          tags.push({ text, color: color.toLowerCase() });
        }
      });

      articles.push({
        image: cells[0].textContent.trim(),
        date: cells[1].textContent.trim(),
        title: cells[2].textContent.trim(),
        excerpt: cells[3].textContent.trim(),
        link: cells[4].textContent.trim(),
        tags,
      });
    }
  });

  block.textContent = '';

  articles.forEach((article) => {
    const card = document.createElement('article');
    card.className = 'blog-card';

    const link = document.createElement('a');
    link.href = article.link;
    link.className = 'blog-card-link';

    const img = document.createElement('img');
    img.src = article.image;
    img.alt = article.title;
    img.className = 'blog-image';

    const content = document.createElement('div');
    content.className = 'blog-content';

    const date = document.createElement('time');
    date.className = 'blog-date';
    date.textContent = article.date;

    const header = document.createElement('div');
    header.className = 'blog-header';

    const title = document.createElement('h3');
    title.className = 'blog-title';
    title.textContent = article.title;

    const arrow = document.createElement('svg');
    arrow.setAttribute('width', '24');
    arrow.setAttribute('height', '24');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('fill', 'none');
    arrow.setAttribute('stroke', 'currentColor');
    arrow.setAttribute('stroke-width', '2');
    arrow.className = 'arrow-icon';
    arrow.innerHTML = `
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    `;

    header.appendChild(title);
    header.appendChild(arrow);

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-excerpt';
    excerpt.textContent = article.excerpt;

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'blog-tags';

    article.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = `tag tag-${tag.color}`;
      span.textContent = tag.text;
      tagsContainer.appendChild(span);
    });

    content.appendChild(date);
    content.appendChild(header);
    content.appendChild(excerpt);
    content.appendChild(tagsContainer);

    link.appendChild(img);
    link.appendChild(content);
    card.appendChild(link);
    block.appendChild(card);
  });
}

