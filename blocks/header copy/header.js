export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'navbar container';

  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'logo';
  logo.innerHTML = `
    <span class="logo-text-bold">THE</span>
    <span class="logo-text-bold">BLOG</span>
  `;

  const desktopMenu = document.createElement('ul');
  desktopMenu.className = 'nav-menu desktop-menu';

  const menuItems = [
    { text: 'Blog', href: 'index.html', active: true },
    { text: 'Projects', href: '#' },
    { text: 'About', href: '#' },
    { text: 'Newsletter', href: '#' },
  ];

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = item.active ? 'nav-item active' : 'nav-item';
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    li.appendChild(a);
    desktopMenu.appendChild(li);
  });

  const themeToggleLi = document.createElement('li');
  themeToggleLi.className = 'nav-item';
  const themeToggleBtn = document.createElement('button');
  themeToggleBtn.className = 'theme-toggle';
  themeToggleBtn.setAttribute('aria-label', 'Toggle theme');
  themeToggleBtn.innerHTML = `
    <svg class="sun-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    <svg class="moon-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme === 'light' ? '' : 'dark');
    localStorage.setItem('theme', newTheme);
  });

  themeToggleLi.appendChild(themeToggleBtn);
  desktopMenu.appendChild(themeToggleLi);

  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-btn';
  mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
  mobileMenuBtn.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  `;

  mobileMenuBtn.addEventListener('click', () => {
    desktopMenu.classList.toggle('active');
  });

  nav.appendChild(logo);
  nav.appendChild(desktopMenu);
  nav.appendChild(mobileMenuBtn);

  block.textContent = '';
  block.appendChild(nav);

  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

