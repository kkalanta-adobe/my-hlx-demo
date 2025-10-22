import { makeAuthenticatedRequest } from '../../utils/aem-client.js';

/**
 * Extracts field value from AEM Content Fragment fields array
 * @param {Array} fields - Array of field objects from AEM API response
 * @param {string} fieldName - Name of the field to extract
 * @returns {any} The field value or null if not found
 */
function getFieldValue(fields, fieldName) {
  const field = fields.find(f => f.name === fieldName);
  return field && field.values && field.values.length > 0 ? field.values[0] : null;
}

/**
 * Transforms AEM Content Fragment item into article card format
 * @param {object} item - AEM Content Fragment item from API response
 * @returns {object} Article object compatible with createArticleCard
 */
function transformContentFragmentToArticle(item) {
  const fields = item.fields || [];
  
  // Extract field values
  const title = getFieldValue(fields, 'title') || item.title || '';
  const heroImage = getFieldValue(fields, 'heroImage') || '';
  const publishedDate = getFieldValue(fields, 'publishedDate') || '';
  const body = getFieldValue(fields, 'body') || item.description || '';
  const author = getFieldValue(fields, 'author') || '';
  const category = getFieldValue(fields, 'category') || '';
  const tags = getFieldValue(fields, 'tags') || [];
  
  // Transform tags from AEM format ("blog:Design") to expected format
  const transformedTags = Array.isArray(tags) ? tags.map(tag => {
    const tagText = tag.replace('blog:', '');
    return {
      text: tagText,
      color: tagText.toLowerCase()
    };
  }) : [];
  
  // Create excerpt from body (first 150 characters)
  const excerpt = body.length > 150 ? body.substring(0, 150) + '...' : body;
  
  // Generate article link from path
  const link = item.path ? `/articles${item.path.replace('/content/dam/the-blog/articles', '')}` : '#';
  
  // Format date
  const formattedDate = publishedDate ? new Date(publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : '';
  
  return {
    title,
    image: heroImage,
    date: formattedDate,
    excerpt,
    link,
    tags: transformedTags,
    author,
    category
  };
}

/**
 * Fetches blog articles from AEM Content Fragments API
 * @param {number} limit - Number of articles to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of article objects
 */
async function fetchBlogArticles(limit = 10, offset = 0) {
  try {
    const apiUrl = 'https://author-p93652-e1432935.adobeaemcloud.com/adobe/sites/cf/fragments';
    const params = new URLSearchParams({
      path: '/content/dam/the-blog/articles',
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    const response = await makeAuthenticatedRequest(`${apiUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const items = data.items || [];
    
    // Transform AEM Content Fragment items to article format
    return items.map(transformContentFragmentToArticle);
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    // Return mock data for development if API fails
    return [];
  }
}

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
    // Smart pagination: show pages around current page
    if (currentPage <= 4) {
      // Show first pages
      for (let i = 1; i <= 5; i++) {
        pagesToShow.push(i);
      }
      pagesToShow.push('...');
      pagesToShow.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Show last pages
      pagesToShow.push(1);
      pagesToShow.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pagesToShow.push(i);
      }
    } else {
      // Show pages around current
      pagesToShow.push(1);
      pagesToShow.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pagesToShow.push(i);
      }
      pagesToShow.push('...');
      pagesToShow.push(totalPages);
    }
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

export default async function decorate(block) {
  const rows = [...block.children];
  let title = 'All blog posts';
  let currentPage = 1;
  const articlesPerPage = 10;
  
  // Parse configuration from block content
  rows.forEach((row, index) => {
    const cells = [...row.children];
    
    if (index === 0 && cells.length === 1) {
      title = cells[0].textContent.trim();
      return;
    }
    
    if (cells.length === 2 && cells[0].textContent.trim().toLowerCase() === 'pagination') {
      const paginationData = cells[1].textContent.trim().split('|');
      if (paginationData.length >= 1) {
        currentPage = parseInt(paginationData[0], 10) || 1;
      }
      return;
    }
  });

  // Clear block content
  block.textContent = '';
  
  // Show loading state
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-state';
  loadingDiv.textContent = 'Loading articles...';
  block.appendChild(loadingDiv);

  try {
    // Calculate offset for pagination
    const offset = (currentPage - 1) * articlesPerPage;
    
    // Fetch articles from API
    const articles = await fetchBlogArticles(articlesPerPage, offset);
    
    // For total pages calculation, we'll need to make another API call or assume based on results
    // For now, we'll calculate based on whether we got a full page of results
    const totalPages = articles.length === articlesPerPage ? currentPage + 1 : currentPage;
    
    // Remove loading state
    block.removeChild(loadingDiv);
    
    // Create the main container
    const container = document.createElement('div');
    container.className = 'container';

    // Create section title
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = title;

    // Create articles grid
    const grid = document.createElement('div');
    grid.className = 'blog-grid-three';

    // Add articles to grid
    articles.forEach((article) => {
      grid.appendChild(createArticleCard(article));
    });

    // Create pagination
    const pagination = createPagination(currentPage, totalPages);
    
    // Add event listeners for pagination
    addPaginationEventListeners(pagination, currentPage, totalPages, block, title);

    // Assemble the final structure
    container.appendChild(sectionTitle);
    container.appendChild(grid);
    container.appendChild(pagination);
    block.appendChild(container);
    
  } catch (error) {
    console.error('Error loading blog articles:', error);
    
    // Remove loading state
    if (block.contains(loadingDiv)) {
      block.removeChild(loadingDiv);
    }
    
    // Show error state
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state';
    errorDiv.innerHTML = `
      <h3>Unable to load articles</h3>
      <p>Please try again later or check your connection.</p>
    `;
    block.appendChild(errorDiv);
  }
}

/**
 * Adds event listeners to pagination buttons for dynamic loading
 * @param {Element} pagination - The pagination container element
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Element} block - The main block element
 * @param {string} title - The section title
 */
function addPaginationEventListeners(pagination, currentPage, totalPages, block, title) {
  const prevBtn = pagination.querySelector('.pagination-btn:first-child');
  const nextBtn = pagination.querySelector('.pagination-btn:last-child');
  const numberButtons = pagination.querySelectorAll('.pagination-number');
  
  // Previous button
  if (prevBtn && !prevBtn.disabled) {
    prevBtn.addEventListener('click', async () => {
      await loadPage(currentPage - 1, block, title);
    });
  }
  
  // Next button  
  if (nextBtn && !nextBtn.disabled) {
    nextBtn.addEventListener('click', async () => {
      await loadPage(currentPage + 1, block, title);
    });
  }
  
  // Number buttons
  numberButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const pageNum = parseInt(btn.textContent, 10);
      if (pageNum !== currentPage) {
        await loadPage(pageNum, block, title);
      }
    });
  });
}

/**
 * Loads a specific page of articles
 * @param {number} page - Page number to load
 * @param {Element} block - The main block element
 * @param {string} title - The section title
 */
async function loadPage(page, block, title) {
  // Re-decorate the block with new page number
  // For simplicity, we'll just reload the entire block
  // In a more sophisticated implementation, you might update just the grid and pagination
  block.innerHTML = `
    <div><div>${title}</div></div>
    <div><div>pagination</div><div>${page}|${page + 1}</div></div>
  `;
  
  // Re-run the decorate function
  await decorate(block);
}

