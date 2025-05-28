// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar li a');
    const goTopBtn = document.querySelector('.go-top');
    const sections = document.querySelectorAll('section');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Theme Toggle Functionality
    if (themeToggle) {
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme
        setTheme(savedTheme);
        
        // Theme toggle event listener
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        // Listen for system theme changes
        prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            }
        }
        
        // Trigger theme change event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    // Animation Management System - Improve performance by controlling animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only run animations when elements are visible
            if (entry.target.classList.contains('animate-on-scroll')) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                } else if (entry.target.hasAttribute('data-repeat')) {
                    entry.target.classList.remove('animated');
                }
            }

            // Pause heavy animations when not visible
            if (entry.target.classList.contains('animation-heavy')) {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('animation-paused');
                } else {
                    entry.target.classList.add('animation-paused');
                }
            }
        });
    }, { threshold: 0.1 });

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll, .animation-heavy').forEach(el => {
        animationObserver.observe(el);
    });

    // Handle navigation menu for mobile
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !hamburger.contains(e.target) && navbar.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }

    // Handle sticky header
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add sticky class when scrolling down
        if (scrollTop > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Hide header when scrolling down rapidly, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }

        lastScrollTop = scrollTop;

        const blurIntensity = Math.min(scrollTop / 100, 10);

        if (scrollTop > 50) {
            header.style.backdropFilter = `blur(${blurIntensity}px)`;
            header.style.webkitBackdropFilter = `blur(${blurIntensity}px)`;
            goTopBtn.classList.add('active');
        } else {
            header.style.backdropFilter = '';
            header.style.webkitBackdropFilter = '';
            goTopBtn.classList.remove('active');
        }

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollTop >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });    // Initialize theme toggle
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        } else if (savedTheme === 'dark') {
            document.body.classList.remove('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else if (prefersDark) {
            document.body.classList.remove('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.add('light-mode');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }

        themeToggle.addEventListener('click', () => {
            themeToggle.classList.add('animate-toggle');
            setTimeout(() => themeToggle.classList.remove('animate-toggle'), 500);

            document.body.classList.toggle('light-mode');

            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                if (hamburger && navbar.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navbar.classList.remove('active');
                }

                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Detect device capabilities
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    // Initialize appropriate animations based on device capability
    if (!isReducedMotion) {
        if (!isMobile) {
            if (window.animations) {
                window.animations.init();
            }
            if (window.visualEffects) {
                window.visualEffects.activateAll();
            }
        } else {
            if (window.mobileOptimizations) {
                window.mobileOptimizations.init();
            }
        }
    }

    // Back to top button
    if (goTopBtn) {
        goTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Handle contact form if it exists
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            formStatus.style.display = 'block';
            formStatus.className = 'form-status loading';
            formStatus.innerHTML = '<div class="spinner"></div> Sending message...';

            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully!';
                contactForm.reset();

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 3000);
            }, 1500);
        });
    }

    // Initialize any project filters
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                projectItems.forEach(project => {
                    if (filter === 'all' || project.classList.contains(filter)) {
                        project.classList.remove('hidden');
                    } else {
                        project.classList.add('hidden');
                    }
                });
            });
        });
    }
});
