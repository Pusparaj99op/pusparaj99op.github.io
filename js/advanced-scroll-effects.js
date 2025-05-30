/**
 * Advanced Scroll Effects System
 * Implements smooth scrolling, parallax, scroll-triggered animations, and 3D scroll effects
 */

class AdvancedScrollEffects {
    constructor() {
        this.scrollPosition = 0;
        this.lastScrollPosition = 0;
        this.scrollDirection = 'down';
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.parallaxElements = [];
        this.scrollTriggers = [];
        this.smoothScrolling = true;
        this.currentSection = 0;
        
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupParallaxElements();
        this.setupScrollTriggers();
        this.setupSectionNavigation();
        this.setupScrollProgress();
        this.setupMorphingBackground();
        this.bindEvents();
    }

    setupSmoothScrolling() {
        // Smooth scrolling implementation
        let isScrolling = false;
        
        window.addEventListener('wheel', (e) => {
            if (!this.smoothScrolling) return;
            
            e.preventDefault();
            
            if (!isScrolling) {
                isScrolling = true;
                
                const delta = e.deltaY;
                const targetScroll = Math.max(0, Math.min(
                    document.body.scrollHeight - window.innerHeight,
                    window.scrollY + delta
                ));
                
                this.smoothScrollTo(targetScroll, 800).then(() => {
                    isScrolling = false;
                });
            }
        }, { passive: false });

        // Handle mobile touch scrolling
        let touchStartY = 0;
        let touchMoveY = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!this.smoothScrolling) return;
            
            touchMoveY = e.touches[0].clientY;
            const delta = (touchStartY - touchMoveY) * 2;
            
            const targetScroll = Math.max(0, Math.min(
                document.body.scrollHeight - window.innerHeight,
                window.scrollY + delta
            ));
            
            window.scrollTo(0, targetScroll);
            touchStartY = touchMoveY;
        });
    }

    smoothScrollTo(target, duration = 1000) {
        return new Promise((resolve) => {
            const start = window.scrollY;
            const distance = target - start;
            const startTime = performance.now();

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-cubic)
                const ease = 1 - Math.pow(1 - progress, 3);
                
                window.scrollTo(0, start + distance * ease);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(animateScroll);
        });
    }

    setupParallaxElements() {
        // Enhanced parallax with multiple layers and effects
        const parallaxConfig = [
            { selector: '.hero-background', speed: 0.5, direction: 'vertical' },
            { selector: '.floating-elements', speed: 0.3, direction: 'vertical' },
            { selector: '.background-shapes', speed: 0.7, direction: 'vertical' },
            { selector: '.project-card', speed: 0.2, direction: 'vertical', rotate: true },
            { selector: '.skill-icon', speed: 0.4, direction: 'horizontal', scale: true },
            { selector: '.achievement-card', speed: 0.6, direction: 'both', opacity: true }
        ];

        parallaxConfig.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            elements.forEach(element => {
                this.parallaxElements.push({
                    element: element,
                    speed: config.speed,
                    direction: config.direction,
                    rotate: config.rotate || false,
                    scale: config.scale || false,
                    opacity: config.opacity || false,
                    originalTransform: element.style.transform,
                    originalOpacity: window.getComputedStyle(element).opacity
                });
            });
        });
    }

    setupScrollTriggers() {
        // Advanced scroll triggers with multiple animation types
        const triggers = [
            {
                selector: '.hero-content',
                animation: 'slideInUp',
                offset: 0.1,
                duration: 1000,
                delay: 0
            },
            {
                selector: '.about-content',
                animation: 'fadeInScale',
                offset: 0.2,
                duration: 800,
                delay: 200
            },
            {
                selector: '.project-card',
                animation: 'slideInStagger',
                offset: 0.15,
                duration: 600,
                delay: 100
            },
            {
                selector: '.skill-item',
                animation: 'bounceIn',
                offset: 0.2,
                duration: 500,
                delay: 50
            },
            {
                selector: '.achievement-card',
                animation: 'flipIn',
                offset: 0.25,
                duration: 700,
                delay: 150
            },
            {
                selector: '.timeline-item',
                animation: 'slideInAlternate',
                offset: 0.2,
                duration: 800,
                delay: 200
            },
            {
                selector: '.contact-card',
                animation: 'morphIn',
                offset: 0.3,
                duration: 1000,
                delay: 0
            }
        ];

        triggers.forEach(trigger => {
            const elements = document.querySelectorAll(trigger.selector);
            elements.forEach((element, index) => {
                this.scrollTriggers.push({
                    element: element,
                    animation: trigger.animation,
                    offset: trigger.offset,
                    duration: trigger.duration,
                    delay: trigger.delay * index,
                    triggered: false,
                    progress: 0
                });
            });
        });
    }

    setupSectionNavigation() {
        // Section-based navigation with scroll snapping
        const sections = document.querySelectorAll('section');
        this.sections = Array.from(sections);
        
        // Add section indicators
        this.createSectionIndicators();
        
        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && this.currentSection < this.sections.length - 1) {
                this.navigateToSection(this.currentSection + 1);
            } else if (e.key === 'ArrowUp' && this.currentSection > 0) {
                this.navigateToSection(this.currentSection - 1);
            }
        });
    }

    createSectionIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'scroll-indicators';
        indicators.innerHTML = `
            <style>
                .scroll-indicators {
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .scroll-indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .scroll-indicator.active {
                    background: var(--primary-color, #6C63FF);
                    border-color: var(--primary-color, #6C63FF);
                    transform: scale(1.2);
                }
                
                .scroll-indicator:hover {
                    transform: scale(1.1);
                    background: rgba(255, 255, 255, 0.5);
                }
                
                .scroll-indicator::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 4px;
                    height: 4px;
                    background: white;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .scroll-indicator.active::after {
                    opacity: 1;
                }
            </style>
        `;

        this.sections.forEach((section, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.addEventListener('click', () => this.navigateToSection(index));
            indicators.appendChild(indicator);
        });

        document.body.appendChild(indicators);
        this.sectionIndicators = indicators.querySelectorAll('.scroll-indicator');
    }

    navigateToSection(index) {
        if (index >= 0 && index < this.sections.length) {
            this.currentSection = index;
            const targetSection = this.sections[index];
            const targetPosition = targetSection.offsetTop;
            
            this.smoothScrollTo(targetPosition, 1200);
            this.updateSectionIndicators();
        }
    }

    updateSectionIndicators() {
        this.sectionIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSection);
        });
    }

    setupScrollProgress() {
        // Create scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = `
            <style>
                .scroll-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    z-index: 1001;
                    overflow: hidden;
                }
                
                .scroll-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, 
                        var(--primary-color, #6C63FF) 0%, 
                        var(--secondary-color, #FF6B9D) 50%, 
                        var(--accent-color, #4ECDC4) 100%);
                    width: 0%;
                    transition: width 0.1s ease;
                    position: relative;
                }
                
                .scroll-progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 20px;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5));
                    animation: shimmer 2s infinite;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-20px); }
                    100% { transform: translateX(20px); }
                }
            </style>
            <div class="scroll-progress-fill"></div>
        `;
        
        document.body.appendChild(progressBar);
        this.progressFill = progressBar.querySelector('.scroll-progress-fill');
    }

    setupMorphingBackground() {
        // Create morphing background based on scroll
        const morphingBg = document.createElement('div');
        morphingBg.className = 'morphing-background';
        morphingBg.innerHTML = `
            <style>
                .morphing-background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -1;
                    background: linear-gradient(45deg, 
                        hsl(var(--hue, 220), 70%, 10%) 0%,
                        hsl(calc(var(--hue, 220) + 60), 70%, 15%) 100%);
                    transition: all 1s ease;
                }
                
                .morphing-background::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(ellipse at var(--x, 50%) var(--y, 50%), 
                        rgba(255, 255, 255, 0.1) 0%, 
                        transparent 50%);
                    transition: all 0.3s ease;
                }
            </style>
        `;
        
        document.body.appendChild(morphingBg);
        this.morphingBackground = morphingBg;
    }

    bindEvents() {
        // Main scroll event handler
        window.addEventListener('scroll', () => {
            this.updateScrollPosition();
            this.updateParallax();
            this.updateScrollTriggers();
            this.updateScrollProgress();
            this.updateCurrentSection();
            this.updateMorphingBackground();
        });

        // Mouse move for interactive background
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            if (this.morphingBackground) {
                this.morphingBackground.style.setProperty('--x', `${x}%`);
                this.morphingBackground.style.setProperty('--y', `${y}%`);
            }
        });

        // Scroll start/stop detection
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                this.onScrollStop();
            }, 150);
        });
    }

    updateScrollPosition() {
        this.lastScrollPosition = this.scrollPosition;
        this.scrollPosition = window.scrollY;
        this.scrollDirection = this.scrollPosition > this.lastScrollPosition ? 'down' : 'up';
    }

    updateParallax() {
        const scrollRatio = this.scrollPosition / (document.body.scrollHeight - window.innerHeight);
        
        this.parallaxElements.forEach(item => {
            const { element, speed, direction, rotate, scale, opacity } = item;
            
            let transformString = item.originalTransform || '';
            
            // Vertical parallax
            if (direction === 'vertical' || direction === 'both') {
                const yOffset = this.scrollPosition * speed;
                transformString += ` translateY(${yOffset}px)`;
            }
            
            // Horizontal parallax
            if (direction === 'horizontal' || direction === 'both') {
                const xOffset = this.scrollPosition * speed * 0.5;
                transformString += ` translateX(${xOffset}px)`;
            }
            
            // Rotation effect
            if (rotate) {
                const rotation = scrollRatio * 360 * speed;
                transformString += ` rotate(${rotation}deg)`;
            }
            
            // Scale effect
            if (scale) {
                const scaleValue = 1 + (scrollRatio * speed * 0.5);
                transformString += ` scale(${scaleValue})`;
            }
            
            element.style.transform = transformString;
            
            // Opacity effect
            if (opacity) {
                const opacityValue = Math.max(0.1, 1 - (scrollRatio * speed));
                element.style.opacity = opacityValue;
            }
        });
    }

    updateScrollTriggers() {
        this.scrollTriggers.forEach(trigger => {
            if (!trigger.triggered) {
                const rect = trigger.element.getBoundingClientRect();
                const elementTop = rect.top;
                const elementHeight = rect.height;
                const triggerPoint = window.innerHeight * (1 - trigger.offset);
                
                if (elementTop <= triggerPoint) {
                    trigger.triggered = true;
                    this.animateElement(trigger);
                }
            }
        });
    }

    animateElement(trigger) {
        const { element, animation, duration, delay } = trigger;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            switch (animation) {
                case 'slideInUp':
                    this.slideInUp(element, duration);
                    break;
                case 'fadeInScale':
                    this.fadeInScale(element, duration);
                    break;
                case 'slideInStagger':
                    this.slideInStagger(element, duration);
                    break;
                case 'bounceIn':
                    this.bounceIn(element, duration);
                    break;
                case 'flipIn':
                    this.flipIn(element, duration);
                    break;
                case 'slideInAlternate':
                    this.slideInAlternate(element, duration);
                    break;
                case 'morphIn':
                    this.morphIn(element, duration);
                    break;
                default:
                    this.fadeIn(element, duration);
            }
        }, delay);
    }

    slideInUp(element, duration) {
        element.style.transform = 'translateY(60px)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        });
    }

    fadeInScale(element, duration) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }

    slideInStagger(element, duration) {
        const index = Array.from(element.parentNode.children).indexOf(element);
        const isEven = index % 2 === 0;
        
        element.style.transform = `translateX(${isEven ? '-60px' : '60px'})`;
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    bounceIn(element, duration) {
        element.style.transform = 'scale(0)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }

    flipIn(element, duration) {
        element.style.transform = 'rotateY(90deg)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'rotateY(0deg)';
            element.style.opacity = '1';
        });
    }

    slideInAlternate(element, duration) {
        const index = Array.from(element.parentNode.children).indexOf(element);
        const direction = index % 2 === 0 ? 'left' : 'right';
        
        element.style.transform = `translateX(${direction === 'left' ? '-100px' : '100px'}) rotate(${direction === 'left' ? '-5deg' : '5deg'})`;
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0) rotate(0deg)';
            element.style.opacity = '1';
        });
    }

    morphIn(element, duration) {
        element.style.transform = 'scale(0.5) rotate(45deg)';
        element.style.opacity = '0';
        element.style.borderRadius = '50%';
        element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1) rotate(0deg)';
            element.style.opacity = '1';
            element.style.borderRadius = '';
        });
    }

    fadeIn(element, duration) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    updateScrollProgress() {
        const progress = (this.scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        }
    }

    updateCurrentSection() {
        const offset = window.innerHeight * 0.5;
        
        this.sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= offset && rect.bottom >= offset) {
                if (this.currentSection !== index) {
                    this.currentSection = index;
                    this.updateSectionIndicators();
                    this.onSectionChange(index);
                }
            }
        });
    }

    updateMorphingBackground() {
        if (this.morphingBackground) {
            const hue = 220 + (this.scrollPosition / 10) % 360;
            this.morphingBackground.style.setProperty('--hue', hue);
        }
    }

    onSectionChange(index) {
        // Trigger section-specific animations or effects
        const section = this.sections[index];
        section.classList.add('active-section');
        
        // Remove active class from other sections
        this.sections.forEach((otherSection, otherIndex) => {
            if (otherIndex !== index) {
                otherSection.classList.remove('active-section');
            }
        });

        // Trigger 3D effects if available
        if (window.enhanced3D) {
            const animationTypes = ['explosion', 'wave', 'spiral', 'fadeIn'];
            const animationType = animationTypes[index % animationTypes.length];
            window.enhanced3D.triggerElementAnimation(animationType);
        }
    }

    onScrollStop() {
        // Snap to nearest section if enabled
        if (this.snapToSections) {
            const currentPosition = this.scrollPosition;
            let nearestSection = 0;
            let minDistance = Infinity;
            
            this.sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const distance = Math.abs(currentPosition - sectionTop);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSection = index;
                }
            });
            
            if (minDistance > 50) { // Only snap if not already close
                this.navigateToSection(nearestSection);
            }
        }
    }

    // Public API methods
    enableSmoothScrolling() {
        this.smoothScrolling = true;
    }

    disableSmoothScrolling() {
        this.smoothScrolling = false;
    }

    enableSnapToSections() {
        this.snapToSections = true;
    }

    disableSnapToSections() {
        this.snapToSections = false;
    }

    scrollToTop() {
        this.smoothScrollTo(0, 1500);
    }

    scrollToBottom() {
        this.smoothScrollTo(document.body.scrollHeight - window.innerHeight, 1500);
    }

    addCustomScrollTrigger(element, callback, offset = 0.2) {
        const trigger = {
            element: element,
            callback: callback,
            offset: offset,
            triggered: false
        };
        
        this.scrollTriggers.push(trigger);
    }

    destroy() {
        // Clean up event listeners and elements
        window.removeEventListener('wheel', this.smoothScrollHandler);
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        
        // Remove created elements
        const indicators = document.querySelector('.scroll-indicators');
        const progress = document.querySelector('.scroll-progress');
        const background = document.querySelector('.morphing-background');
        
        if (indicators) indicators.remove();
        if (progress) progress.remove();
        if (background) background.remove();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.advancedScrollEffects = new AdvancedScrollEffects();
    
    // Add some custom CSS for the animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation-fill-mode: both;
        }
        
        .active-section {
            z-index: 10;
        }
        
        section {
            transition: all 0.5s ease;
        }
        
        /* Enhanced scroll reveal animations */
        .scroll-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .scroll-reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animation for child elements */
        .stagger-child {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .stagger-child.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    
    document.head.appendChild(style);
});
