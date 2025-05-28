/**
 * Visual Effects Library
 * Provides dynamic visual effects for enhancing website elements
 */

(function() {
    'use strict';
    
    // Expose public API
    window.visualEffects = {
        fire: initFireEffect,
        dust: initDustEffect,
        enhancedParticles: initEnhancedParticles,
        activateAll: activateAllEffects
    };
    
    /**
     * Initialize all effects
     */
    function activateAllEffects() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Reduced motion preference detected, limiting animations');
            return;
        }
        
        // Get all elements with effects
        const fireElements = document.querySelectorAll('.fire-container');
        const dustElements = document.querySelectorAll('.dust-container');
        const particlesElements = document.querySelectorAll('.particles-enhanced');
        
        // Initialize each effect
        fireElements.forEach(element => initFireEffect(element));
        dustElements.forEach(element => initDustEffect(element));
        particlesElements.forEach(element => initEnhancedParticles(element));
        
        // Automatically initialize glass cards for interactivity
        initGlassCardEffects();
        
        console.log('✨ All visual effects initialized');
    }
    
    /**
     * Initialize glass card interactive effects
     */
    function initGlassCardEffects() {
        const glassCards = document.querySelectorAll('.glass-card');
        
        glassCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate rotation based on mouse position
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                // Apply the transformation
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                
                // Apply shine effect
                const shine = document.createElement('div');
                shine.classList.add('card-shine');
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
                
                // Remove any existing shine
                const existingShine = card.querySelector('.card-shine');
                if (existingShine) card.removeChild(existingShine);
                
                card.appendChild(shine);
            });
            
            // Reset card when mouse leaves
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                
                // Remove shine effect
                const shine = card.querySelector('.card-shine');
                if (shine) card.removeChild(shine);
            });
        });
    }
    
    /**
     * Create fire effect in the specified container
     * @param {HTMLElement} container - The container element
     */
    function initFireEffect(container) {
        if (!container) return;
        
        // Create flames
        const flames = document.createElement('div');
        flames.classList.add('flames');
        
        // Add individual flame elements
        const flameCount = 20;
        for (let i = 0; i < flameCount; i++) {
            const flame = document.createElement('div');
            flame.classList.add('flame');
            
            // Calculate random parameters for this flame
            const width = 20 + Math.random() * 30;
            const height = 40 + Math.random() * 60;
            const left = Math.random() * 100;
            const hue = 10 + Math.random() * 30; // orange to red
            
            // Apply styles
            flame.style.width = `${width}px`;
            flame.style.height = `${height}px`;
            flame.style.left = `${left}%`;
            
            // Set different colors for flames
            const saturation = 80 + Math.random() * 20;
            const lightness = 50 + Math.random() * 10;
            flame.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            flame.style.boxShadow = `0 0 10px 5px hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
            
            // Add to flames container
            flames.appendChild(flame);
        }
        
        // Clear container and add flames
        container.appendChild(flames);
        
        // Add light effect to the container
        container.style.boxShadow = 'inset 0 0 50px rgba(255, 100, 20, 0.5), 0 0 30px rgba(255, 100, 20, 0.5)';
        
        return flames;
    }
    
    /**
     * Create dust effect in the specified container
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     */
    function initDustEffect(container, options = {}) {
        if (!container) return;
        
        // Apply default options
        const config = Object.assign({
            particleCount: 30,
            color: 'rgba(255, 255, 255, 0.3)',
            minSize: 1,
            maxSize: 4,
            minDuration: 8,
            maxDuration: 15
        }, options);
        
        // Make sure container has position relative
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        
        // Create dust particles
        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('dust-particle');
            
            // Calculate random parameters
            const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
            const x = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
            const opacity = 0.2 + Math.random() * 0.4;
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.bottom = `-${size}px`;
            particle.style.opacity = opacity.toString();
            particle.style.backgroundColor = config.color;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            // Add some randomness to the movement
            const xMovement = (Math.random() - 0.5) * 50;
            particle.style.animationName = 'float-dust';
            particle.style.animationTimingFunction = 'linear';
            particle.style.animationIterationCount = 'infinite';
            
            // Custom animation
            const keyframes = `
            @keyframes float-dust-${i} {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                20% {
                    opacity: ${opacity};
                }
                80% {
                    opacity: ${opacity};
                }
                100% {
                    transform: translateY(-100px) translateX(${xMovement}px) rotate(360deg);
                    opacity: 0;
                }
            }`;
            
            // Add the keyframes to the document
            const styleSheet = document.createElement('style');
            styleSheet.textContent = keyframes;
            document.head.appendChild(styleSheet);
            
            // Apply the custom animation
            particle.style.animationName = `float-dust-${i}`;
            
            // Add to container
            container.appendChild(particle);
        }
    }
    
    /**
     * Initialize enhanced particles effect
     * @param {HTMLElement} container - The container element
     * @param {Object} options - Configuration options
     */
    function initEnhancedParticles(container, options = {}) {
        if (!container) return;
        
        // Apply default options
        const config = Object.assign({
            particleCount: 50,
            connectionDistance: 150,
            moveSpeed: 1,
            connectParticles: true,
            color: '#6c63ff',
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        particleCount: 30,
                        connectionDistance: 100
                    }
                },
                {
                    breakpoint: 480,
                    options: {
                        particleCount: 15,
                        connectionDistance: 80
                    }
                }
            ]
        }, options);
        
        // Apply responsive settings
        const windowWidth = window.innerWidth;
        for (const item of config.responsive) {
            if (windowWidth <= item.breakpoint) {
                Object.assign(config, item.options);
                break;
            }
        }
        
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.classList.add('particles-canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        
        // Append canvas to container
        container.appendChild(canvas);
        
        // Setup context
        const ctx = canvas.getContext('2d');
        
        // Create particles
        const particles = [];
        
        for (let i = 0; i < config.particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * config.moveSpeed,
                vy: (Math.random() - 0.5) * config.moveSpeed,
                size: 1 + Math.random() * 3,
                color: config.color,
                opacity: 0.2 + Math.random() * 0.3
            });
        }
        
        // Animation function
        function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Move particle
                p.x += p.vx;
                p.y += p.vy;
                
                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
                
                // Draw connections
                if (config.connectParticles) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < config.connectionDistance) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = p.color;
                            ctx.globalAlpha = (1 - distance / config.connectionDistance) * 0.2;
                            ctx.stroke();
                            ctx.globalAlpha = 1;
                        }
                    }
                }
            }
            
            // Request next frame
            requestAnimationFrame(animate);
        }
        
        // Start animation
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        });
    }
    
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            // If automatic initialization is wanted, uncomment the line below
            // activateAllEffects();
        });
    })();
