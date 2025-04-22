/**
 * Animations.js - Enhanced animations and visual effects
 * This module handles all advanced animations to create a more immersive experience
 */

(function() {
    'use strict';
    
    // Expose the API
    window.animations = {
        init: initAnimations,
        particles: initParticleSystem,
        parallax: initParallaxEffects,
        reveal: initScrollReveal,
        morph: initMorphingEffects,
        perspective: initPerspectiveEffects,
        floatingText: initFloatingTextEffect,  // Added new floating text animation
        liquidButton: initLiquidButtonEffect,   // Added new liquid button effect
        pageTransitions: initPageTransitions,   // NEW: Page transitions
        textScramble: initTextScrambleEffect,   // NEW: Text scramble effect
        magneticElements: initMagneticElements, // NEW: Magnetic element effect
        dynamicBackground: initDynamicBackground, // NEW: Dynamic backgrounds
        hoverReveal: initHoverRevealEffect      // NEW: Hover reveal effect
    };
    
    // Configuration
    const config = {
        particles: {
            count: 100,
            speed: 0.5,
            connectionDistance: 100
        },
        reveal: {
            threshold: 0.15,
            delay: 100
        },
        floatingText: {
            charactersClassName: 'floating-character',
            baseDelay: 100,
            randomness: 0.5
        },
        pageTransitions: {
            duration: 800,
            easing: 'cubic-bezier(0.76, 0, 0.24, 1)'
        },
        dynamicBackground: {
            speed: 0.05,
            colorShift: true
        }
    };
    
    /**
     * Check if device is capable of running advanced animations
     * @returns {boolean} True if device is high-end
     */
    function isHighEndDevice() {
        // Check for hardware concurrency (CPU cores)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) {
            return true;
        }
        
        // Check for device memory if available
        if (navigator.deviceMemory && navigator.deviceMemory >= 4) {
            return true;
        }
        
        // Check if device has accelerated graphics
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            return false;
        }
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            // Check if renderer contains indicators of powerful GPU
            if (/(nvidia|amd|radeon|intel iris|apple m|rtx|gtx)/i.test(renderer)) {
                return true;
            }
        }
        
        // Fall back to checking frame rate
        return checkFrameRate() >= 45;
    }
    
    /**
     * Check frame rate by running a quick animation test
     * @returns {number} Approximate frame rate
     */
    function checkFrameRate() {
        return new Promise(resolve => {
            let lastTime = performance.now();
            let frameCount = 0;
            let totalTime = 0;
            
            function countFrame(timestamp) {
                frameCount++;
                totalTime += timestamp - lastTime;
                lastTime = timestamp;
                
                if (frameCount < 10) {
                    requestAnimationFrame(countFrame);
                } else {
                    const fps = Math.round(1000 / (totalTime / frameCount));
                    resolve(fps);
                }
            }
            
            requestAnimationFrame(countFrame);
        });
    }
    
    /**
     * Initialize all animations
     */
    function initAnimations() {
        // Check if device is capable of running advanced animations
        if (window.innerWidth < 768 && !isHighEndDevice()) {
            initBasicAnimations();
            return;
        }
        
        // Initialize all advanced animations
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize particle effects
            initParticleSystem();
            
            // Add parallax effects
            initParallaxEffects();
            
            // Initialize scroll reveal animations
            initScrollReveal();
            
            // Add morphing effects
            initMorphingEffects();
            
            // Setup perspective effects
            initPerspectiveEffects();
            
            // Add floating text animation
            initFloatingTextEffect();
            
            // Add liquid button effects
            initLiquidButtonEffect();
            
            // Initialize page transitions
            initPageTransitions();
            
            // Initialize dynamic backgrounds
            initDynamicBackground();
            
            // Initialize magnetic elements
            initMagneticElements();
            
            console.log('✨ Advanced animations initialized');
        });
    }
    
    /**
     * Initialize simpler animations for lower-end devices
     */
    function initBasicAnimations() {
        console.log('🔄 Using basic animations for better performance');
        
        // Simplified reveal animations
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.15
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
        
        // Basic hover effects
        const buttons = document.querySelectorAll('.btn, .project-item, .achievement-card');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-5px)';
                button.style.transition = 'transform 0.3s ease';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
    
    /**
     * Initialize particle system for background effects
     */
    function initParticleSystem() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const canvas = document.getElementById('particles-canvas') || createCanvas();
        
        function createCanvas() {
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'particles-canvas';
            heroSection.prepend(newCanvas);
            return newCanvas;
        }
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;
        let isVisible = true;
        
        // Resize handler
        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
            createParticles();
        }
        
        // Create particles
        function createParticles() {
            particles = [];
            const { count, speed, connectionDistance } = config.particles;
            const particleCount = Math.min(Math.floor(window.innerWidth / 10), count);
            
            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 3 + 1;
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: size,
                    speedX: (Math.random() - 0.5) * speed,
                    speedY: (Math.random() - 0.5) * speed,
                    // Different colors for variety
                    color: [
                        `rgba(108, 99, 255, ${Math.random() * 0.5 + 0.2})`,
                        `rgba(0, 224, 255, ${Math.random() * 0.5 + 0.2})`,
                        `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.2})`
                    ][Math.floor(Math.random() * 3)],
                    // Add pulse animation
                    pulseFactor: Math.random() * 0.1 + 0.95,
                    pulseDirection: 1
                });
            }
        }
        
        // Draw particles
        function drawParticles() {
            if (!isVisible) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX *= -1;
                }
                
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY *= -1;
                }
                
                // Pulse animation
                if (particle.radius > particle.originalRadius * 1.2 || particle.radius < particle.originalRadius * 0.8) {
                    particle.pulseDirection *= -1;
                }
                
                particle.radius *= particle.pulseFactor * particle.pulseDirection;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particle.x - particles[j].x;
                    const dy = particle.y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.particles.connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 99, 255, ${(1 - distance / config.particles.connectionDistance) * 0.2})`;
                        ctx.stroke();
                    }
                }
            });
            
            animationFrame = requestAnimationFrame(drawParticles);
        }
        
        // Mouse interaction
        heroSection.addEventListener('mousemove', (e) => {
            if (!isHighEndDevice()) return;
            
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            particles.forEach(particle => {
                const dx = x - particle.x;
                const dy = y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const angle = Math.atan2(dy, dx);
                    const force = 0.2 * (1 - distance / 120);
                    
                    particle.speedX -= Math.cos(angle) * force;
                    particle.speedY -= Math.sin(angle) * force;
                }
            });
        });
        
        // Check if element is visible to save resources
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                
                if (isVisible) {
                    if (!animationFrame) {
                        animationFrame = requestAnimationFrame(drawParticles);
                    }
                } else {
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                        animationFrame = null;
                    }
                }
            });
        }, { threshold: 0 });
        
        observer.observe(heroSection);
        
        // Initialize
        resizeCanvas();
        drawParticles();
        
        // Handle resize
        window.addEventListener('resize', debounce(resizeCanvas, 200));
        
        // Return clean-up function
        return function cleanup() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            observer.disconnect();
        };
    }
    
    /**
     * Initialize parallax effects
     */
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        let scrollY = window.scrollY;
        
        const updateElements = () => {
            parallaxElements.forEach(element => {
                const speedX = parseFloat(element.dataset.parallaxX) || 0;
                const speedY = parseFloat(element.dataset.parallaxY) || 0.1;
                const speedRotate = parseFloat(element.dataset.parallaxRotate) || 0;
                const reverse = element.dataset.parallaxReverse === 'true';
                
                const rect = element.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distanceFromCenter = centerY - viewportCenter;
                
                // Only animate when element is near the viewport
                if (Math.abs(distanceFromCenter) < window.innerHeight) {
                    const direction = reverse ? -1 : 1;
                    const translateY = speedY * distanceFromCenter * direction * 0.1;
                    const translateX = speedX * distanceFromCenter * direction * 0.1;
                    const rotate = speedRotate * distanceFromCenter * direction * 0.01;
                    
                    element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg)`;
                }
            });
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateElements);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            requestTick();
        }, { passive: true });
        
        // Initial update
        requestTick();
    }
    
    /**
     * Initialize scroll reveal animations with advanced effects
     */
    function initScrollReveal() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const effectMap = {
            'fade-up': { opacity: [0, 1], translateY: [30, 0] },
            'fade-down': { opacity: [0, 1], translateY: [-30, 0] },
            'fade-left': { opacity: [0, 1], translateX: [30, 0] },
            'fade-right': { opacity: [0, 1], translateX: [-30, 0] },
            'zoom-in': { opacity: [0, 1], scale: [0.8, 1] },
            'zoom-out': { opacity: [0, 1], scale: [1.2, 1] },
            'flip-up': { opacity: [0, 1], rotateX: [90, 0] },
            'flip-down': { opacity: [0, 1], rotateX: [-90, 0] },
            'flip-left': { opacity: [0, 1], rotateY: [-90, 0] },
            'flip-right': { opacity: [0, 1], rotateY: [90, 0] },
            'slide-up': { translateY: ['100%', 0] },
            'slide-down': { translateY: ['-100%', 0] },
            'slide-left': { translateX: ['100%', 0] },
            'slide-right': { translateX: ['-100%', 0] }
        };
        
        const getTransform = (effect, progress) => {
            const transforms = [];
            
            if (effect.translateY) {
                const value = effect.translateY[0] + (effect.translateY[1] - effect.translateY[0]) * progress;
                transforms.push(`translateY(${value}${typeof effect.translateY[0] === 'string' ? '' : 'px'})`);
            }
            
            if (effect.translateX) {
                const value = effect.translateX[0] + (effect.translateX[1] - effect.translateX[0]) * progress;
                transforms.push(`translateX(${value}${typeof effect.translateX[0] === 'string' ? '' : 'px'})`);
            }
            
            if (effect.scale) {
                const value = effect.scale[0] + (effect.scale[1] - effect.scale[0]) * progress;
                transforms.push(`scale(${value})`);
            }
            
            if (effect.rotateX) {
                const value = effect.rotateX[0] + (effect.rotateX[1] - effect.rotateX[0]) * progress;
                transforms.push(`rotateX(${value}deg)`);
            }
            
            if (effect.rotateY) {
                const value = effect.rotateY[0] + (effect.rotateY[1] - effect.rotateY[0]) * progress;
                transforms.push(`rotateY(${value}deg)`);
            }
            
            return transforms.join(' ');
        };
        
        const applyStyles = (element, effect, progress) => {
            const transform = getTransform(effect, progress);
            if (transform) {
                element.style.transform = transform;
            }
            
            if (effect.opacity) {
                element.style.opacity = effect.opacity[0] + (effect.opacity[1] - effect.opacity[0]) * progress;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animation = element.dataset.animation || 'fade-up';
                const delay = parseInt(element.dataset.delay || 0);
                const duration = parseInt(element.dataset.duration || 800);
                const effect = effectMap[animation];
                
                if (!effect) return;
                
                if (entry.isIntersecting) {
                    // Initialize styles
                    applyStyles(element, effect, 0);
                    element.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0) ${delay}ms, opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0) ${delay}ms`;
                    
                    // Start animation on next frame
                    requestAnimationFrame(() => {
                        applyStyles(element, effect, 1);
                        element.classList.add('animated');
                    });
                    
                    // Unobserve if not repeating
                    if (!element.dataset.repeat) {
                        observer.unobserve(element);
                    }
                } else if (element.dataset.repeat) {
                    applyStyles(element, effect, 0);
                    element.classList.remove('animated');
                }
            });
        }, {
            threshold: config.reveal.threshold,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
        
        // Return cleanup function
        return function cleanup() {
            observer.disconnect();
        };
    }
    
    /**
     * Initialize morphing effects for SVG elements
     */
    function initMorphingEffects() {
        const morphElements = document.querySelectorAll('.morph-element');
        
        if (morphElements.length === 0 || typeof KUTE === 'undefined') return;
        
        morphElements.forEach(element => {
            const from = element.querySelector('.morph-from');
            const to = element.querySelector('.morph-to');
            
            if (!from || !to) return;
            
            const duration = parseInt(element.dataset.duration) || 2000;
            const delay = parseInt(element.dataset.delay) || 0;
            const easing = element.dataset.easing || 'easingCubicInOut';
            const repeatDelay = parseInt(element.dataset.repeatDelay) || 1000;
            
            const tween = KUTE.fromTo(
                from,
                { path: from },
                { path: to },
                { duration, delay, easing }
            );
            
            if (element.dataset.trigger === 'hover') {
                element.addEventListener('mouseenter', () => {
                    tween.start();
                });
                
                element.addEventListener('mouseleave', () => {
                    tween.start();
                });
            } else if (element.dataset.trigger === 'scroll') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            tween.start();
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(element);
            } else {
                // Auto-play with repeat
                tween.start();
                
                setInterval(() => {
                    tween.start();
                }, duration + repeatDelay);
            }
        });
    }
    
    /**
     * Initialize perspective effects for 3D-like interactions
     */
    function initPerspectiveEffects() {
        const cards = document.querySelectorAll('.card-3d');
        
        if (cards.length === 0) return;
        
        cards.forEach(card => {
            const content = card.querySelector('.card-3d-content');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const percentX = mouseX / rect.width;
                const percentY = mouseY / rect.height;
                
                const rotateY = (percentX - 0.5) * 20;
                const rotateX = (0.5 - percentY) * 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                if (content) {
                    content.style.transform = `translateZ(50px)`;
                    
                    // Add dynamic lighting effect
                    const shine = card.querySelector('.shine-effect');
                    if (shine) {
                        shine.style.background = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, rgba(255,255,255,0.25), transparent)`;
                    } else {
                        const newShine = document.createElement('div');
                        newShine.classList.add('shine-effect');
                        newShine.style.background = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, rgba(255,255,255,0.25), transparent)`;
                        card.appendChild(newShine);
                    }
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
                
                if (content) {
                    content.style.transform = `translateZ(0)`;
                }
                
                const shine = card.querySelector('.shine-effect');
                if (shine) {
                    shine.style.background = 'none';
                }
            });
        });
    }
    
    /**
     * Initialize floating text effect
     */
    function initFloatingTextEffect() {
        const textElements = document.querySelectorAll('.floating-text');
        
        if (textElements.length === 0) return;
        
        textElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.display = 'inline-block';
            
            [...text].forEach((char, index) => {
                if (char === ' ') {
                    element.appendChild(document.createTextNode(' '));
                    return;
                }
                
                const span = document.createElement('span');
                span.textContent = char;
                span.classList.add(config.floatingText.charactersClassName);
                
                // Add varying animation
                const delay = config.floatingText.baseDelay + (index * 50);
                const randomDelay = delay + (Math.random() * config.floatingText.randomness * 1000);
                
                span.style.animationDelay = `${randomDelay}ms`;
                span.style.animationDuration = `${2 + Math.random() * 2}s`;
                
                element.appendChild(span);
            });
            
            // Add letter-specific animations to floating characters
            const styleSheet = document.styleSheet || (function() {
                const style = document.createElement('style');
                document.head.appendChild(style);
                return style.sheet;
            })();
            
            const characters = element.querySelectorAll(`.${config.floatingText.charactersClassName}`);
            characters.forEach((char, index) => {
                const uniqueClass = `${config.floatingText.charactersClassName}-${index}`;
                char.classList.add(uniqueClass);
                
                const amplitude = 8 + Math.floor(Math.random() * 8);
                const period = 2 + Math.random() * 2;
                const startPhase = Math.random() * 360;
                
                const keyframesRule = `
                @keyframes float-${uniqueClass} {
                    0% { transform: translateY(0); }
                    25% { transform: translateY(-${amplitude}px); }
                    50% { transform: translateY(0); }
                    75% { transform: translateY(${amplitude / 2}px); }
                    100% { transform: translateY(0); }
                }`;
                
                styleSheet.insertRule(keyframesRule, 0);
                
                char.style.animation = `float-${uniqueClass} ${period}s ease-in-out infinite`;
                char.style.animationDelay = `${startPhase / 360 * period}s`;
            });
        });
    }
    
    /**
     * Initialize liquid button effect
     */
    function initLiquidButtonEffect() {
        const buttons = document.querySelectorAll('.liquid-btn');
        
        if (buttons.length === 0) return;
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                // Create random number of bubbles
                const bubbleCount = 7 + Math.floor(Math.random() * 5);
                
                for (let i = 0; i < bubbleCount; i++) {
                    const bubble = document.createElement('div');
                    bubble.classList.add('liquid-bubble');
                    
                    // Randomize bubble properties
                    const size = 10 + Math.random() * 30;
                    const left = Math.random() * 100;
                    const duration = 1 + Math.random() * 3;
                    const delay = Math.random() * 0.5;
                    
                    bubble.style.width = `${size}px`;
                    bubble.style.height = `${size}px`;
                    bubble.style.left = `${left}%`;
                    bubble.style.animationDuration = `${duration}s`;
                    bubble.style.animationDelay = `${delay}s`;
                    bubble.style.animationPlayState = 'running';
                    
                    button.appendChild(bubble);
                    
                    // Remove bubbles after animation
                    setTimeout(() => {
                        if (bubble.parentNode === button) {
                            button.removeChild(bubble);
                        }
                    }, (duration + delay) * 1000);
                }
            });
        });
    }
    
    /**
     * NEW: Initialize page transitions
     */
    function initPageTransitions() {
        // Only apply if page transition API is supported or we're using a router
        const links = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');
        
        if (links.length === 0) return;
        
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.classList.add('page-transition-overlay');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'var(--bg-primary)';
        overlay.style.zIndex = '9999';
        overlay.style.transform = 'translateY(100%)';
        overlay.style.transition = `transform ${config.pageTransitions.duration}ms ${config.pageTransitions.easing}`;
        document.body.appendChild(overlay);
        
        // Handle link clicks
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Skip if modifier keys are pressed
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                
                const href = link.getAttribute('href');
                
                // Skip anchor links and external links
                if (href.startsWith('#') || href.includes('://')) return;
                
                e.preventDefault();
                
                // Run transition animation
                overlay.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    window.location.href = href;
                }, config.pageTransitions.duration * 0.8);
            });
        });
        
        // Add page entry animation
        window.addEventListener('pageshow', () => {
            overlay.style.transform = 'translateY(-100%)';
            
            setTimeout(() => {
                overlay.style.transform = 'translateY(100%)';
            }, config.pageTransitions.duration);
        });
    }
    
    /**
     * NEW: Initialize text scramble effect
     */
    function initTextScrambleEffect() {
        const elements = document.querySelectorAll('.scramble-text');
        if (elements.length === 0) return;
        
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[]|;:,.<>?';
        
        elements.forEach(element => {
            const originalText = element.textContent;
            const duration = parseInt(element.dataset.duration) || 2000;
            const trigger = element.dataset.trigger || 'hover';
            
            function scramble(ratio) {
                let result = '';
                const length = originalText.length;
                
                for (let i = 0; i < length; i++) {
                    if (originalText[i] === ' ') {
                        result += ' ';
                        continue;
                    }
                    
                    const thresholdForChar = (i + 1) / length;
                    
                    if (ratio >= thresholdForChar) {
                        result += originalText[i];
                    } else {
                        result += characters.charAt(Math.floor(Math.random() * characters.length));
                    }
                }
                
                element.textContent = result;
            }
            
            if (trigger === 'hover') {
                element.addEventListener('mouseenter', () => {
                    let startTime = null;
                    
                    function animate(timestamp) {
                        if (!startTime) startTime = timestamp;
                        
                        const elapsed = timestamp - startTime;
                        const ratio = Math.min(elapsed / duration, 1);
                        
                        scramble(ratio);
                        
                        if (ratio < 1) {
                            requestAnimationFrame(animate);
                        }
                    }
                    
                    requestAnimationFrame(animate);
                });
            } else if (trigger === 'scroll') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            let startTime = null;
                            
                            function animate(timestamp) {
                                if (!startTime) startTime = timestamp;
                                
                                const elapsed = timestamp - startTime;
                                const ratio = Math.min(elapsed / duration, 1);
                                
                                scramble(ratio);
                                
                                if (ratio < 1) {
                                    requestAnimationFrame(animate);
                                }
                            }
                            
                            requestAnimationFrame(animate);
                            observer.unobserve(element);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(element);
            }
        });
    }
    
    /**
     * NEW: Initialize magnetic elements
     */
    function initMagneticElements() {
        const elements = document.querySelectorAll('.magnetic-element');
        if (elements.length === 0) return;
        
        elements.forEach(element => {
            const strength = parseFloat(element.dataset.magneticStrength) || 0.5;
            const distance = parseInt(element.dataset.magneticDistance) || 100;
            const maxMovement = parseInt(element.dataset.magneticMax) || 40;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const distanceX = e.clientX - centerX;
                const distanceY = e.clientY - centerY;
                const distanceFromCenter = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                if (distanceFromCenter < distance) {
                    const moveX = (distanceX / distance) * maxMovement * strength;
                    const moveY = (distanceY / distance) * maxMovement * strength;
                    
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
                element.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
                
                setTimeout(() => {
                    element.style.transition = '';
                }, 500);
            });
        });
    }
    
    /**
     * NEW: Initialize dynamic backgrounds
     */
    function initDynamicBackground() {
        const elements = document.querySelectorAll('.dynamic-background');
        if (elements.length === 0) return;
        
        elements.forEach(element => {
            const canvas = document.createElement('canvas');
            canvas.classList.add('dynamic-background-canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1';
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            let animationFrame;
            let width, height;
            let time = 0;
            
            function resizeCanvas() {
                width = element.offsetWidth;
                height = element.offsetHeight;
                canvas.width = width;
                canvas.height = height;
            }
            
            function drawBackground() {
                time += config.dynamicBackground.speed;
                
                ctx.clearRect(0, 0, width, height);
                
                // Complex gradient with multiple colors
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                
                if (config.dynamicBackground.colorShift) {
                    const hue1 = (time * 10) % 360;
                    const hue2 = (hue1 + 60) % 360;
                    const hue3 = (hue1 + 180) % 360;
                    
                    gradient.addColorStop(0, `hsla(${hue1}, 80%, 60%, 0.2)`);
                    gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 60%, 0.1)`);
                    gradient.addColorStop(1, `hsla(${hue3}, 80%, 60%, 0.2)`);
                } else {
                    gradient.addColorStop(0, 'rgba(108, 99, 255, 0.1)');
                    gradient.addColorStop(0.5, 'rgba(0, 224, 255, 0.1)');
                    gradient.addColorStop(1, 'rgba(255, 107, 107, 0.1)');
                }
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
                
                // Draw animated wave patterns
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    
                    const amplitude = height * 0.1;
                    const frequency = 0.01;
                    const speed = time * (0.2 + i * 0.1);
                    
                    ctx.moveTo(0, height / 2);
                    
                    for (let x = 0; x < width; x += 5) {
                        const y = Math.sin(x * frequency + speed) * amplitude + height / 2;
                        ctx.lineTo(x, y);
                    }
                    
                    ctx.lineTo(width, height);
                    ctx.lineTo(0, height);
                    ctx.closePath();
                    
                    const waveGradient = ctx.createLinearGradient(0, 0, width, height);
                    waveGradient.addColorStop(0, `rgba(108, 99, 255, ${0.05 - i * 0.01})`);
                    waveGradient.addColorStop(1, `rgba(0, 224, 255, ${0.05 - i * 0.01})`);
                    
                    ctx.fillStyle = waveGradient;
                    ctx.fill();
                }
                
                animationFrame = requestAnimationFrame(drawBackground);
            }
            
            // Initialize with proper sizing
            resizeCanvas();
            drawBackground();
            
            // Handle resize
            window.addEventListener('resize', debounce(resizeCanvas, 200));
            
            // Cleanup
            return function cleanup() {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
            };
        });
    }
    
    /**
     * NEW: Initialize hover reveal effect
     */
    function initHoverRevealEffect() {
        const elements = document.querySelectorAll('.hover-reveal');
        if (elements.length === 0) return;
        
        elements.forEach(element => {
            const image = element.querySelector('.hover-reveal-image');
            if (!image) return;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Make image follow cursor with slight delay
                image.style.transform = `translate(${mouseX - image.offsetWidth / 2}px, ${mouseY - image.offsetHeight / 2}px)`;
                image.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', () => {
                image.style.opacity = '0';
            });
        });
    }
    
    /**
     * Utility: Debounce function to limit frequent calls
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
})();