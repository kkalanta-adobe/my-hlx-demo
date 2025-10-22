function createArticleCard(article) {
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

  return card;
}

function createPagination(currentPage, totalPages) {
  const pagination = document.createElement('nav');
  pagination.className = 'pagination';
  pagination.setAttribute('aria-label', 'Pagination');

  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn';
  prevBtn.setAttribute('aria-label', 'Previous page');
  prevBtn.disabled = currentPage === 1;
  prevBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
    Previous
  `;

  const numbersContainer = document.createElement('div');
  numbersContainer.className = 'pagination-numbers';

  const pagesToShow = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    pagesToShow.push(1, 2, 3);
    pagesToShow.push('...');
    pagesToShow.push(totalPages - 2, totalPages - 1, totalPages);
  }

  pagesToShow.forEach((page) => {
    if (page === '...') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      numbersContainer.appendChild(ellipsis);
    } else {
      const btn = document.createElement('button');
      btn.className = page === currentPage ? 'pagination-number active' : 'pagination-number';
      btn.textContent = page;
      if (page === currentPage) {
        btn.setAttribute('aria-current', 'page');
      }
      numbersContainer.appendChild(btn);
    }
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.innerHTML = `
    Next
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;

  pagination.appendChild(prevBtn);
  pagination.appendChild(numbersContainer);
  pagination.appendChild(nextBtn);

  return pagination;
}

export default function decorate(block) {
  const rows = [...block.children];
  let title = 'All blog posts';
  const articles = [];
  let currentPage = 1;
  let totalPages = 10;

  rows.forEach((row, index) => {
    const cells = [...row.children];
    
    if (index === 0 && cells.length === 1) {
      title = cells[0].textContent.trim();
      return;
    }
    
    if (cells.length === 2 && cells[0].textContent.trim().toLowerCase() === 'pagination') {
      const paginationData = cells[1].textContent.trim().split('|');
      if (paginationData.length === 2) {
        currentPage = parseInt(paginationData[0], 10) || 1;
        totalPages = parseInt(paginationData[1], 10) || 10;
      }
      return;
    }

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

  const container = document.createElement('div');
  container.className = 'container';

  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.textContent = title;

  const grid = document.createElement('div');
  grid.className = 'blog-grid-three';

  articles.forEach((article) => {
    grid.appendChild(createArticleCard(article));
  });

  const pagination = createPagination(currentPage, totalPages);

  container.appendChild(sectionTitle);
  container.appendChild(grid);
  container.appendChild(pagination);
  block.appendChild(container);
}

