/**
 * Modern Effects and Enhanced Animations
 * Inspired by hackathon.dev and modern web design trends
 */

class ModernEffects {
    constructor() {
        this.scrollAnimations = new Map();
        this.parallaxElements = [];
        this.observerOptions = {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            rootMargin: '-50px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupScrollReveal();
        this.setupParallaxEffects();
        this.setupModernHovers();
        this.setupGradientAnimations();
        this.setupProgressAnimations();
        this.setupMouseFollower();
        this.setupFloatingElements();
    }
    
    /**
     * Enhanced Scroll Reveal Animations
     */
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal, .animate-on-scroll');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Add stagger effect for child elements
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100);
                    });
                }
            });
        }, this.observerOptions);
        
        revealElements.forEach(el => {
            el.classList.add('scroll-reveal');
            revealObserver.observe(el);
        });
    }
    
    /**
     * Parallax Effects for Modern Feel
     */
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element, .blur-circle');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.3;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }
    
    /**
     * Modern Hover Effects with 3D Transformations
     */
    setupModernHovers() {
        const hoverElements = document.querySelectorAll('.modern-hover, .glass-effect, .project-card');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });
            
            element.addEventListener('mousemove', (e) => {
                this.update3DRotation(element, e);
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    
    /**
     * Create Ripple Effect on Hover
     */
    createRippleEffect(event) {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.classList.add('ripple-effect');
        ripple.style.left = (event.clientX - rect.left) + 'px';
        ripple.style.top = (event.clientY - rect.top) + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    /**
     * Update 3D Rotation Based on Mouse Position
     */
    update3DRotation(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        element.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(10px)
        `;
    }
    
    /**
     * Animated Gradient Backgrounds
     */
    setupGradientAnimations() {
        const gradientElements = document.querySelectorAll('.gradient-animated');
        
        gradientElements.forEach(element => {
            this.animateGradient(element);
        });
    }
    
    animateGradient(element) {
        let angle = 0;
        
        const animate = () => {
            angle += 1;
            element.style.background = `
                linear-gradient(
                    ${angle}deg,
                    #667eea,
                    #764ba2,
                    #f093fb,
                    #667eea
                )
            `;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Progress Bar Animations
     */
    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-modern');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target;
                    const targetWidth = progress.dataset.progress || '0%';
                    
                    setTimeout(() => {
                        progress.style.setProperty('--progress-width', targetWidth);
                    }, 500);
                }
            });
        });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }
    
    /**
     * Mouse Follower Effect
     */
    setupMouseFollower() {
        const follower = document.createElement('div');
        follower.classList.add('mouse-follower');
        document.body.appendChild(follower);
        
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            follower.style.transform = `translate(${followerX - 10}px, ${followerY - 10}px)`;
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();
    }
    
    /**
     * Enhanced Floating Elements
     */
    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-enhanced');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 200;
            const duration = 3000 + (index * 500);
            
            element.style.animationDelay = `${delay}ms`;
            element.style.animationDuration = `${duration}ms`;
        });
    }
    
    /**
     * Create Magnetic Effect on Buttons
     */
    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn, .theme-toggle');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    /**
     * Dynamic Background Patterns
     */
    createDynamicBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const canvas = document.createElement('canvas');
        canvas.classList.add('dynamic-bg');
        hero.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let animationId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const drawPattern = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const time = Date.now() * 0.002;
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width / 2
            );
            
            gradient.addColorStop(0, `hsla(${240 + Math.sin(time) * 30}, 70%, 60%, 0.1)`);
            gradient.addColorStop(1, `hsla(${300 + Math.cos(time) * 30}, 70%, 60%, 0.05)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            animationId = requestAnimationFrame(drawPattern);
        };
        
        resizeCanvas();
        drawPattern();
        
        window.addEventListener('resize', resizeCanvas);
    }
}

// Add CSS for new effects
const modernEffectsCSS = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 10;
    }
    
    @keyframes ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            opacity: 0;
        }
    }
    
    .mouse-follower {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.6), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transition: transform 0.1s ease-out;
    }
    
    .dynamic-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }
    
    .progress-modern::before {
        width: var(--progress-width, 0%);
    }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = modernEffectsCSS;
document.head.appendChild(styleSheet);

// Initialize Modern Effects
document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        new ModernEffects();
    }
});

// Export for use in other modules
window.ModernEffects = ModernEffects;
