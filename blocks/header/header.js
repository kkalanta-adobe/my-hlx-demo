/**
 * Header Block JavaScript
 * Generates navigation header with logo, menu items, and theme toggle
 * @param {HTMLElement} block - The header block element
 */
export default function decorate(block) {
  // Extract configuration from block content (if any)
  const rows = Array.from(block.children);
  
  // Parse configuration (optional - can be hardcoded or from document table)
  let logoText = 'THE BLOG';
  let menuItems = [
    { text: 'Blog', href: 'index.html', active: true },
    { text: 'Projects', href: '#' },
    { text: 'About', href: '#' },
    { text: 'Newsletter', href: '#' },
  ];

  // If content exists in block, parse it
  if (rows.length > 0) {
    rows.forEach((row) => {
      const cells = Array.from(row.children);
      if (cells[0]?.textContent.trim().toLowerCase() === 'logo') {
        logoText = cells[1]?.textContent.trim() || logoText;
      }
    });
  }

  // Clear block content
  block.innerHTML = '';
  block.classList.add('header');

  // Create navbar container
  const navbar = document.createElement('nav');
  navbar.className = 'navbar container';

  // Create logo
  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'logo';
  
  const logoWords = logoText.split(' ');
  logoWords.forEach((word) => {
    const span = document.createElement('span');
    span.className = 'logo-text-bold';
    span.textContent = word;
    logo.appendChild(span);
  });

  // Create desktop menu
  const navMenu = document.createElement('ul');
  navMenu.className = 'nav-menu desktop-menu';

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    if (item.active) li.classList.add('active');

    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    
    li.appendChild(a);
    navMenu.appendChild(li);
  });

  // Add theme toggle
  const themeToggleLi = document.createElement('li');
  themeToggleLi.className = 'nav-item';
  
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle theme');
  
  // Sun icon
  const sunIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sunIcon.setAttribute('class', 'sun-icon');
  sunIcon.setAttribute('width', '24');
  sunIcon.setAttribute('height', '24');
  sunIcon.setAttribute('viewBox', '0 0 24 24');
  sunIcon.setAttribute('fill', 'none');
  sunIcon.setAttribute('stroke', 'currentColor');
  sunIcon.setAttribute('stroke-width', '2');
  sunIcon.innerHTML = `
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  `;

  // Moon icon
  const moonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  moonIcon.setAttribute('class', 'moon-icon');
  moonIcon.setAttribute('width', '24');
  moonIcon.setAttribute('height', '24');
  moonIcon.setAttribute('viewBox', '0 0 24 24');
  moonIcon.setAttribute('fill', 'none');
  moonIcon.setAttribute('stroke', 'currentColor');
  moonIcon.setAttribute('stroke-width', '2');
  moonIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

  themeToggle.appendChild(sunIcon);
  themeToggle.appendChild(moonIcon);
  themeToggleLi.appendChild(themeToggle);
  navMenu.appendChild(themeToggleLi);

  // Create mobile menu button
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
  
  const hamburgerIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  hamburgerIcon.setAttribute('width', '32');
  hamburgerIcon.setAttribute('height', '32');
  hamburgerIcon.setAttribute('viewBox', '0 0 24 24');
  hamburgerIcon.setAttribute('fill', 'none');
  hamburgerIcon.setAttribute('stroke', 'currentColor');
  hamburgerIcon.setAttribute('stroke-width', '2');
  hamburgerIcon.innerHTML = `
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  `;
  
  mobileMenuBtn.appendChild(hamburgerIcon);

  // Assemble navbar
  navbar.appendChild(logo);
  navbar.appendChild(navMenu);
  navbar.appendChild(mobileMenuBtn);
  block.appendChild(navbar);

  // Initialize functionality
  initializeMobileMenu(mobileMenuBtn, navMenu);
  initializeThemeToggle(themeToggle);
  setActiveNavItem(navMenu);
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu(button, menu) {
  button.addEventListener('click', () => {
    menu.classList.toggle('active');
    const isExpanded = menu.classList.contains('active');
    button.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnButton = button.contains(event.target);

    if (!isClickInsideMenu && !isClickOnButton && menu.classList.contains('active')) {
      menu.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle(toggle) {
  // Get stored theme or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  toggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/**
 * Set active nav item based on current page
 */
function setActiveNavItem(menu) {
  const currentPath = window.location.pathname;
  const navItems = menu.querySelectorAll('.nav-item');
  
  navItems.forEach((item) => {
    const link = item.querySelector('a');
    if (link && link.getAttribute('href') === currentPath) {
      item.classList.add('active');
    }
  });
}
