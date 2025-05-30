/**
 * Advanced Portfolio Enhancements
 * Handles scroll indicators, section particles, and advanced interactions
 */

class AdvancedEnhancements {    constructor() {
        this.scrollIndicators = document.querySelectorAll('.scroll-dot');
        this.sections = document.querySelectorAll('section[id]');
        this.sectionParticles = new Map();
        this.activeSection = 'home';
        this.scrollProgressBar = document.querySelector('.scroll-progress-bar');
        
        this.init();
    }
    
    init() {
        this.setupScrollIndicators();
        this.setupSectionParticles();
        this.setupProgressCounters();
        this.setupAdvancedScrollEffects();
        this.setupTypingEffects();
        this.setupEnhancedAnimations();
    }
    
    // Scroll Indicators Management
    setupScrollIndicators() {
        // Handle scroll indicator clicks
        this.scrollIndicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                const section = document.getElementById(target);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Update active indicator on scroll
        this.setupScrollWatcher();
    }
    
    setupScrollWatcher() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    this.updateActiveIndicator(sectionId);
                }
            });
        }, {
            threshold: [0.5],
            rootMargin: '-50px 0px -50px 0px'
        });
        
        this.sections.forEach(section => observer.observe(section));
    }
    
    updateActiveIndicator(sectionId) {
        this.activeSection = sectionId;
        
        this.scrollIndicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.dataset.target === sectionId) {
                indicator.classList.add('active');
            }
        });
    }
    
    // Section Particles System
    setupSectionParticles() {
        const particleCanvases = document.querySelectorAll('.section-particles');
        
        particleCanvases.forEach(canvas => {
            const section = canvas.dataset.section;
            this.createSectionParticles(canvas, section);
        });
    }
    
    createSectionParticles(canvas, sectionType) {
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create particles based on section type
        const particleConfig = this.getParticleConfig(sectionType);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * particleConfig.speed,
                vy: (Math.random() - 0.5) * particleConfig.speed,
                size: Math.random() * particleConfig.maxSize + 1,
                color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
                opacity: Math.random() * 0.5 + 0.1
            });
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Keep within bounds
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        this.sectionParticles.set(sectionType, { canvas, ctx, particles });
    }
    
    getParticleConfig(sectionType) {
        const configs = {
            about: {
                colors: ['rgba(103, 126, 234, 0.6)', 'rgba(170, 170, 170, 0.6)', 'rgba(45, 212, 191, 0.6)'],
                speed: 0.5,
                maxSize: 3
            },
            skills: {
                colors: ['rgba(255, 193, 7, 0.6)', 'rgba(103, 126, 234, 0.6)', 'rgba(40, 167, 69, 0.6)'],
                speed: 0.8,
                maxSize: 4
            },
            default: {
                colors: ['rgba(103, 126, 234, 0.4)', 'rgba(170, 170, 170, 0.4)'],
                speed: 0.3,
                maxSize: 2
            }
        };
        
        return configs[sectionType] || configs.default;
    }
    
    // Enhanced Progress Counters
    setupProgressCounters() {
        const progressBars = document.querySelectorAll('.skill-bar[data-progress]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgress(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
    
    animateProgress(progressBar) {
        const targetProgress = parseInt(progressBar.dataset.progress);
        const progressElement = progressBar.querySelector('.skill-progress');
        const counter = progressBar.querySelector('.progress-counter');
        
        let currentProgress = 0;
        const increment = targetProgress / 100;
        
        const timer = setInterval(() => {
            currentProgress += increment;
            
            if (currentProgress >= targetProgress) {
                currentProgress = targetProgress;
                clearInterval(timer);
            }
            
            progressElement.style.width = `${currentProgress}%`;
            if (counter) {
                counter.textContent = `${Math.round(currentProgress)}%`;
            }
        }, 20);
    }
    
    // Advanced Scroll Effects
    setupAdvancedScrollEffects() {
        let ticking = false;
          const updateScrollEffects = () => {
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            // Update scroll progress bar
            if (this.scrollProgressBar) {
                this.scrollProgressBar.style.width = `${scrollPercent}%`;
            }
            
            // Update CSS custom property for scroll-based animations
            document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
            
            // Parallax effects for hero elements
            const hero = document.querySelector('.hero');
            if (hero) {
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent && scrollTop < window.innerHeight) {
                    const translateY = scrollTop * 0.5;
                    heroContent.style.transform = `translateY(${translateY}px)`;
                }
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Enhanced Typing Effects
    setupTypingEffects() {
        const typingElements = document.querySelectorAll('.typing-effect');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startTypingAnimation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        typingElements.forEach(element => observer.observe(element));
    }
    
    startTypingAnimation(element) {
        const text = element.textContent;
        const speed = 50;
        let index = 0;
        
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        const typeWriter = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        typeWriter();
    }
    
    // Enhanced Animations
    setupEnhancedAnimations() {
        // Add floating animation to sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            if (index % 2 === 0) { // Every other section
                section.classList.add('floating-section');
                section.style.animationDelay = `${index * 0.5}s`;
            }
        });
        
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.enhanceButtonHover);
            button.addEventListener('mouseleave', this.resetButtonHover);
        });
        
        // Dynamic gradient background
        this.setupDynamicBackground();
    }
    
    enhanceButtonHover(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--mouse-x', `${x}px`);
        button.style.setProperty('--mouse-y', `${y}px`);
        
        button.style.background = `radial-gradient(circle at var(--mouse-x) var(--mouse-y), 
            var(--primary-color), var(--secondary-color))`;
    }
    
    resetButtonHover(e) {
        const button = e.target;
        button.style.background = '';
    }
    
    setupDynamicBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 100;
            mouseY = (e.clientY / window.innerHeight) * 100;
            
            hero.style.background = `radial-gradient(circle at ${mouseX}% ${mouseY}%, 
                rgba(103, 126, 234, 0.1) 0%, 
                rgba(45, 212, 191, 0.05) 50%, 
                transparent 100%)`;
        });
    }
    
    // Performance optimizations
    destroy() {
        this.sectionParticles.clear();
        window.removeEventListener('scroll', this.requestTick);
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.advancedEnhancements = new AdvancedEnhancements();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is visible
        document.body.style.animationPlayState = 'running';
    }
});
