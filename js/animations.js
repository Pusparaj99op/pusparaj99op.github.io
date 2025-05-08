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
        floatingText: initFloatingTextEffect,
        liquidButton: initLiquidButtonEffect,
        pageTransitions: initPageTransitions,
        textScramble: initTextScrambleEffect,
        magneticElements: initMagneticElements,
        dynamicBackground: initDynamicBackground,
        hoverReveal: initHoverRevealEffect
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
        // Priority for user preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return false;
        }
        
        // Check for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return false;
        }
        
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
     * Initialize all animations with better performance management
     */
    function initAnimations() {
        // Check for animation preferences and device capabilities
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('🔄 Reduced motion preference detected. Using simplified animations.');
            initBasicAnimations();
            return;
        }
        
        // Check device capabilities
        if (window.innerWidth < 768 || !isHighEndDevice()) {
            console.log('🔄 Using optimized animations for this device');
            initBasicAnimations();
            return;
        }
        
        // Initialize animations with IntersectionObserver for better performance
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                
                // Get animation type from data attribute
                const element = entry.target;
                const animationType = element.dataset.animation;
                
                switch (animationType) {
                    case 'particles':
                        initParticleSystem(element);
                        break;
                    case 'parallax':
                        initParallaxEffects([element]);
                        break;
                    case 'perspective':
                        initPerspectiveEffects(element);
                        break;
                    case 'floating-text':
                        initFloatingTextEffect(element);
                        break;
                    case 'liquid-button':
                        initLiquidButtonEffect(element);
                        break;
                    case 'dynamic-bg':
                        initDynamicBackground(element);
                        break;
                    // Default reveal animation handled by CSS
                }
                
                if (!element.dataset.repeat) {
                    animationObserver.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements with animation data attributes
        document.querySelectorAll('[data-animation]').forEach(el => {
            animationObserver.observe(el);
        });
        
        // Always initialize scroll reveal for all animated elements
        initScrollReveal();
        
        // Initialize page transitions
        initPageTransitions();
        
        console.log('✨ Advanced animations initialized with performance optimizations');
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
     * Optimize particle system for better performance
     */
    function initParticleSystem(container = null) {
        const heroSection = container || document.querySelector('.hero');
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
                    color: [
                        `rgba(108, 99, 255, ${Math.random() * 0.5 + 0.2})`,
                        `rgba(0, 224, 255, ${Math.random() * 0.5 + 0.2})`,
                        `rgba(255, 107, 107, ${Math.random() * 0.5 + 0.2})`
                    ][Math.floor(Math.random() * 3)]
                });
            }
        }
        
        // Draw particles
        function drawParticles() {
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX *= -1;
                }
                
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY *= -1;
                }
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
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
        }
        
        // Use requestAnimationFrame more efficiently
        let lastTime = 0;
        const fps = 30; // Limit FPS for better performance
        const fpsInterval = 1000 / fps;
        
        function animate(timestamp) {
            if (!isVisible) {
                animationFrame = requestAnimationFrame(animate);
                return;
            }
            
            const elapsed = timestamp - lastTime;
            
            if (elapsed > fpsInterval) {
                lastTime = timestamp - (elapsed % fpsInterval);
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawParticles();
            }
            
            animationFrame = requestAnimationFrame(animate);
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
                        animationFrame = requestAnimationFrame(animate);
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
        animate(0);
        
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
     * Optimize parallax effects for smoother performance
     */
    function initParallaxEffects(elements = null) {
        const parallaxElements = elements || document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        // Use passive scroll listener for better performance
        let ticking = false;
        let scrollY = window.scrollY;
        
        // Throttle scroll events for better performance
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
                    applyStyles(element, effect, 0);
                    element.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0) ${delay}ms, opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0) ${delay}ms`;
                    
                    requestAnimationFrame(() => {
                        applyStyles(element, effect, 1);
                        element.classList.add('animated');
                    });
                    
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
        
        return function cleanup() {
            observer.disconnect();
        };
    }
    
    /**
     * Utility: Improved debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                timeout = null;
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
})();