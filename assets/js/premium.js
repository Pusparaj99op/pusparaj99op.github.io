/**
 * Premium Portfolio - GSAP Inspired
 * Smooth Scroll & Advanced Animations
 * Author: Pranay Gajbhiye
 * Version: 4.0
 */

// ============================================
// Lenis Smooth Scroll
// ============================================
let lenis;

function initLenis() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// ============================================
// GSAP Registration
// ============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// DOM Elements
// ============================================
const dom = {
    loader: document.getElementById('loader'),
    loaderCounter: document.getElementById('loader-counter'),
    loaderBar: document.getElementById('loader-bar'),
    nav: document.getElementById('nav'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    themeToggle: document.getElementById('theme-toggle'),
    backToTop: document.getElementById('back-to-top'),
    reveals: document.querySelectorAll('.reveal'),
    skillCards: document.querySelectorAll('.skill-card'),
    statNumbers: document.querySelectorAll('.stat-number'),
};

// ============================================
// Loading Screen
// ============================================
function initLoader() {
    const counter = { value: 0 };

    const tl = gsap.timeline({
        onComplete: () => {
            exitLoader();
        }
    });

    // Fade in logo
    tl.to('.loader-logo', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
    })
        // Animate counter
        .to(counter, {
            value: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                dom.loaderCounter.textContent = Math.round(counter.value);
                dom.loaderBar.style.width = counter.value + '%';
            }
        });
}

function exitLoader() {
    const tl = gsap.timeline();

    tl.to('.loader-content', {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.in'
    })
        .to(dom.loader, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                dom.loader.style.display = 'none';
                document.body.classList.add('loaded');
                initApp();
            }
        });
}

// ============================================
// Main App Initialization
// ============================================
function initApp() {
    initLenis();
    initTheme();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initSkillAnimations();
    initStatsCounter();
    initBackToTop();
    initContactForm();
}

// ============================================
// Theme System (Day/Night)
// ============================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night');

    setTheme(savedTheme);

    dom.themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'night' ? 'day' : 'night';
        setTheme(newTheme);
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Animate theme transition
    gsap.to('body', {
        duration: 0.3,
        ease: 'power2.out'
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    // Mobile menu toggle
    dom.navToggle.addEventListener('click', () => {
        dom.navToggle.classList.toggle('active');
        dom.navMenu.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            dom.navToggle.classList.remove('active');
            dom.navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.2
                });
            }
        });
    });

    // Nav background on scroll
    ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
            if (self.scroll() > 100) {
                dom.nav.classList.add('scrolled');
            } else {
                dom.nav.classList.remove('scrolled');
            }
        }
    });

    // Active link on scroll
    document.querySelectorAll('section[id]').forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveLink(section.id),
            onEnterBack: () => setActiveLink(section.id)
        });
    });
}

function setActiveLink(id) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Hero Animations
// ============================================
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.2 });

    // Split hero title into chars
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = text.split('').map((char, i) =>
            char === ' ' ? ' ' : `<span class="char" style="--i: ${i}">${char}</span>`
        ).join('');

        // Animate chars
        tl.to('.hero-title .char', {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: 'power3.out'
        });
    }

    // Animate other hero elements
    tl.from('.hero-badge', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
    }, 0)
        .from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, 0.4)
        .from('.hero-cta', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, 0.5)
        .from('.hero-social', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power3.out'
        }, 0.6)
        .from('.scroll-indicator', {
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, 0.8);

    // Parallax on hero background
    gsap.to('.hero-grid', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// ============================================
// Scroll Reveal Animations
// ============================================
function initScrollAnimations() {
    // Reveal animations for all elements with .reveal class
    dom.reveals.forEach((el, index) => {
        gsap.fromTo(el,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Section headers animation
    gsap.utils.toArray('.section-header').forEach(header => {
        const label = header.querySelector('.section-label');
        const title = header.querySelector('.section-title');
        const desc = header.querySelector('.section-desc');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        if (label) {
            tl.from(label, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power3.out'
            });
        }

        if (title) {
            tl.from(title, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.3');
        }

        if (desc) {
            tl.from(desc, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power3.out'
            }, '-=0.3');
        }
    });

    // Cards stagger animation
    gsap.utils.toArray('.about-grid, .skills-grid, .projects-grid, .certificates-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.about-card, .skill-card, .project-card, .certificate-card');

        gsap.fromTo(cards,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Timeline items animation
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Marquee speed based on scroll
    const marquee = document.querySelector('.marquee');
    if (marquee) {
        ScrollTrigger.create({
            trigger: '.marquee-section',
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity()) / 100;
                gsap.to(marquee, {
                    animationDuration: Math.max(10, 20 - velocity) + 's',
                    overwrite: true
                });
            }
        });
    }
}

// ============================================
// Skill Bar Animations
// ============================================
function initSkillAnimations() {
    dom.skillCards.forEach(card => {
        const percent = card.getAttribute('data-percent') || 80;
        const progressBar = card.querySelector('.skill-progress');

        if (progressBar) {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(progressBar, {
                        width: percent + '%',
                        duration: 1.2,
                        ease: 'power3.out'
                    });
                }
            });
        }
    });
}

// ============================================
// Stats Counter Animation
// ============================================
function initStatsCounter() {
    dom.statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count')) || 0;

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            onEnter: () => {
                gsap.to(stat, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    onUpdate: function () {
                        stat.textContent = Math.round(this.targets()[0].textContent);
                    }
                });
            }
        });
    });
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    ScrollTrigger.create({
        start: 'top -400',
        onUpdate: (self) => {
            if (self.scroll() > 400) {
                dom.backToTop.classList.add('visible');
            } else {
                dom.backToTop.classList.remove('visible');
            }
        }
    });

    dom.backToTop.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.5 });
    });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Create mailto link
            const subject = encodeURIComponent(data.subject || 'Portfolio Contact');
            const body = encodeURIComponent(
                `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
            );

            window.location.href = `mailto:pranaygajbhiyeofficial@gmail.com?subject=${subject}&body=${body}`;

            // Show success feedback
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-check"></i> Opening Email Client...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }
}

// ============================================
// Magnetic Hover Effect
// ============================================
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .social-link, .nav-link');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// Card Tilt Effect
// ============================================
function initCardTilt() {
    const cards = document.querySelectorAll('.about-card, .skill-card, .project-card, .contact-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotateY: x * 10,
                rotateX: -y * 10,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// Text Scramble Effect
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.textContent;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to section titles on scroll
function initTextScrambleEffect() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
        const originalText = title.textContent;
        const scrambler = new TextScramble(title);
        let hasPlayed = false;

        ScrollTrigger.create({
            trigger: title,
            start: 'top 80%',
            onEnter: () => {
                if (!hasPlayed) {
                    hasPlayed = true;
                    scrambler.setText(originalText);
                }
            }
        });
    });
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
});

// Add extra effects after app init
const originalInitApp = initApp;
initApp = function () {
    originalInitApp();
    initMagneticEffect();
    initCardTilt();
    // initTextScrambleEffect(); // Uncomment for text scramble effect
};
