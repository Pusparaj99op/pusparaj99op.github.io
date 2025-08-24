/**
 * Portfolio Website - Accessibility Enhancements
 * Script to improve accessibility of the portfolio website
 * Version: 1.0
 * Last Modified: August 24, 2025
 */

document.addEventListener('DOMContentLoaded', () => {
    // Add accessibility attributes to project links
    enhanceProjectLinks();

    // Add skip link
    addSkipLink();

    // Enhance form accessibility
    enhanceFormAccessibility();

    // Add ARIA attributes to interactive elements
    addAriaAttributes();
});

/**
 * Enhances all project links with proper accessibility attributes
 */
function enhanceProjectLinks() {
    // Get all project link icons
    const projectLinks = document.querySelectorAll('.project-link');

    projectLinks.forEach(link => {
        // Check which type of link it is based on the icon
        const icon = link.querySelector('i');

        if (icon) {
            if (icon.classList.contains('fa-external-link-alt')) {
                // Website link
                link.setAttribute('aria-label', 'Visit Project Website');
                link.setAttribute('title', 'Visit Project Website');
            } else if (icon.classList.contains('fa-github')) {
                // GitHub link
                link.setAttribute('aria-label', 'View Project Source Code');
                link.setAttribute('title', 'View Project Source Code');
            }
        }
    });
}

/**
 * Adds a skip link for keyboard navigation
 */
function addSkipLink() {
    // Create skip link element
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.classList.add('skip-link');
    skipLink.textContent = 'Skip to main content';

    // Add to document
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ID to main content for skip link target
    const mainContent = document.querySelector('.hero') || document.querySelector('main');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('tabindex', '-1');
    }
}

/**
 * Enhances form accessibility
 */
function enhanceFormAccessibility() {
    // Add required field indicators
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');

    requiredFields.forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);

        if (label) {
            // Add required indicator
            const requiredSpan = document.createElement('span');
            requiredSpan.classList.add('required-field');
            requiredSpan.setAttribute('aria-hidden', 'true');
            requiredSpan.textContent = ' *';
            label.appendChild(requiredSpan);

            // Add screen reader text
            const srText = document.createElement('span');
            srText.classList.add('sr-only');
            srText.textContent = ' (required)';
            label.appendChild(srText);
        }
    });

    // Add form error handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
}

/**
 * Validates form and provides accessible error messages
 */
function validateForm(e) {
    const form = e.currentTarget;
    const formFields = form.querySelectorAll('input, textarea');
    let isValid = true;

    // Remove existing error messages
    const existingErrors = form.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    // Check each field
    formFields.forEach(field => {
        field.setAttribute('aria-invalid', 'false');

        if (field.hasAttribute('required') && !field.value.trim()) {
            // Field is required but empty
            addErrorMessage(field, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && field.value) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                addErrorMessage(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
    });

    if (!isValid) {
        e.preventDefault();

        // Focus the first invalid field
        const firstInvalidField = form.querySelector('[aria-invalid="true"]');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        // Announce to screen readers
        const liveRegion = document.getElementById('form-announcer') || createLiveRegion('form-announcer');
        liveRegion.textContent = 'Form has errors. Please correct the highlighted fields.';
    }
}

/**
 * Adds an error message to a form field
 */
function addErrorMessage(field, message) {
    field.setAttribute('aria-invalid', 'true');

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    errorMessage.id = `${field.id}-error`;

    // Link field to error message with aria-describedby
    field.setAttribute('aria-describedby', errorMessage.id);

    // Add error message after the field
    field.parentNode.appendChild(errorMessage);
}

/**
 * Creates a live region for screen reader announcements
 */
function createLiveRegion(id) {
    const liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.className = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    document.body.appendChild(liveRegion);
    return liveRegion;
}

/**
 * Add ARIA attributes to interactive elements
 */
function addAriaAttributes() {
    // Mobile menu toggle button
    const navToggle = document.querySelector('.nav-toggle');
    const navItems = document.querySelector('.nav-items');

    if (navToggle && navItems) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'navigation-menu');
        navItems.id = 'navigation-menu';

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Skill category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    const skillsCategories = document.querySelectorAll('.skills-category');

    categoryTabs.forEach((tab, index) => {
        const category = tab.getAttribute('data-category');
        const panel = document.querySelector(`.skills-category[data-category="${category}"]`);

        if (panel) {
            const panelId = `skills-panel-${category}`;
            panel.id = panelId;

            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
            tab.setAttribute('aria-controls', panelId);
            tab.id = `tab-${category}`;

            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', `tab-${category}`);

            tab.addEventListener('click', () => {
                // Update ARIA states
                categoryTabs.forEach(t => t.setAttribute('aria-selected', 'false'));
                tab.setAttribute('aria-selected', 'true');
            });
        }
    });

    // Project filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');

        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
            button.setAttribute('aria-pressed', 'true');
        });
    });
}
