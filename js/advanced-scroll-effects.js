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
        // this.setupSectionNavigation(); // Consider removing or simplifying if causing issues
        this.setupScrollProgress();
        // this.setupMorphingBackground(); // Consider removing or simplifying if causing issues
        this.bindEvents();
    }

    setupSmoothScrolling() {
        // Simplified smooth scrolling - relying more on native browser capabilities or CSS
        // The custom wheel and touchmove handlers can sometimes conflict or be overly complex.
        // Consider using CSS `scroll-behavior: smooth;` on the `html` element.
        // If more control is needed, ensure the existing implementation is heavily optimized.

        // For this iteration, we'll reduce the complexity of the custom smooth scroll.
        // We can disable the custom wheel event listener for now or make it less aggressive.
        
        // Option 1: Disable custom wheel scrolling to test if it's the source of lag
        // window.removeEventListener('wheel', this.customWheelScrollHandler); // Assuming you refactor to a named handler

        // Option 2: Simplify the existing smooth scroll or reduce its aggressiveness
        let isScrolling = false;
        this.customWheelScrollHandler = (e) => { // Store handler for potential removal
            if (!this.smoothScrolling) return;
            
            // Reduce interference: only preventDefault if we are actually handling the scroll
            // e.preventDefault(); // Moved down

            // COMPLETELY DISABLE CUSTOM WHEEL SCROLL LOGIC FOR NOW
            /*
            if (!isScrolling) {
                e.preventDefault(); // Prevent default only when we initiate a custom scroll
                isScrolling = true;
                
                const delta = e.deltaY;
                // Reduce scroll step or increase duration for a less "jerky" feel if issues persist
                const scrollAmount = delta * 0.8; // Reduced sensitivity
                const targetScroll = Math.max(0, Math.min(
                    document.body.scrollHeight - window.innerHeight,
                    window.scrollY + scrollAmount
                ));
                
                // Shorter duration for quicker, potentially smoother feel, or longer if easing is the issue
                this.smoothScrollTo(targetScroll, 300).then(() => { // Reduced duration
                    isScrolling = false;
                });
            }
            */
        };
        
        // window.addEventListener('wheel', this.customWheelScrollHandler, { passive: false }); // COMPLETELY DISABLED THIS LISTENER

        // Mobile touch scrolling can also be simplified or made less aggressive
        let touchStartY = 0;
        // let touchMoveY = 0; // Not strictly needed if calculating delta differently

        this.touchStartHandler = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        this.touchMoveHandler = (e) => {
            if (!this.smoothScrolling || isScrolling) return; // Don't interfere if already scrolling

            const touchMoveY = e.touches[0].clientY;
            const delta = (touchStartY - touchMoveY) * 1.0; // Reduced sensitivity for touch
            
            // To avoid conflicts, consider if direct scrollTo is better or if it should also use smoothScrollTo
            // For now, let's keep direct scroll for touch to see if it's smoother
            // but ensure it doesn't fight with other scroll logic.
            
            // Debounce or throttle this if it's firing too rapidly
            // requestAnimationFrame(() => { // Process scroll in animation frame
            //     window.scrollBy(0, delta);
            // });
            // Simpler approach:
            window.scrollBy({ top: delta, behavior: 'smooth' }); // Use native smooth if possible for touch


            touchStartY = touchMoveY; // Update startY for next movement delta
        };
        
        window.addEventListener('touchstart', this.touchStartHandler, { passive: true }); // passive: true if not preventing default
        window.addEventListener('touchmove', this.touchMoveHandler, { passive: false }); // passive: false if e.preventDefault() might be called
    }

    smoothScrollTo(target, duration = 500) { // Default duration adjusted
        return new Promise((resolve) => {
            const start = window.scrollY;
            const distance = target - start;
            const startTime = performance.now();

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out-cubic or easeOutQuad for potentially smoother feel)
                // const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const ease = progress * (2 - progress); // easeOutQuad, simpler and often smooth
                
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
        // Re-introducing parallax with more conservative settings and fewer elements initially.
        const parallaxConfig = [
            { selector: '.hero-background', speed: 0.3, direction: 'vertical' }, // Slower speed
            // { selector: '.floating-elements', speed: 0.2, direction: 'vertical' }, // Keep disabled for now
            { selector: '.background-shapes', speed: 0.5, direction: 'vertical' }, // Slower speed
            // { selector: '.project-card', speed: 0.05, direction: 'vertical', rotate: false }, // Very subtle if re-enabled
            // { selector: '.skill-icon', speed: 0.1, direction: 'horizontal', scale: false },
            // { selector: '.achievement-card', speed: 0.15, direction: 'vertical', opacity: false }
        ];

        this.parallaxElements = []; // Clear existing
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
        // Re-introducing a limited set of scroll triggers with performant animations.
        const triggers = [
            {
                selector: '.hero-content',
                animation: 'fadeInUp', // Using a more standard and performant animation name
                offset: 0.1,
                duration: 600, // Reduced duration
                delay: 0
            },
            {
                selector: '.about-content',
                animation: 'fadeInScale', // Ensure this is a performant CSS animation
                offset: 0.2,
                duration: 500, // Reduced duration
                delay: 50 // Reduced delay
            },
            // Add more triggers cautiously, ensuring they are optimized.
        ];

        this.scrollTriggers = []; // Clear existing
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
        // Optimize parallax updates:
        // 1. Only update visible elements.
        // 2. Throttle or debounce this function if called too frequently.
        // 3. Use requestAnimationFrame for updates.

        if (!this.parallaxElements.length) return;

        requestAnimationFrame(() => {
            const scrollRatio = this.scrollPosition / (document.body.scrollHeight - window.innerHeight);
            
            this.parallaxElements.forEach(item => {
                const rect = item.element.getBoundingClientRect();
                // Check if the element is roughly within the viewport or close to it
                // (e.g., allow some buffer for elements about to enter or leave)
                const buffer = window.innerHeight * 0.5; // 50% buffer top and bottom
                if (rect.bottom < -buffer || rect.top > window.innerHeight + buffer) {
                    // Element is well outside the viewport, skip updating it
                    // Optionally, reset to a default state if needed when it goes off-screen
                    // For now, just skip the transform update for performance.
                    return; 
                }

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
        });
    }

    updateScrollTriggers() {
        // Optimize scroll triggers:
        // 1. Use IntersectionObserver for visibility detection if possible (more performant).
        //    However, the current boundingClientRect approach is fine if not too many elements.
        // 2. Ensure animations are efficient.

        // For now, this function will do less if scrollTriggers is empty.
        if (!this.scrollTriggers.length) return;
        
        requestAnimationFrame(() => {
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
        if (this.optimizationLevel === 'high') return; // Skip if high optimization

        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / docHeight;

        // Optimized: Use requestAnimationFrame for smoother updates and reduce complexity.
        // The morphing effect should be subtle and not resource-intensive.
        // Example: Change background gradient based on scroll.
        // This is a placeholder for a more optimized morphing effect.
        // If the original was too heavy, it needs to be replaced or heavily simplified.

        // For now, let's assume a simple gradient change to test re-integration.
        // If a canvas or WebGL based morphing background was used, it needs careful optimization.
        // const morphElement = document.querySelector('.morphing-bg'); // Assuming this element exists
        // if (morphElement) {
        //     const color1Stop = Math.min(100, scrollPercent * 100 + 20); // Example calculation
        //     const color2Stop = Math.max(0, 80 - scrollPercent * 100); // Example calculation
        //     morphElement.style.background = `linear-gradient(135deg, 
        //         hsl(${200 + scrollPercent * 50}, 70%, 60%) 0%, 
        //         hsl(${240 + scrollPercent * 30}, 80%, 50%) ${color1Stop}%, 
        //         hsl(${280 - scrollPercent * 60}, 75%, 55%) 100%
        //     )`; 
        // }
        // The above morphing background logic is commented out as it was a placeholder.
        // The actual morphing background implementation needs to be reviewed and optimized separately
        // if it was causing performance issues. For now, we focus on parallax and scroll triggers.
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
        if (window.enhanced3D && typeof window.enhanced3D.triggerElementAnimation === 'function') {
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
        // window.removeEventListener('wheel', this.smoothScrollHandler); // Original, if you had one
        // window.removeEventListener('wheel', this.customWheelScrollHandler); // For the new one - NOW DISABLED
        window.removeEventListener('touchstart', this.touchStartHandler);
        window.removeEventListener('touchmove', this.touchMoveHandler);

        window.removeEventListener('scroll', this.scrollHandlerRef); // Assuming scrollHandlerRef is bound
        window.removeEventListener('mousemove', this.mouseMoveHandlerRef); // Assuming mouseMoveHandlerRef is bound
        
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
    if (typeof AdvancedScrollEffects !== 'undefined') {
        window.advancedScrollEffects = new AdvancedScrollEffects();
    }
    
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
