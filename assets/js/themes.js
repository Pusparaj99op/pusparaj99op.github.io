/**
 * Portfolio Website - Theme Manager
 * Handles theme switching functionality and persistence
 * Version: 1.0
 * Last Modified: August 24, 2025
 */

class ThemeManager {
    constructor() {
        // Available themes
        this.themes = ['light', 'dark', 'neon', 'minimal'];

        // Default theme
        this.defaultTheme = 'dark';

        // Initialize
        this.init();
    }

    init() {
        // Get saved theme from localStorage or use OS preference
        this.currentTheme = this.getSavedTheme();

        // Apply the initial theme
        this.applyTheme(this.currentTheme);

        // Set up event listeners
        this.setupEventListeners();

        // Mark active theme buttons
        this.updateActiveButtons();
    }

    getSavedTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme && this.themes.includes(savedTheme)) {
            return savedTheme;
        }

        // If no saved theme, check OS preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        // Default to light theme
        return this.defaultTheme;
    }

    applyTheme(theme) {
        // Validate theme
        if (!this.themes.includes(theme)) {
            theme = this.defaultTheme;
        }

        // Apply theme to body
        document.body.setAttribute('data-theme', theme);

        // Save to localStorage
        localStorage.setItem('theme', theme);

        // Update current theme
        this.currentTheme = theme;

        // Dispatch theme change event
        this.dispatchThemeChangeEvent();
    }

    setupEventListeners() {
        // Theme buttons in header
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-theme');
                this.applyTheme(theme);
                this.updateActiveButtons();
            });
        });

        // Theme options in theme panel
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                this.applyTheme(theme);
                this.updateActiveButtons();
            });
        });

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only update if user hasn't manually set a theme
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
                this.updateActiveButtons();
            }
        });
    }

    updateActiveButtons() {
        // Update header theme buttons
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-theme') === this.currentTheme) {
                button.classList.add('active');
            }
        });

        // Update theme panel options
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-theme') === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    dispatchThemeChangeEvent() {
        // Create and dispatch a custom event for theme change
        const event = new CustomEvent('themeChange', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
