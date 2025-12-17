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
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip);

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
// Marquee Animation
// ============================================
// ============================================
// Marquee Animation
// ============================================
function initMarquee() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    const content = marquee.querySelector('.marquee-content');
    if (!content) return;

    let distance = 0;

    function updateDistance() {
        const style = window.getComputedStyle(marquee);
        const gap = parseFloat(style.gap) || 0;
        const singleContentWidth = content.offsetWidth;

        distance = singleContentWidth + gap;

        // Ensure we have enough copies to fill screen + buffer
        const requiredCopies = Math.ceil(window.innerWidth / distance) + 2;

        while (marquee.children.length < requiredCopies) {
            const clone = content.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            marquee.appendChild(clone);
        }
    }

    // Initial measure
    updateDistance();
    window.addEventListener('resize', updateDistance);

    // State
    let xPos = 0;
    let currentDirection = 1; // 1 = Move Left (Default), -1 = Move Right
    let targetSpeed = 100; // px per second
    let currentSpeed = 100;
    let hoverFactor = 1;

    // Drag State
    let isDragging = false;
    let startX = 0;
    let lastDragX = 0;
    let dragVelocity = 0;
    let lastDragTime = 0;

    const section = document.querySelector('.marquee-section');

    if (section) {
        section.style.cursor = 'grab';

        // Hover Effects
        section.addEventListener('mouseenter', () => {
            gsap.to({ val: hoverFactor }, {
                val: 0.1, // Slow down to 10%
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: function () { hoverFactor = this.targets()[0].val; }
            });
        });

        section.addEventListener('mouseleave', () => {
            gsap.to({ val: hoverFactor }, {
                val: 1,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: function () { hoverFactor = this.targets()[0].val; }
            });
        });

        // Drag Handler
        const handleDragStart = (x) => {
            isDragging = true;
            startX = x;
            lastDragX = x;
            lastDragTime = Date.now();
            section.style.cursor = 'grabbing';
            dragVelocity = 0;
        };

        const handleDragMove = (x) => {
            if (!isDragging) return;

            const now = Date.now();
            const dt = now - lastDragTime;
            const delta = x - lastDragX;

            xPos += delta; // Direct movement

            if (dt > 0) {
                // Calculate velocity (px/ms -> px/sec slightly smoothed)
                const instantVel = (delta / dt) * 1000;
                dragVelocity += (instantVel - dragVelocity) * 0.5;
            }

            lastDragX = x;
            lastDragTime = now;
        };

        const handleDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            section.style.cursor = 'grab';

            // Determine direction from drag throw
            if (Math.abs(dragVelocity) > 50) {
                // If velocity is significant, take its direction
                // Dragging Left (negative vel) -> Direction 1 (Move Left)
                // Dragging Right (positive vel) -> Direction -1 (Move Right)
                currentDirection = dragVelocity < 0 ? 1 : -1;
            }
        };

        // Event Listeners
        section.addEventListener('mousedown', (e) => { e.preventDefault(); handleDragStart(e.clientX); });
        window.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
        window.addEventListener('mouseup', handleDragEnd);

        section.addEventListener('touchstart', (e) => handleDragStart(e.touches[0].clientX), { passive: false });
        window.addEventListener('touchmove', (e) => { if (isDragging) handleDragMove(e.touches[0].clientX); }, { passive: false });
        window.addEventListener('touchend', handleDragEnd);
    }

    // Scroll Direction Listener
    ScrollTrigger.create({
        trigger: 'html', // Watch global scroll
        start: 0,
        end: 'max',
        onUpdate: (self) => {
            if (isDragging) return;

            const vel = self.getVelocity();
            // Scroll Down (vel > 0) -> Move Left (Direction 1)
            // Scroll Up (vel < 0) -> Move Right (Direction -1)
            if (vel > 50) currentDirection = 1;
            if (vel < -50) currentDirection = -1;
        }
    });

    // Animation Loop
    gsap.ticker.add((time, deltaTime) => {
        const dt = deltaTime * 0.001; // seconds

        if (!isDragging) {
            // Constant movement
            // moveAmount = speed * direction * hoverFactor
            // We want direction 1 to decrease xPos (move left)

            const moveAmount = currentSpeed * currentDirection * hoverFactor * dt;
            xPos -= moveAmount;
        }

        // Infinite Loop Logic
        // If we've moved too far left (xPos very negative), wrap back
        if (xPos <= -distance) {
            xPos += distance;
        }
        // If we've moved too far right (xPos positive), wrap back
        else if (xPos > 0) {
            xPos -= distance;
        }

        gsap.set(marquee, { x: xPos });
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
    initHorizontalScroll();
    initMarquee();
    initCertificateFlip();
    initGridSpotlight();
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
// Horizontal Scroll Gallery
// ============================================
function initHorizontalScroll() {
    const horizontalSection = document.querySelector('.horiz-gallery-wrapper');
    if (!horizontalSection) return;

    const pinWrap = document.querySelector('.horiz-gallery-strip');
    if (!pinWrap) return;

    // Helper to get scroll amount
    function getScrollAmount() {
        let horizontalScrollLength = pinWrap.scrollWidth - window.innerWidth;
        return -(horizontalScrollLength + 100);
    }

    // Main Horizontal Movement
    const tween = gsap.to(pinWrap, {
        x: getScrollAmount,
        ease: "power2.inOut",
    });

    ScrollTrigger.create({
        trigger: ".horiz-gallery-wrapper",
        start: "center center", // Enhanced: Center positioning
        end: () => `+=${pinWrap.scrollWidth}`,
        pin: true,
        animation: tween,
        scrub: 1, // Softer scrub for premium feel
        invalidateOnRefresh: true,
    });

    // Enhancement: Parallax/Scale effect for images within cards
    // Using a separate loop to treat each card if visible
    const cards = pinWrap.querySelectorAll('.project-card');
    cards.forEach(card => {
        gsap.to(card.querySelector('.project-image'), {
            scale: 0.95,
            scrollTrigger: {
                trigger: card,
                containerAnimation: tween, // Link to horizontal scrolling
                start: "center right",
                end: "center left",
                scrub: true,
            }
        });
    });

    // Refresh adjustments
    const images = pinWrap.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            ScrollTrigger.refresh();
        } else {
            img.addEventListener('load', () => ScrollTrigger.refresh());
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
            const btnText = btn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            const icon = btn.querySelector('i');

            // Animate button width/content
            const tl = gsap.timeline();

            tl.to(btnText, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    btnText.textContent = 'Opening Email Client...';
                    icon.classList.remove('fa-paper-plane');
                    icon.classList.add('fa-check');
                }
            })
                .to(btnText, {
                    opacity: 1,
                    duration: 0.2
                });

            btn.disabled = true;

            setTimeout(() => {
                // Reset button
                gsap.to(btnText, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        btnText.textContent = originalText;
                        icon.classList.remove('fa-check');
                        icon.classList.add('fa-paper-plane');
                        btn.disabled = false;
                        form.reset();
                    }
                });

                tl.to(btnText, {
                    opacity: 1,
                    duration: 0.2,
                    delay: 0.2
                });
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
    initApp();
});


// ============================================
// Footer Animation
// ============================================
function initFooterAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    // Check for MorphSVGPlugin
    const hasMorphSVG = (typeof MorphSVGPlugin !== 'undefined');
    if (hasMorphSVG) {
        gsap.registerPlugin(MorphSVGPlugin);
    } else {
        console.warn('MorphSVGPlugin not found, animation will be limited');
    }

    const down = 'M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z';
    const center = 'M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V683H0V-0.3z';

    // Ensure initial state
    gsap.set('#bouncy-path', { attr: { d: down } });

    ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 80%',
        end: 'bottom bottom',
        toggleActions: 'play pause resume reverse',
        onEnter: self => {
            const velocity = self.getVelocity();
            const variation = velocity / 10000;

            if (hasMorphSVG) {
                gsap.fromTo('#bouncy-path', {
                    morphSVG: down
                }, {
                    duration: 2,
                    morphSVG: center,
                    ease: `elastic.out(${1 + Math.abs(variation)}, 0.2)`,
                    overwrite: 'true'
                });
            }
        }
    });
}

// ============================================
// Certificate Border Animation (Injected SVG)
// ============================================
function initCertificateBorders() {
    const boxes = document.querySelectorAll('.boxes-container .box');

    boxes.forEach(box => {
        // Create SVG NS
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        const rect = document.createElementNS(ns, "rect");

        svg.setAttribute("class", "box-svg-border");
        // We set width/height via CSS (100%), but rect needs specific attributes or 100%
        rect.setAttribute("width", "100%");
        rect.setAttribute("height", "100%");
        rect.setAttribute("rx", "12"); // Matches --radius-lg: 12px
        rect.setAttribute("ry", "12");
        rect.setAttribute("class", "box-border-rect");

        svg.appendChild(rect);
        box.appendChild(svg);
    });
}

// ============================================
// Certificate Flip Animation
// ============================================
function initCertificateFlip() {
    const modal = document.querySelector(".modal");
    if (!modal) return;

    const modalContent = modal.querySelector(".content");
    const modalOverlay = modal.querySelector(".overlay");
    const boxes = gsap.utils.toArray(".boxes-container .box");
    const boxesContent = gsap.utils.toArray(".box-content");
    let boxIndex = undefined;

    boxesContent.forEach((box, i) => {
        box.addEventListener("click", () => {
            if (boxIndex !== undefined) {
                // Closing the modal
                const state = Flip.getState(box);

                // Return box to original parent
                boxes[boxIndex].appendChild(box);
                boxIndex = undefined;

                // Hide modal
                gsap.to([modal, modalOverlay], {
                    autoAlpha: 0,
                    duration: 0.35,
                    ease: "sine.inOut",
                    onComplete: () => {
                        modal.classList.remove('active');
                    }
                });

                // Flip back
                Flip.from(state, {
                    duration: 0.7,
                    ease: "sine.inOut",
                    absolute: true, // Make it absolute during the flip
                    zIndex: 9999, // Force high z-index
                    onComplete: () => {
                        gsap.set(box, { zIndex: "auto" });
                    }
                });
            } else {
                // Opening the modal
                const state = Flip.getState(box);

                // Move box to modal
                modalContent.appendChild(box);
                boxIndex = i;

                // Show modal
                modal.classList.add('active');
                gsap.set(modal, { autoAlpha: 1 });
                gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35, ease: "sine.inOut" });

                // Flip to modal
                Flip.from(state, {
                    duration: 0.7,
                    ease: "sine.inOut"
                });
            }
        });
    });

    // Allow closing by clicking overlay or close button
    const closeBtn = modal.querySelector('.modal-close');
    const closeAction = () => {
        if (boxIndex !== undefined) {
            const activeBox = modalContent.querySelector('.box-content');
            if (activeBox) activeBox.click(); // Triggers the click on box which handles standard close
        }
    };

    modalOverlay.addEventListener('click', closeAction);
    if (closeBtn) closeBtn.addEventListener('click', closeAction);
}

// Add extra effects after app init
const originalInitApp = initApp;
initApp = function () {
    originalInitApp();
    initMagneticEffect();
    initCardTilt();
    initFooterAnimation();
    initCertificateBorders();
    initCertificateFlip();
    // initTextScrambleEffect(); // Uncomment for text scramble effect
};

// ============================================
// Grid Spotlight Effect
// ============================================
function initGridSpotlight() {
    const gridSections = document.querySelectorAll('.premium-grid-bg');

    // optimizations
    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!ticking) {
            requestAnimationFrame(() => {
                gridSections.forEach(section => {
                    const rect = section.getBoundingClientRect();

                    // Only update if section is in viewport (simple check)
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const x = ((mouseX - rect.left) / rect.width) * 100;
                        const y = ((mouseY - rect.top) / rect.height) * 100;

                        section.style.setProperty('--mouse-x', `${x}%`);
                        section.style.setProperty('--mouse-y', `${y}%`);
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}
