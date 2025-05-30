/**
 * Enhanced Interactive Effects System
 * Advanced micro-interactions, hover effects, and user engagement features
 */

class EnhancedInteractiveEffects {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.cursorElements = [];
        this.magneticElements = [];
        this.rippleElements = [];
        this.tiltElements = [];
        this.mousePosition = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        this.createCustomCursor();
        this.setupMagneticElements();
        this.setupRippleEffects();
        this.setupTiltEffects();
        this.setupHoverEffects();
        this.setupTypingEffects();
        this.setupProgressAnimations();
        this.setupParticleTrails();
        this.bindEvents();
    }

    createCustomCursor() {
        if (this.isTouch) return;

        // Create custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-outline"></div>
        `;
        
        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }
            
            .cursor-dot {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4px;
                height: 4px;
                background: #ffffff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            }
            
            .cursor-outline {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.15s ease;
            }
            
            .custom-cursor.hover .cursor-dot {
                transform: translate(-50%, -50%) scale(2);
                background: var(--primary-color, #6C63FF);
            }
            
            .custom-cursor.hover .cursor-outline {
                transform: translate(-50%, -50%) scale(1.5);
                border-color: var(--primary-color, #6C63FF);
            }
            
            .custom-cursor.click .cursor-dot {
                transform: translate(-50%, -50%) scale(0.5);
            }
            
            .custom-cursor.click .cursor-outline {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0.5;
            }
            
            body {
                cursor: none;
            }
            
            a, button, .clickable {
                cursor: none;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(cursor);
        this.cursor = cursor;
    }

    setupMagneticElements() {
        const magneticSelectors = [
            '.btn',
            '.social-icon',
            '.nav-link',
            '.project-card',
            '.achievement-card',
            '.skill-item'
        ];

        magneticSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('magnetic');
                this.magneticElements.push(element);
            });
        });
    }

    setupRippleEffects() {
        const rippleSelectors = [
            '.btn',
            '.card',
            '.glass-effect'
        ];

        rippleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('ripple-element');
                this.rippleElements.push(element);
            });
        });
    }

    setupTiltEffects() {
        const tiltSelectors = [
            '.project-card',
            '.glass-effect',
            '.achievement-card'
        ];

        tiltSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('tilt-element');
                this.tiltElements.push(element);
            });
        });
    }

    setupHoverEffects() {
        // Enhanced hover effects for various elements
        const hoverElements = document.querySelectorAll('.hover-glow');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createGlowEffect(element);
            });
        });

        // Text highlight effects
        const textElements = document.querySelectorAll('h1, h2, h3, .highlight-text');
        textElements.forEach(element => {
            this.addTextHighlightEffect(element);
        });
    }

    setupTypingEffects() {
        const typingElements = document.querySelectorAll('.typing-effect');
        typingElements.forEach(element => {
            this.createTypingEffect(element);
        });
    }

    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => observer.observe(bar));
    }

    setupParticleTrails() {
        if (this.isTouch) return;

        this.particles = [];
        this.maxParticles = 50;
        
        // Create particle container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-trail-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        document.body.appendChild(particleContainer);
        this.particleContainer = particleContainer;
    }

    bindEvents() {
        // Mouse movement events
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            
            this.updateCustomCursor(e);
            this.updateMagneticElements(e);
            this.updateTiltElements(e);
            this.createParticleTrail(e);
        });

        // Click events
        document.addEventListener('mousedown', () => {
            if (this.cursor) this.cursor.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            if (this.cursor) this.cursor.classList.remove('click');
        });

        // Hover events for interactive elements
        document.querySelectorAll('a, button, .clickable').forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.cursor) this.cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                if (this.cursor) this.cursor.classList.remove('hover');
            });
        });

        // Ripple effects
        this.rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(e, element);
            });
        });

        // Scroll-based effects
        window.addEventListener('scroll', () => {
            this.updateScrollBasedEffects();
        });

        // Touch events for mobile
        if (this.isTouch) {
            document.addEventListener('touchstart', (e) => {
                this.createTouchRipple(e);
            });
        }
    }

    updateCustomCursor(e) {
        if (!this.cursor) return;
        
        requestAnimationFrame(() => {
            this.cursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
        });
    }

    updateMagneticElements(e) {
        this.magneticElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            const maxDistance = 100;
            const strength = Math.max(0, 1 - distance / maxDistance);
            
            if (strength > 0) {
                const moveX = deltaX * strength * 0.3;
                const moveY = deltaY * strength * 0.3;
                
                element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${1 + strength * 0.1})`;
            } else {
                element.style.transform = 'translate3d(0, 0, 0) scale(1)';
            }
        });
    }

    updateTiltElements(e) {
        this.tiltElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);
            
            const maxDistance = 1;
            const distance = Math.min(maxDistance, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
            
            if (distance < maxDistance) {
                const rotateX = deltaY * 10;
                const rotateY = -deltaX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            } else {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            }
        });
    }

    createRippleEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Add ripple animation if not already present
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createGlowEffect(element) {
        const glow = document.createElement('div');
        glow.className = 'glow-effect';
        glow.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, 
                rgba(108, 99, 255, 0.3) 0%, 
                rgba(255, 107, 157, 0.2) 50%, 
                transparent 70%);
            border-radius: 50%;
            opacity: 0;
            animation: glowPulse 1.5s ease-in-out;
            pointer-events: none;
            z-index: -1;
        `;
        
        // Add glow animation
        if (!document.querySelector('#glow-styles')) {
            const style = document.createElement('style');
            style.id = 'glow-styles';
            style.textContent = `
                @keyframes glowPulse {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        setTimeout(() => {
            if (glow.parentNode) {
                glow.parentNode.removeChild(glow);
            }
        }, 1500);
    }

    addTextHighlightEffect(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                transition-delay: ${index * 0.05}s;
            `;
            element.appendChild(span);
        });
        
        element.addEventListener('mouseenter', () => {
            const spans = element.querySelectorAll('span');
            spans.forEach((span, index) => {
                setTimeout(() => {
                    span.style.color = 'var(--primary-color, #6C63FF)';
                    span.style.transform = 'translateY(-3px) scale(1.1)';
                    span.style.textShadow = '0 0 20px var(--primary-color, #6C63FF)';
                }, index * 50);
            });
        });
        
        element.addEventListener('mouseleave', () => {
            const spans = element.querySelectorAll('span');
            spans.forEach(span => {
                span.style.color = '';
                span.style.transform = '';
                span.style.textShadow = '';
            });
        });
    }

    createTypingEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(typeChar, 100 + Math.random() * 100);
            } else {
                // Add blinking cursor
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                element.appendChild(cursor);
                
                // Add blink animation
                if (!document.querySelector('#blink-styles')) {
                    const style = document.createElement('style');
                    style.id = 'blink-styles';
                    style.textContent = `
                        @keyframes blink {
                            0%, 50% { opacity: 1; }
                            51%, 100% { opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        };
        
        // Start typing effect when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeChar, 500);
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    }

    animateProgressBar(progressBar) {
        const percentage = progressBar.dataset.progress || 90;
        progressBar.style.setProperty('--progress', percentage / 100);
        progressBar.classList.add('animate');
        
        // Add counting animation
        const counter = progressBar.querySelector('.progress-counter');
        if (counter) {
            let currentValue = 0;
            const increment = percentage / 60; // 60 frames for 1 second
            
            const updateCounter = () => {
                currentValue += increment;
                if (currentValue >= percentage) {
                    counter.textContent = `${percentage}%`;
                } else {
                    counter.textContent = `${Math.round(currentValue)}%`;
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        }
    }

    createParticleTrail(e) {
        if (!this.particleContainer || Math.random() > 0.3) return;
        
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, 
                rgba(108, 99, 255, 0.8) 0%, 
                transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: particleTrail 1s ease-out forwards;
        `;
        
        // Add particle trail animation
        if (!document.querySelector('#particle-trail-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-trail-styles';
            style.textContent = `
                @keyframes particleTrail {
                    0% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) translateY(-50px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.particleContainer.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p !== particle);
            }
        }, 1000);
        
        // Limit particle count
        if (this.particles.length > this.maxParticles) {
            const oldParticle = this.particles.shift();
            if (oldParticle.parentNode) {
                oldParticle.parentNode.removeChild(oldParticle);
            }
        }
    }

    createTouchRipple(e) {
        if (e.touches.length === 0) return;
        
        const touch = e.touches[0];
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: ${touch.clientY - 25}px;
            left: ${touch.clientX - 25}px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(108, 99, 255, 0.3) 0%, 
                transparent 70%);
            pointer-events: none;
            z-index: 1000;
            animation: touchRipple 0.6s ease-out;
        `;
        
        // Add touch ripple animation
        if (!document.querySelector('#touch-ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'touch-ripple-styles';
            style.textContent = `
                @keyframes touchRipple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    updateScrollBasedEffects() {
        const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Update particle color based on scroll
        if (this.particleContainer) {
            const hue = 220 + (scrollProgress * 140);
            this.particleContainer.style.filter = `hue-rotate(${hue}deg)`;
        }
        
        // Update magnetic element sensitivity
        this.magneticElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                element.style.transform = 'translate3d(0, 0, 0) scale(1)';
            }
        });
    }

    // Public API methods
    enableEffects() {
        this.effectsEnabled = true;
    }

    disableEffects() {
        this.effectsEnabled = false;
        
        // Reset all transforms
        [...this.magneticElements, ...this.tiltElements].forEach(element => {
            element.style.transform = '';
        });
    }

    addMagneticElement(element) {
        if (!this.magneticElements.includes(element)) {
            element.classList.add('magnetic');
            this.magneticElements.push(element);
        }
    }

    removeMagneticElement(element) {
        const index = this.magneticElements.indexOf(element);
        if (index > -1) {
            element.classList.remove('magnetic');
            element.style.transform = '';
            this.magneticElements.splice(index, 1);
        }
    }

    destroy() {
        // Clean up all effects and event listeners
        if (this.cursor) {
            this.cursor.remove();
        }
        
        if (this.particleContainer) {
            this.particleContainer.remove();
        }
        
        // Remove all added styles
        const stylesToRemove = [
            '#ripple-styles',
            '#glow-styles',
            '#blink-styles',
            '#particle-trail-styles',
            '#touch-ripple-styles'
        ];
        
        stylesToRemove.forEach(id => {
            const style = document.querySelector(id);
            if (style) style.remove();
        });
        
        // Reset all element transforms
        [...this.magneticElements, ...this.tiltElements].forEach(element => {
            element.style.transform = '';
            element.style.transition = '';
        });
        
        // Reset body cursor
        document.body.style.cursor = '';
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.enhancedInteractiveEffects = new EnhancedInteractiveEffects();
    }
});
