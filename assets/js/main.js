/**
 * Portfolio Website - Main JavaScript
 * Handles core functionality for the portfolio website
 * Version: 1.0
 * Last Modified: August 24, 2025
 */

// Force remove loading class immediately to ensure content visibility
document.body.classList.remove('loading');

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Force remove loading class again
    document.body.classList.remove('loading');

    // Initialize all modules
    initLoader();
    initNavigation();
    initThemeSwitcher();
    initScrollAnimations();
    initSkillsTabs();
    initProjectFilter();
    initScrollIndicator();
    initBackToTop();
    initContactForm();
    initThemePanel();
    initCertificatesStats();
    fetchGitHubData();

    // Hide loader immediately for content visibility
    hideLoader();
});

// Window load event (when all resources are loaded)
window.addEventListener('load', () => {
    // Hide loader when everything is loaded
    hideLoader();

    // Start animations after loader is hidden
    setTimeout(() => {
        startHeroAnimation();
        startSkillsAnimation();
    }, 300);
});

/**
 * Page Loader
 * Shows loading progress and hides when content is loaded
 */
function initLoader() {
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');
    let progress = 0;

    // Simulate loading progress
    const interval = setInterval(() => {
        progress += Math.random() * 10;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }

        if (loaderProgress) {
            loaderProgress.style.width = `${progress}%`;
        }
    }, 150);
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    const body = document.body;

    // Force remove loading class from body immediately
    body.classList.remove('loading');

    // Ensure all content is visible
    const sections = document.querySelectorAll('section, header, footer');
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });

    if (loader) {
        loader.classList.add('hidden');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';

        // Remove loader completely after transition
        setTimeout(() => {
            loader.style.display = 'none';
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 300);
    }
}

/**
 * Navigation
 * Handles mobile menu toggle, active links, and scroll behavior
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navItems = document.querySelector('.nav-items');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navItems.classList.toggle('active');
            document.body.classList.toggle('nav-open');

            // Toggle animation for hamburger icon
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navItems && navItems.classList.contains('active')) {
            if (!navItems.contains(e.target) && !navToggle.contains(e.target)) {
                navItems.classList.remove('active');
                document.body.classList.remove('nav-open');
                navToggle.classList.remove('active');
            }
        }
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navItems.classList.remove('active');
            document.body.classList.remove('nav-open');
            navToggle.classList.remove('active');
        });
    });

    // Change header style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active navigation link based on scroll position
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Theme Switcher
 * Handles theme switching functionality
 */
function initThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const themeOptions = document.querySelectorAll('.theme-option');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use the OS preference
    let currentTheme = localStorage.getItem('theme');

    if (!currentTheme) {
        currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    }

    // Set initial theme
    document.body.setAttribute('data-theme', currentTheme);

    // Update active buttons
    updateActiveThemeButtons(currentTheme);

    // Theme button click handlers
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    // Theme panel options click handlers
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            setTheme(theme);
        });
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateActiveThemeButtons(theme);
}

function updateActiveThemeButtons(theme) {
    // Update header theme buttons
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });

    // Update theme panel options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        }
    });
}

/**
 * Scroll Animations
 * Animates elements as they enter the viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);

        // Add delay if specified
        const delay = element.getAttribute('data-delay');
        if (delay) {
            element.style.transitionDelay = `${delay}ms`;
        }
    });
}

/**
 * Skills Tabs
 * Handles tab switching in the skills section
 */
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    const categories = document.querySelectorAll('.skills-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show selected category
            categories.forEach(c => {
                c.classList.remove('active');
                if (c.getAttribute('data-category') === category) {
                    c.classList.add('active');
                }
            });

            // Initialize progress bars in the active category
            initProgressBars(category);
        });
    });
}

/**
 * Skills Progress Bars
 * Animates skill progress bars
 */
function startSkillsAnimation() {
    // Animate progress bars for the active category
    const activeCategory = document.querySelector('.skills-category.active');
    if (activeCategory) {
        const category = activeCategory.getAttribute('data-category');
        initProgressBars(category);
    }
}

function initProgressBars(category) {
    const activeCategory = document.querySelector(`.skills-category[data-category="${category}"]`);

    if (activeCategory) {
        const progressBars = activeCategory.querySelectorAll('.progress-bar');

        progressBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            const fill = bar.querySelector('.progress-fill');

            setTimeout(() => {
                fill.style.width = `${percent}%`;
            }, 100);
        });
    }
}

/**
 * Project Filter
 * Filters portfolio projects by category
 */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            projects.forEach(project => {
                const category = project.getAttribute('data-category');

                if (filter === 'all' || filter === category) {
                    project.style.display = 'block';

                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Scroll Indicator
 * Smooth scroll when clicking the scroll indicator
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');

            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Back To Top Button
 * Shows/hides the back to top button and scrolls to top when clicked
 */
function initBackToTop() {
    const backToTop = document.querySelector('#back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Contact Form
 * Handles form submission and validation
 */
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form fields
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const subject = document.querySelector('#subject').value;
            const message = document.querySelector('#message').value;

            // Simple form validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // For demonstration purposes, log the form data
            console.log('Form submitted:', { name, email, subject, message });

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = 'Message Sent!';

                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);

            // In a real implementation, you would send the form data to a server
            // using fetch or axios or integrate with a form service like Formspree
        });
    }
}

/**
 * Theme Panel
 * Controls the theme options panel
 */
function initThemePanel() {
    const themePanel = document.querySelector('.theme-panel');
    const themePanelToggle = document.querySelector('.theme-panel-toggle');
    const animationSpeedInput = document.querySelector('#animation-speed');
    const backgroundEffectsInput = document.querySelector('#background-effects');

    // Toggle theme panel
    if (themePanelToggle) {
        themePanelToggle.addEventListener('click', () => {
            themePanel.classList.toggle('active');
        });
    }

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (themePanel && themePanel.classList.contains('active')) {
            if (!themePanel.contains(e.target) && !themePanelToggle.contains(e.target)) {
                themePanel.classList.remove('active');
            }
        }
    });

    // Animation speed control
    if (animationSpeedInput) {
        // Get saved speed or use default
        const savedSpeed = localStorage.getItem('animationSpeed') || 1;
        animationSpeedInput.value = savedSpeed;

        // Apply initial speed
        document.documentElement.style.setProperty('--animation-speed-multiplier', savedSpeed);

        // Update on change
        animationSpeedInput.addEventListener('input', () => {
            const speed = animationSpeedInput.value;
            document.documentElement.style.setProperty('--animation-speed-multiplier', speed);
            localStorage.setItem('animationSpeed', speed);
        });
    }

    // Background effects toggle
    if (backgroundEffectsInput) {
        // Get saved setting or use default
        const savedSetting = localStorage.getItem('backgroundEffects');
        const enableBackground = savedSetting === null ? true : (savedSetting === 'true');

        // Set initial state
        backgroundEffectsInput.checked = enableBackground;
        toggleBackgroundEffects(enableBackground);

        // Update on change
        backgroundEffectsInput.addEventListener('change', () => {
            const isEnabled = backgroundEffectsInput.checked;
            toggleBackgroundEffects(isEnabled);
            localStorage.setItem('backgroundEffects', isEnabled);
        });
    }
}

function toggleBackgroundEffects(enabled) {
    const heroCanvas = document.querySelector('.hero-canvas-container');

    if (heroCanvas) {
        if (enabled) {
            heroCanvas.style.display = 'block';
        } else {
            heroCanvas.style.display = 'none';
        }
    }
}

/**
 * Hero Animation
 * Starts the hero section animations
 */
function startHeroAnimation() {
    // Animate hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const heroSocial = document.querySelector('.hero-social');

    if (heroTitle) heroTitle.classList.add('animated');

    setTimeout(() => {
        if (heroDescription) heroDescription.classList.add('animated');
    }, 300);

    setTimeout(() => {
        if (heroCta) heroCta.classList.add('animated');
    }, 600);

    setTimeout(() => {
        if (heroSocial) heroSocial.classList.add('animated');
    }, 900);
}

/**
 * GitHub Data Fetcher
 * Fetches and displays GitHub profile information
 */
function fetchGitHubData() {
    const username = 'Pusparaj99op';
    const apiUrl = `https://api.github.com/users/${username}`;
    const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

    // Create the GitHub stats container in the about section if it doesn't exist
    let githubStats = document.querySelector('.github-stats');

    if (!githubStats) {
        const aboutDetails = document.querySelector('.about-details');

        if (aboutDetails) {
            // Create the GitHub stats container
            githubStats = document.createElement('div');
            githubStats.className = 'github-stats';
            githubStats.innerHTML = `
                <h3 class="github-stats-title">GitHub Stats</h3>
                <div class="github-stats-loading">Loading GitHub data...</div>
                <div class="github-stats-content" style="display: none;">
                    <div class="stats-row">
                        <div class="stat-item">
                            <span class="stat-value" id="github-repos">-</span>
                            <span class="stat-label">Repositories</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value" id="github-followers">-</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value" id="github-stars">-</span>
                            <span class="stat-label">Stars</span>
                        </div>
                    </div>
                    <div class="github-top-repos">
                        <h4>Top Repositories</h4>
                        <ul id="github-repo-list"></ul>
                    </div>
                </div>
            `;

            // Insert after about-details
            aboutDetails.parentNode.insertBefore(githubStats, aboutDetails.nextSibling);

            // Add styles for GitHub stats
            const style = document.createElement('style');
            style.textContent = `
                .github-stats {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    border-radius: var(--border-radius);
                    background: var(--card-bg);
                    box-shadow: var(--box-shadow);
                }
                .github-stats-title {
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    color: var(--heading-color);
                }
                .github-stats-loading {
                    text-align: center;
                    padding: 1rem;
                    color: var(--text-muted);
                }
                .stats-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }
                .stat-item {
                    text-align: center;
                    flex: 1;
                }
                .stat-value {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    display: block;
                }
                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }
                .github-top-repos h4 {
                    font-size: 1rem;
                    margin-bottom: 0.75rem;
                    color: var(--heading-color);
                }
                .github-top-repos ul {
                    list-style: none;
                    padding: 0;
                }
                .github-top-repos li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .github-top-repos li:last-child {
                    border-bottom: none;
                }
                .repo-name {
                    font-weight: 500;
                    color: var(--text-color);
                }
                .repo-stars {
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                }
                .repo-stars i {
                    color: #f1c40f;
                    margin-right: 0.25rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Fetch GitHub profile data
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('GitHub API rate limit exceeded or profile not found');
            }
            return response.json();
        })
        .then(userData => {
            // Update followers count
            document.getElementById('github-followers').textContent = userData.followers;

            // Fetch repositories data
            return fetch(reposUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('GitHub API rate limit exceeded or repositories not found');
                    }
                    return response.json();
                })
                .then(reposData => {
                    // Update repos count
                    document.getElementById('github-repos').textContent = userData.public_repos;

                    // Calculate total stars
                    const totalStars = reposData.reduce((total, repo) => total + repo.stargazers_count, 0);
                    document.getElementById('github-stars').textContent = totalStars;

                    // Sort repositories by stars and get top 5
                    const topRepos = reposData
                        .sort((a, b) => b.stargazers_count - a.stargazers_count)
                        .slice(0, 5);

                    // Populate repository list
                    const repoList = document.getElementById('github-repo-list');
                    repoList.innerHTML = '';

                    topRepos.forEach(repo => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <a href="${repo.html_url}" class="repo-name" target="_blank" rel="noopener noreferrer">
                                ${repo.name}
                            </a>
                            <span class="repo-stars">
                                <i class="fas fa-star"></i>
                                ${repo.stargazers_count}
                            </span>
                        `;
                        repoList.appendChild(li);
                    });

                    // Hide loading, show content
                    document.querySelector('.github-stats-loading').style.display = 'none';
                    document.querySelector('.github-stats-content').style.display = 'block';
                });
        })
        .catch(error => {
            console.error('Error fetching GitHub data:', error);

            if (githubStats) {
                githubStats.querySelector('.github-stats-loading').textContent =
                    'Could not load GitHub data. Please try again later.';
            }
        });
}

/**
 * Certificates Statistics Animation
 * Animates number counters when they come into view
 */
function initCertificatesStats() {
    const statsNumbers = document.querySelectorAll('.stat-number[data-count]');

    if (statsNumbers.length === 0) return;

    // Create intersection observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statsNumbers.forEach(statNumber => {
        observer.observe(statNumber);
    });
}

function animateCounter(element) {
    const targetCount = parseInt(element.dataset.count);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOutCubic * targetCount);

        element.textContent = currentCount;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetCount;
        }
    }

    requestAnimationFrame(updateCounter);
}
