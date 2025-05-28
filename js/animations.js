/**
 * Advanced animations management
 */
window.animations = (function() {
    // Track performance
    const perfSensitive = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * Initialize all animations
     */
    function init() {
        initTextAnimations();
        initParallaxEffects();
        initMagneticElements();
        init3dCards();
        initScrollAnimations();
        initRevealEffects();
    }
    
    /**
     * Initialize text-based animations like typing and split text
     */
    function initTextAnimations() {
        // Typing animation
        const typingElements = document.querySelectorAll('.typing-text');
        typingElements.forEach(element => {
            const text = element.dataset.text || element.textContent;
            const typingDelay = parseInt(element.dataset.delay || 100);
            
            if (!element.dataset.initialized) {
                element.dataset.initialized = 'true';
                typeText(element, text, typingDelay);
            }
        });
        
        // Text scramble effect
        const scrambleElements = document.querySelectorAll('.scramble-text');
        scrambleElements.forEach(element => {
            if (!element.dataset.initialized) {
                element.dataset.initialized = 'true';
                const scramble = new TextScramble(element);
                scramble.setText(element.textContent);
            }
        });
        
        // Split text animations
        const splitContainers = document.querySelectorAll('.split-text-container');
        splitContainers.forEach(container => {
            if (!container.dataset.initialized) {
                container.dataset.initialized = 'true';
                const text = container.textContent.trim();
                container.innerHTML = '';
                
                text.split(' ').forEach((word, index) => {
                    const wordEl = document.createElement('span');
                    wordEl.className = 'split-text';
                    wordEl.style.transitionDelay = `${0.05 * index}s`;
                    wordEl.textContent = word + ' ';
                    container.appendChild(wordEl);
                });
                
                // Add animation class after a small delay to allow DOM to update
                setTimeout(() => {
                    container.querySelectorAll('.split-text').forEach(el => {
                        el.classList.add('animated');
                    });
                }, 100);
            }
        });
        
        // Floating characters animation
        const floatingContainers = document.querySelectorAll('[data-floating-text]');
        floatingContainers.forEach(container => {
            if (!container.dataset.initialized) {
                container.dataset.initialized = 'true';
                const text = container.textContent.trim();
                container.innerHTML = '';
                
                [...text].forEach((char, index) => {
                    const span = document.createElement('span');
                    span.className = 'floating-character';
                    span.textContent = char;
                    span.style.animationDelay = `${0.1 * index}s`;
                    container.appendChild(span);
                });
            }
        });
    }
    
    /**
     * Initialize parallax effects
     */
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        let lastScrollY = window.scrollY;
        
        const updateParallax = () => {
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.1;
                const offsetY = (lastScrollY * speed);
                element.style.transform = `translate3d(0, ${offsetY}px, 0)`;
            });
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            requestTick();
        }, { passive: true });
        
        // Initial position
        updateParallax();
    }
    
    /**
     * Initialize magnetic elements that follow the cursor
     */
    function initMagneticElements() {
        const magneticButtons = document.querySelectorAll('.magnetic-btn');
        const magneticElements = document.querySelectorAll('.magnetic-element');
        const allMagnetic = [...magneticButtons, ...magneticElements];
        
        if (allMagnetic.length === 0) return;
        
        allMagnetic.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = element.dataset.magneticStrength || 0.5;
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }
    
    /**
     * Initialize 3D card effects
     */
    function init3dCards() {
        const cards = document.querySelectorAll('.card-3d');
        
        cards.forEach(card => {
            const content = card.querySelector('.card-3d-content');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
                
                if (content) {
                    content.style.transform = `translateZ(60px)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateZ(0)`;
                
                if (content) {
                    content.style.transform = `translateZ(0)`;
                }
            });
        });
    }
    
    /**
     * Initialize scroll-based animations
     */
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                } else if (entry.target.dataset.repeat === 'true') {
                    entry.target.classList.remove('animated');
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    /**
     * Initialize image/content reveal effects
     */
    function initRevealEffects() {
        const hoverRevealElements = document.querySelectorAll('.hover-reveal');
        
        hoverRevealElements.forEach(element => {
            const image = element.querySelector('.hover-reveal-image');
            if (!image) return;
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                image.style.opacity = '1';
                image.style.transform = `translate(${mouseX - image.offsetWidth/2}px, ${mouseY - image.offsetHeight/2}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                image.style.opacity = '0';
            });
        });
        
        // Text reveal animations
        const textRevealElements = document.querySelectorAll('.text-reveal');
        textRevealElements.forEach(element => {
            if (!element.dataset.initialized) {
                element.dataset.initialized = 'true';
                
                const text = element.textContent.trim();
                element.innerHTML = '';
                
                [...text].forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;  // Non-breaking space for actual spaces
                    element.appendChild(span);
                });
            }
            
            // Set up observer for this element
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        element.classList.add('revealed');
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(element);
        });
    }
    
    // Text scramble effect helper class
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
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
    
    /**
     * Type text animation
     */
    function typeText(element, text, delay = 100) {
        let currentChar = 0;
        element.textContent = '';
        
        function type() {
            if (currentChar < text.length) {
                element.textContent += text.charAt(currentChar);
                currentChar++;
                setTimeout(type, delay);
            } else if (element.dataset.loop === 'true') {
                setTimeout(() => {
                    element.textContent = '';
                    currentChar = 0;
                    type();
                }, 1500);
            }
        }
        
        type();
    }
    
    /**
     * Helper function to throttle function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Public API
    return {
        init,
        initTextAnimations,
        initParallaxEffects,
        initMagneticElements,
        init3dCards
    };
})();