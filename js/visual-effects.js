/**
 * Visual Effects Library
 * Manages particle systems, glass effects, and other visual enhancements
 */
window.visualEffects = (function() {
    // Track if effects are initialized
    let initialized = false;
    let particlesSystems = [];
    
    // Device capability detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    /**
     * Initialize all visual effects
     */
    function init() {
        if (initialized) return;
        initialized = true;
        
        if (isReducedMotion || (isMobile && hasLowMemory)) {
            // Skip heavy animations for devices with reduced motion or low memory
            console.log('Skipping heavy visual effects due to device capabilities');
            return;
        }
        
        initParticles();
        initGlassEffects();
        initFireEffects();
        initWaterEffects();
        initDustEffects();
        initCustomCursor();
        initBlurCircles();
    }
    
    /**
     * Initialize particle systems
     */
    function initParticles() {
        const particlesContainers = document.querySelectorAll('.particles-enhanced');
        
        if (particlesContainers.length === 0) return;
        
        particlesContainers.forEach(container => {
            // Get options from data attributes
            const options = {
                count: parseInt(container.dataset.particleCount) || 50,
                color: container.dataset.particleColor || '#6C63FF',
                opacity: parseFloat(container.dataset.particleOpacity) || 0.5,
                size: parseInt(container.dataset.particleSize) || 3,
                speed: parseFloat(container.dataset.particleSpeed) || 1,
                connectParticles: container.dataset.particleConnect === 'true',
                maxConnections: parseInt(container.dataset.particleMaxConnections) || 3
            };
            
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.className = 'particles-canvas';
            container.appendChild(canvas);
            
            // Initialize particle system
            const system = new ParticleSystem(canvas, options);
            system.init();
            particlesSystems.push(system);
        });
    }
    
    /**
     * Initialize glass effects (backdrop-filter and animations)
     */
    function initGlassEffects() {
        const glassElements = document.querySelectorAll('.glass-effect, .glass-effect-dark, .glass-card');
        
        if (glassElements.length === 0) return;
        
        // Add mouse movement effect to glass elements
        glassElements.forEach(element => {
            element.addEventListener('mousemove', e => {
                if (isMobile) return; // Skip on mobile
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate the position relative to the center
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate the gradient position
                const gradientX = Math.round((x / rect.width) * 100);
                const gradientY = Math.round((y / rect.height) * 100);
                
                // Update the glass effect with a subtle gradient
                element.style.background = `
                    linear-gradient(
                        ${gradientX}deg, 
                        rgba(255, 255, 255, 0.15), 
                        rgba(255, 255, 255, 0.05)
                    ), 
                    rgba(255, 255, 255, 0.1)
                `;
                
                // Add subtle shadow movement
                const shadowX = (x - centerX) / 20;
                const shadowY = (y - centerY) / 20;
                element.style.boxShadow = `
                    ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.15),
                    0 8px 32px rgba(0, 0, 0, 0.2)
                `;
            });
            
            // Reset on mouse leave
            element.addEventListener('mouseleave', () => {
                element.style.background = '';
                element.style.boxShadow = '';
            });
        });
    }
    
    /**
     * Initialize fire effects
     */
    function initFireEffects() {
        const fireContainers = document.querySelectorAll('.fire-container');
        
        if (fireContainers.length === 0) return;
        
        fireContainers.forEach(container => {
            const flamesContainer = document.createElement('div');
            flamesContainer.className = 'flames';
            
            // Create flames
            const flameCount = parseInt(container.dataset.flameCount) || 12;
            
            for (let i = 0; i < flameCount; i++) {
                const flame = document.createElement('div');
                flame.className = 'flame';
                
                // Randomize flame properties
                const width = 20 + Math.random() * 30;
                const height = 60 + Math.random() * 40;
                const left = Math.random() * 100;
                const hue = Math.round(10 + Math.random() * 40); // Orange-red hues
                
                flame.style.width = `${width}px`;
                flame.style.height = `${height}px`;
                flame.style.left = `${left}%`;
                flame.style.background = `hsl(${hue}, 100%, 50%)`;
                flame.style.boxShadow = `0 0 ${width/2}px hsl(${hue}, 100%, 60%)`;
                
                flamesContainer.appendChild(flame);
            }
            
            container.appendChild(flamesContainer);
        });
    }
    
    /**
     * Initialize water/liquid effects
     */
    function initWaterEffects() {
        const waterElements = document.querySelectorAll('.water-ripple');
        
        if (waterElements.length === 0) return;
        
        waterElements.forEach(element => {
            element.addEventListener('mousemove', e => {
                if (isMobile) return; // Skip on mobile
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Create a ripple element
                const ripple = document.createElement('div');
                ripple.className = 'water-ripple-effect';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                element.appendChild(ripple);
                
                // Remove the ripple after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 1500);
            });
            
            // Add CSS for the ripple effect if not already in stylesheet
            if (!document.querySelector('#water-ripple-style')) {
                const style = document.createElement('style');
                style.id = 'water-ripple-style';
                style.textContent = `
                    .water-ripple {
                        position: relative;
                        overflow: hidden;
                    }
                    .water-ripple-effect {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.2);
                        transform: scale(0);
                        animation: ripple-animation 1.5s linear;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
    
    /**
     * Initialize dust/particle floating effects
     */
    function initDustEffects() {
        const dustContainers = document.querySelectorAll('.dust-container');
        
        if (dustContainers.length === 0) return;
        
        dustContainers.forEach(container => {
            const particleCount = parseInt(container.dataset.dustCount) || 20;
            
            // Create dust particles
            for (let i = 0; i < particleCount; i++) {
                const dust = document.createElement('div');
                dust.className = 'dust-particle';
                
                // Randomize properties
                const size = 1 + Math.random() * 3;
                const posX = Math.random() * 100;
                const delay = Math.random() * 10;
                const duration = 7 + Math.random() * 7;
                const opacity = 0.1 + Math.random() * 0.4;
                
                dust.style.width = `${size}px`;
                dust.style.height = `${size}px`;
                dust.style.left = `${posX}%`;
                dust.style.opacity = opacity;
                dust.style.animationDelay = `${delay}s`;
                dust.style.animationDuration = `${duration}s`;
                
                container.appendChild(dust);
            }
        });
    }
    
    /**
     * Initialize custom cursor effect
     */
    function initCustomCursor() {
        if (isMobile) return; // Skip on mobile devices
        
        const cursorEnabled = document.body.dataset.customCursor === 'true';
        if (!cursorEnabled) return;
        
        // Create the cursor elements if they don't exist
        let cursor = document.querySelector('.custom-cursor');
        
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            cursor.appendChild(dot);
            document.body.appendChild(cursor);
        }
        
        // Throttle function to limit the rate of mousemove updates
        let lastExecution = 0;
        const throttleTime = 10; // ms

        // Update cursor position on mouse move using transform for better performance
        document.addEventListener('mousemove', e => {
            const now = Date.now();
            if (now - lastExecution < throttleTime) return;
            lastExecution = now;
            
            // Use transform instead of left/top for better performance
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            cursor.classList.add('active');
        });
        
        // Hide cursor when it leaves the window
        document.addEventListener('mouseout', (e) => {
            // Check if the mouse has actually left the window
            if (e.relatedTarget === null) {
                cursor.classList.remove('active');
            }
        });
        
        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .card-3d, input, textarea, .project-item, .social-icon');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
    
    /**
     * Initialize blur circle backgrounds
     */
    function initBlurCircles() {
        const containers = document.querySelectorAll('.blur-circle-container');
        
        if (containers.length === 0) return;
        
        containers.forEach(container => {
            const circleCount = parseInt(container.dataset.blurCircleCount) || 3;
            
            for (let i = 0; i < circleCount; i++) {
                const circle = document.createElement('div');
                circle.className = 'blur-circle';
                
                // Randomize properties
                const size = 150 + Math.random() * 200;
                const posX = Math.random() * 80 + 10;
                const posY = Math.random() * 80 + 10;
                const delay = Math.random() * 5;
                const hue = Math.random() * 360;
                
                circle.style.width = `${size}px`;
                circle.style.height = `${size}px`;
                circle.style.left = `${posX}%`;
                circle.style.top = `${posY}%`;
                circle.style.animationDelay = `${delay}s`;
                circle.style.background = `hsla(${hue}, 70%, 60%, 0.3)`;
                
                container.appendChild(circle);
            }
        });
    }
    
    /**
     * Activate all visual effects at once
     */
    function activateAll() {
        init();
    }
    
    /**
     * Particle System class for creating and managing particle animations
     */
    class ParticleSystem {
        constructor(canvas, options) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.options = Object.assign({
                count: 50,
                color: '#6C63FF',
                opacity: 0.5,
                size: 3,
                speed: 1,
                connectParticles: true,
                maxConnections: 3
            }, options);
            
            this.particles = [];
            this.animationFrame = null;
            this.isRunning = false;
        }
        
        init() {
            // Set canvas size
            this.resizeCanvas();
            
            // Create particles
            this.createParticles();
            
            // Start animation
            this.animate();
            
            // Handle window resize
            window.addEventListener('resize', () => this.resizeCanvas());
            
            // Track visibility for performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stop();
                } else {
                    this.start();
                }
            });
        }
        
        resizeCanvas() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
            
            // Recreate particles when canvas size changes
            if (this.particles.length > 0) {
                this.particles = [];
                this.createParticles();
            }
        }
        
        createParticles() {
            const { count, color, opacity, size, speed } = this.options;
            
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    size: Math.random() * size + 1,
                    color: color,
                    opacity: Math.random() * opacity + (opacity / 2)
                });
            }
        }
        
        animate() {
            this.isRunning = true;
            this.draw();
            this.update();
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
        
        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw particles
            this.particles.forEach(p => {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
                this.ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba');
                this.ctx.fill();
            });
            
            // Draw connections between particles
            if (this.options.connectParticles) {
                this.drawConnections();
            }
        }
        
        drawConnections() {
            const { maxConnections } = this.options;
            
            this.particles.forEach((p1, i) => {
                // Find closest particles to connect with
                const connections = this.particles
                    .slice(i + 1)
                    .map(p2 => {
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        return { p2, distance };
                    })
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, maxConnections);
                
                connections.forEach(({ p2, distance }) => {
                    // Only connect particles that are close enough
                    if (distance < 100) {
                        const opacity = 1 - (distance / 100);
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(108, 99, 255, ${opacity * 0.5})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                });
            });
        }
        
        update() {
            this.particles.forEach(p => {
                // Move particles
                p.x += p.vx;
                p.y += p.vy;
                
                // Bounce off edges
                if (p.x < 0 || p.x > this.canvas.width) {
                    p.vx = -p.vx;
                }
                
                if (p.y < 0 || p.y > this.canvas.height) {
                    p.vy = -p.vy;
                }
            });
        }
        
        stop() {
            if (this.isRunning) {
                this.isRunning = false;
                cancelAnimationFrame(this.animationFrame);
            }
        }
        
        start() {
            if (!this.isRunning) {
                this.animate();
            }
        }
        
        destroy() {
            this.stop();
            this.particles = [];
            this.canvas.remove();
        }
    }
    
    // Public API
    return {
        init,
        activateAll,
        initParticles,
        initGlassEffects,
        initFireEffects,
        initWaterEffects,
        initDustEffects,
        initCustomCursor,
        initBlurCircles
    };
})();
