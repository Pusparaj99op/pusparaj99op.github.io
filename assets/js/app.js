/**
 * Portfolio Website - Main JavaScript
 * GSAP-Powered Animations
 * Author: Pranay Gajbhiye
 * Version: 2.0
 */

// ================================================
// GSAP & Plugin Registration
// ================================================
gsap.registerPlugin(ScrollTrigger);

// ================================================
// DOM Content Loaded - Initialize Everything
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initTheme();
    initHeroAnimations();
    initScrollAnimations();
    initSkillsTabs();
    initProjectFilters();
    initContactForm();
    initThemePanel();
    initBackToTop();
    initMagneticButtons();
    initParallax();
    initCounters();
    init3DBackground();
});

// ================================================
// Preloader
// ================================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    const progress = document.querySelector('.preloader-progress');

    if (!preloader) return;

    // Animate progress bar
    gsap.to(progress, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            // Slide preloader up
            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    // Trigger hero animations after preloader
                    animateHeroContent();
                }
            });
        }
    });
}

// ================================================
// Navigation
// ================================================
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Animate menu items
            if (navMenu.classList.contains('active')) {
                gsap.from('.nav-menu .nav-link', {
                    x: 50,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Header scroll effect
    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
            if (self.direction === 1) {
                header?.classList.add('scrolled');
            } else if (self.scroll() < 80) {
                header?.classList.remove('scrolled');
            }
        }
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateActiveLink(section.id),
            onEnterBack: () => updateActiveLink(section.id)
        });
    });

    function updateActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }
}

// ================================================
// Hero Animations
// ================================================
function initHeroAnimations() {
    // Initial state - will be animated by animateHeroContent
    gsap.set('.hero-content > *', { opacity: 0, y: 50 });
    gsap.set('.scroll-indicator', { opacity: 0, y: -20 });
}

function animateHeroContent() {
    const tl = gsap.timeline();

    // Animate navigation
    tl.from('.navbar', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Animate hero content with stagger
    tl.to('.hero-greeting', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, '-=0.3')

        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.3')

        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')

        .to('.hero-description', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3')

        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2')

        .to('.hero-social', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3')

        // Animate individual social buttons
        .from('.hero-social .social-btn', {
            scale: 0,
            rotation: -180,
            stagger: 0.1,
            duration: 0.5,
            ease: 'back.out(1.7)'
        }, '-=0.3')

        // Scroll indicator
        .to('.scroll-indicator', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.2');

    // Continuous scroll indicator animation
    gsap.to('.scroll-indicator .wheel', {
        y: 10,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power2.in'
    });
}

// ================================================
// Scroll Animations
// ================================================
function initScrollAnimations() {
    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // About Section
    animateAboutSection();

    // Skills Section
    animateSkillsSection();

    // Projects Section
    animateProjectsSection();

    // Experience Timeline
    animateTimeline();

    // Certificates
    animateCertificates();

    // Contact Section
    animateContact();
}

function animateAboutSection() {
    const about = document.querySelector('#about');
    if (!about) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: about,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    tl.from('.about-image-wrapper', {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    })
        .from('.about-image-decoration', {
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.6')
        .from('.about-text > *', {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')
        .from('.about-detail-item', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');
}

function animateSkillsSection() {
    const skills = document.querySelector('#skills');
    if (!skills) return;

    // Animate tabs
    gsap.from('.skill-tab', {
        scrollTrigger: {
            trigger: '.skills-tabs',
            start: 'top 85%'
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });

    // Animate skill cards
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 85%'
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.5)',
        onComplete: () => animateProgressBars()
    });
}

function animateProgressBars() {
    document.querySelectorAll('.skill-bar').forEach(bar => {
        const progress = bar.querySelector('.skill-progress');
        const percent = bar.dataset.percent || 0;

        gsap.to(progress, {
            width: `${percent}%`,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
}

function animateProjectsSection() {
    const projects = document.querySelector('#projects');
    if (!projects) return;

    // Animate filter buttons
    gsap.from('.filter-btn', {
        scrollTrigger: {
            trigger: '.project-filters',
            start: 'top 85%'
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
    });

    // Animate project cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%'
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.2)'
    });
}

function animateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    // Animate timeline line
    gsap.from('.timeline::before', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%'
        },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power2.out'
    });

    // Animate each timeline item
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const direction = i % 2 === 0 ? -50 : 50;

        gsap.from(item.querySelector('.timeline-marker'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            scale: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });

        gsap.from(item.querySelector('.timeline-content'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            x: direction,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out'
        });
    });
}

function animateCertificates() {
    const certificates = document.querySelector('#certificates');
    if (!certificates) return;

    gsap.from('.certificate-card', {
        scrollTrigger: {
            trigger: '.certificates-grid',
            start: 'top 85%'
        },
        y: 50,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.5)'
    });
}

function animateContact() {
    const contact = document.querySelector('#contact');
    if (!contact) return;

    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 85%'
        },
        x: -50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.form-group', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2.out'
    });
}

// ================================================
// Skills Tabs
// ================================================
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const categories = document.querySelectorAll('.skills-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show selected category with animation
            categories.forEach(c => {
                if (c.dataset.category === category) {
                    c.classList.add('active');

                    // Animate cards in new category
                    gsap.from(c.querySelectorAll('.skill-card'), {
                        y: 30,
                        opacity: 0,
                        stagger: 0.1,
                        duration: 0.5,
                        ease: 'back.out(1.5)',
                        onComplete: () => {
                            // Animate progress bars
                            c.querySelectorAll('.skill-bar').forEach(bar => {
                                const progress = bar.querySelector('.skill-progress');
                                const percent = bar.dataset.percent || 0;
                                gsap.to(progress, {
                                    width: `${percent}%`,
                                    duration: 1.5,
                                    ease: 'power2.out'
                                });
                            });
                        }
                    });
                } else {
                    c.classList.remove('active');
                }
            });
        });
    });
}

// ================================================
// Project Filters
// ================================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects with animation
            projects.forEach(project => {
                const category = project.dataset.category;

                if (filter === 'all' || filter === category) {
                    gsap.to(project, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        onStart: () => {
                            project.style.display = 'block';
                        }
                    });
                } else {
                    gsap.to(project, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            project.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// ================================================
// Contact Form
// ================================================
function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name')?.value;
        const email = form.querySelector('#email')?.value;
        const subject = form.querySelector('#subject')?.value;
        const message = form.querySelector('#message')?.value;

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Animate submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';

            gsap.from(submitBtn, {
                scale: 0.8,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// ================================================
// Theme System
// ================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.dataset.theme = savedTheme;
    updateThemeButtons(savedTheme);
}

function setTheme(theme) {
    // Animate theme transition
    gsap.to('body', {
        opacity: 0.8,
        duration: 0.2,
        onComplete: () => {
            document.body.dataset.theme = theme;
            localStorage.setItem('theme', theme);
            updateThemeButtons(theme);

            gsap.to('body', {
                opacity: 1,
                duration: 0.3
            });
        }
    });
}

function updateThemeButtons(theme) {
    document.querySelectorAll('.theme-option, .theme-toggle').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
}

// ================================================
// Theme Panel
// ================================================
function initThemePanel() {
    const panel = document.querySelector('.theme-panel');
    const toggle = document.querySelector('.theme-panel-toggle');
    const options = document.querySelectorAll('.theme-option');
    const themeToggle = document.querySelector('.theme-toggle');

    // Toggle panel
    toggle?.addEventListener('click', () => {
        panel?.classList.toggle('active');
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (panel?.classList.contains('active')) {
            if (!panel.contains(e.target) && !toggle.contains(e.target)) {
                panel.classList.remove('active');
            }
        }
    });

    // Theme option buttons
    options.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            setTheme(theme);
        });
    });

    // Quick theme toggle (cycles through themes)
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const themes = ['dark', 'light', 'neon'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
    });
}

// ================================================
// Back to Top Button
// ================================================
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    // Show/hide based on scroll
    ScrollTrigger.create({
        start: 'top -500',
        onUpdate: (self) => {
            if (self.scroll() > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }
    });

    // Scroll to top on click
    btn.addEventListener('click', () => {
        gsap.to(window, {
            scrollTo: { y: 0, autoKill: false },
            duration: 1,
            ease: 'power2.inOut'
        });
    });
}

// ================================================
// Magnetic Buttons
// ================================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .social-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ================================================
// Parallax Effects
// ================================================
function initParallax() {
    // Hero parallax
    gsap.to('.hero-canvas', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        opacity: 0.3
    });

    // Section backgrounds
    gsap.utils.toArray('[data-parallax]').forEach(el => {
        const speed = el.dataset.parallax || 0.5;

        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: 100 * speed
        });
    });
}

// ================================================
// Counter Animation
// ================================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => animateCounter(counter),
            once: true
        });
    });
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2;

    gsap.to(el, {
        innerText: target,
        duration: duration,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function () {
            el.innerText = Math.round(this.targets()[0].innerText);
        }
    });
}

// ================================================
// 3D Background (Three.js)
// ================================================
function init3DBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;

        // Mouse follow
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ================================================
// Hover Animations for Cards
// ================================================
document.querySelectorAll('.project-card, .skill-card, .certificate-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ================================================
// Smooth Scroll for Anchor Links
// ================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            gsap.to(window, {
                scrollTo: { y: target, offsetY: 80 },
                duration: 1,
                ease: 'power2.inOut'
            });
        }
    });
});

// ================================================
// Console Easter Egg
// ================================================
console.log(
    '%c👋 Hey there, developer!',
    'color: #6366f1; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cInterested in the code? Check out my GitHub: https://github.com/Pusparaj99op',
    'color: #8b5cf6; font-size: 14px;'
);
