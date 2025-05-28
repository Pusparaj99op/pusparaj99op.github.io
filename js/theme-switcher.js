document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Get theme from localStorage or system preference
  const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    // Update button state
    updateButtonState(currentTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
      let switchToTheme = document.documentElement.getAttribute('data-theme') === 'dark' 
                          ? 'light' 
                          : 'dark';
      
      document.documentElement.setAttribute('data-theme', switchToTheme);
      localStorage.setItem('theme', switchToTheme);
      
      updateButtonState(switchToTheme);
    });
  }
  
  function updateButtonState(theme) {
    if (!themeToggle) return;
    
    if (theme === 'dark') {
      themeToggle.innerHTML = '<span aria-hidden="true">☀️</span><span class="sr-only">Switch to light mode</span>';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggle.innerHTML = '<span aria-hidden="true">🌙</span><span class="sr-only">Switch to dark mode</span>';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
});
