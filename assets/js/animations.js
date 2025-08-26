/**
 * Portfolio Website - GSAP Animations
 * Advanced animations using GSAP library
 * Version: 1.0
 * Last Modified: August 24, 2025
 */

// Initialize GSAP animations after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (window.gsap) {
        registerPlugins();

        // Initialize animations
        initPageTransitions();
        initHeroAnimations();
        initScrollAnimations();
        initHoverAnimations();
    }
});

/**
 * Register GSAP plugins
 */
function registerPlugins() {
    // Check if ScrollTrigger is available
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Check if other plugins are available
    if (window.MotionPathPlugin) {
        gsap.registerPlugin(MotionPathPlugin);
    }
}

/**
 * Page Transitions
 * Smooth transitions between page loads
 */
function initPageTransitions() {
    // Animate content when page loads
    gsap.from('body', {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out',
        onComplete: () => {
            document.body.classList.add('loaded');
        }
    });
}

/**
 * Hero Animations
 * Animated elements in the hero section
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero-content');

    if (!hero) return;

    // Create a timeline for sequential animations
    const tl = gsap.timeline({ delay: 1 });

    // Animate hero elements
    tl.from('.hero-title .greeting', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    })
    .from('.hero-title .name', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    }, '-=0.4')
    .from('.hero-title .profession', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    }, '-=0.4')
    .from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.hero-cta .btn', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out'
    }, '-=0.4')
    .from('.hero-social a', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.2')
    .from('.scroll-indicator', {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
    }, '-=0.2');

    // Animate the navigation after the hero
    gsap.from('.navbar', {
        y: -50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });

    // Continuous animation for scroll indicator
    gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

/**
 * Scroll Animations
 * Elements that animate when scrolled into view
 */
function initScrollAnimations() {
    // Only run if ScrollTrigger is available
    if (!window.ScrollTrigger) return;

    // About section animations
    animateAboutSection();

    // Skills section animations
    animateSkillsSection();

    // Projects section animations
    animateProjectsSection();

    // Experience timeline animations
    animateExperienceTimeline();

    // Contact section animations
    animateContactSection();
}

function animateAboutSection() {
    const aboutSection = document.querySelector('#about');

    if (!aboutSection) return;

    // Create a timeline for the about section
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'center center',
            toggleActions: 'play none none none'
        }
    });

    tl.from('.about-image .image-container', {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    })
    .from('.image-decoration', {
        x: -50,
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.5')
    .from('.about-text p', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.5')
    .from('.about-details .detail-item', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.about-text .btn', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.2');
}

function animateSkillsSection() {
    const skillsSection = document.querySelector('#skills');

    if (!skillsSection) return;

    // Animate the section header
    gsap.from('#skills .section-header', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Animate the category tabs
    gsap.from('.category-tab', {
        scrollTrigger: {
            trigger: '.category-tabs',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.7)'
    });

    // Animate skill cards when they come into view
    gsap.utils.toArray('.skills-category').forEach(category => {
        const cards = category.querySelectorAll('.skill-card');

        gsap.from(cards, {
            scrollTrigger: {
                trigger: category,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.5)',
            onComplete: () => {
                // Animate progress bars after cards appear
                cards.forEach(card => {
                    const progressBar = card.querySelector('.progress-fill');
                    const percent = card.querySelector('.progress-bar').getAttribute('data-percent');

                    if (progressBar) {
                        gsap.to(progressBar, {
                            width: `${percent}%`,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    });
}

function animateProjectsSection() {
    const projectsSection = document.querySelector('#projects');

    if (!projectsSection) return;

    // Animate the section header
    gsap.from('#projects .section-header', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Animate the filter buttons
    gsap.from('.filter-btn', {
        scrollTrigger: {
            trigger: '.project-filter',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
    });

    // Animate project cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.2)'
    });
}

function animateExperienceTimeline() {
    const experienceSection = document.querySelector('#experience');

    if (!experienceSection) return;

    // Animate the section header
    gsap.from('#experience .section-header', {
        scrollTrigger: {
            trigger: '#experience',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Animate the timeline line
    gsap.from('.timeline::after', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power2.out'
    });

    // Animate each timeline item
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        const direction = i % 2 === 0 ? -1 : 1;

        gsap.from(item.querySelector('.timeline-marker'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scale: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        });

        gsap.from(item.querySelector('.timeline-content'), {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            x: 50 * direction,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'back.out(1.2)'
        });
    });
}

function animateContactSection() {
    const contactSection = document.querySelector('#contact');

    if (!contactSection) return;

    // Animate the section header
    gsap.from('#contact .section-header', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Animate contact info items
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.2)'
    });

    // Animate contact form
    gsap.from('.contact-form-container', {
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.2)'
    });

    gsap.from('.form-group', {
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out'
    });
}

/**
 * Hover Animations
 * Interactive animations for buttons and elements
 */
function initHoverAnimations() {
    // Button hover animations
    animateButtonHovers();

    // Project card hover animations
    animateProjectCardHovers();

    // Skill card hover animations
    animateSkillCardHovers();

    // Contact item hover animations
    animateContactItemHovers();

    // Circular social button hover animations
    animateCircleButtonHovers();
}

function animateButtonHovers() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power1.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });
}

function animateProjectCardHovers() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const img = card.querySelector('img');
        const links = card.querySelectorAll('.project-link');

        // Create hover timeline
        const tl = gsap.timeline({ paused: true });

        // Add animations to timeline
        tl.to(img, {
            scale: 1.1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0)
        .to(card.querySelector('.project-overlay'), {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        }, 0)
        .from(links, {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }, 0.1);

        // Trigger on hover
        card.addEventListener('mouseenter', () => {
            tl.play();
        });

        card.addEventListener('mouseleave', () => {
            tl.reverse();
        });
    });
}

function animateSkillCardHovers() {
    const cards = document.querySelectorAll('.skill-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });

            gsap.to(card.querySelector('.skill-icon'), {
                scale: 1.2,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                duration: 0.3,
                ease: 'power2.out'
            });

            gsap.to(card.querySelector('.skill-icon'), {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

function animateContactItemHovers() {
    const items = document.querySelectorAll('.contact-item');

    items.forEach(item => {
        const icon = item.querySelector('.contact-icon');

        item.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.1,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-background)',
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                backgroundColor: 'var(--color-background-alt)',
                color: 'var(--color-primary)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Circle Button Hover Animations
 * Special hover effects for circular social media buttons
 */
function animateCircleButtonHovers() {
    const circleButtons = document.querySelectorAll('.circle-btn');

    circleButtons.forEach(btn => {
        // Create hover timeline
        const tl = gsap.timeline({ paused: true });

        // Add animations to timeline
        tl.to(btn, {
            scale: 1.15,
            y: -8,
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
            duration: 0.4,
            ease: 'back.out(1.7)'
        })
        .to(btn, {
            backgroundColor: btn.classList.contains('github-btn') ? 'rgba(51, 51, 51, 0.8)' :
                           btn.classList.contains('linkedin-btn') ? 'rgba(0, 119, 181, 0.8)' :
                           btn.classList.contains('youtube-btn') ? 'rgba(255, 0, 0, 0.8)' :
                           btn.classList.contains('instagram-btn') ? 'rgba(225, 48, 108, 0.8)' :
                           btn.classList.contains('award-btn') ? 'rgba(255, 215, 0, 0.8)' :
                           'rgba(255, 255, 255, 0.15)',
            color: '#fff',
            duration: 0.3,
            ease: 'power1.out'
        }, 0)
        .to(btn, {
            borderColor: 'rgba(255, 255, 255, 0.3)',
            duration: 0.3
        }, 0);

        // Trigger on hover
        btn.addEventListener('mouseenter', () => {
            tl.play();
        });

        btn.addEventListener('mouseleave', () => {
            tl.reverse();
        });
    });
}
