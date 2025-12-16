/**
 * Liquid Glass Navigation Effect
 * iOS-inspired translucent, reflective, and layered header
 * Features: GSAP animations, scroll-based corner rounding, dynamic reflections
 */

(function () {
    'use strict';

    // Wait for DOM and GSAP to be ready
    const init = () => {
        const nav = document.getElementById('nav');
        const navContainer = document.querySelector('.nav-container');

        if (!nav || !navContainer) return;

        // Create liquid glass layers
        createLiquidGlassLayers(nav);

        // Initialize GSAP ScrollTrigger
        if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            setupScrollAnimations(nav);
        }

        // Add interactive light effects
        setupInteractiveLighting(nav);

        // Add shimmer/reflection animations
        setupShimmerEffect(nav);
    };

    /**
     * Create layered glass structure for depth
     */
    function createLiquidGlassLayers(nav) {
        // Create background layers container
        const layersContainer = document.createElement('div');
        layersContainer.className = 'liquid-glass-layers';

        // Layer 1: Deep background blur
        const deepLayer = document.createElement('div');
        deepLayer.className = 'liquid-glass-layer liquid-glass-deep';

        // Layer 2: Mid gradient layer
        const midLayer = document.createElement('div');
        midLayer.className = 'liquid-glass-layer liquid-glass-mid';

        // Layer 3: Light reflection layer
        const lightLayer = document.createElement('div');
        lightLayer.className = 'liquid-glass-layer liquid-glass-light';

        // Layer 4: Animated shimmer
        const shimmerLayer = document.createElement('div');
        shimmerLayer.className = 'liquid-glass-shimmer';

        // Add particle effect canvas for extra depth
        const particleCanvas = document.createElement('canvas');
        particleCanvas.className = 'liquid-glass-particles';
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = 100;

        layersContainer.appendChild(deepLayer);
        layersContainer.appendChild(midLayer);
        layersContainer.appendChild(lightLayer);
        layersContainer.appendChild(shimmerLayer);
        layersContainer.appendChild(particleCanvas);

        // Insert at the beginning of nav
        nav.insertBefore(layersContainer, nav.firstChild);

        // Initialize particle animation
        initParticles(particleCanvas);
    }

    /**
     * Setup GSAP scroll-based animations
     */
    function setupScrollAnimations(nav) {
        const navContainer = document.querySelector('.nav-container');

        // Initial state
        gsap.set(nav, {
            borderRadius: '0px'
        });

        // Toggle visibility based on scroll
        ScrollTrigger.create({
            trigger: 'body',
            start: '100px top',
            end: 'bottom bottom',
            toggleClass: { targets: nav, className: 'revealed' }
        });

        // Create a more advanced scroll timeline with elastic effects
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '300px top',
                scrub: 1.2, // Smoother scrubbing
                onUpdate: (self) => {
                    const progress = self.progress;

                    // Update CSS custom property for corner radius with easing
                    const radius = gsap.utils.interpolate(0, 24,
                        gsap.parseEase('power2.out')(progress));
                    nav.style.setProperty('--nav-radius', `${radius}px`);

                    // Update glass intensity
                    nav.style.setProperty('--glass-intensity', progress);

                    // Update shadow depth
                    const shadowDepth = gsap.utils.interpolate(0, 32, progress);
                    nav.style.setProperty('--shadow-depth', `${shadowDepth}px`);
                }
            }
        });

        // Animate corner rounding with elastic effect
        scrollTl.to(nav, {
            borderRadius: '0 0 24px 24px',
            duration: 1,
            ease: 'power3.out'
        }, 0);

        // Animate padding compression
        scrollTl.to(nav, {
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            duration: 1,
            ease: 'power2.inOut'
        }, 0);

        // Enhance glass blur
        scrollTl.to('.liquid-glass-deep', {
            opacity: 0.9,
            duration: 1,
            ease: 'power2.out'
        }, 0);

        // Fade in reflection layer with delay for depth
        scrollTl.to('.liquid-glass-light', {
            opacity: 0.7,
            duration: 1.2,
            ease: 'power2.out'
        }, 0.2);

        // Intensify shimmer on scroll
        scrollTl.to('.liquid-glass-shimmer', {
            opacity: 0.8,
            duration: 1,
            ease: 'power2.inOut'
        }, 0);

        // Staggered micro-animation for nav items
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks.length > 0) {
            gsap.from(navLinks, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '150px top',
                    scrub: 0.8
                },
                y: -5,
                opacity: 0.7,
                stagger: 0.05,
                duration: 0.6,
                ease: 'power2.out'
            });
        }

        // Logo scale animation with bounce
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            gsap.to(logo, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '150px top',
                    scrub: 0.8
                },
                scale: 0.92,
                duration: 0.5,
                ease: 'back.out(1.2)'
            });
        }

        // Theme toggle subtle movement
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            gsap.to(themeToggle, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '150px top',
                    scrub: 0.8
                },
                scale: 0.95,
                duration: 0.4,
                ease: 'power2.out'
            });
        }

        // Add parallax effect to particles
        const particleCanvas = document.querySelector('.liquid-glass-particles');
        if (particleCanvas) {
            gsap.to(particleCanvas, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: '200px top',
                    scrub: 1
                },
                opacity: 0.6,
                duration: 1,
                ease: 'none'
            });
        }
    }

    /**
     * Interactive lighting based on mouse movement
     */
    function setupInteractiveLighting(nav) {
        const lightLayer = document.querySelector('.liquid-glass-light');
        if (!lightLayer) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        nav.addEventListener('mousemove', (e) => {
            const rect = nav.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        });

        // Smooth animation loop for light following
        function animateLight() {
            // Lerp for smooth following
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            lightLayer.style.background = `
                radial-gradient(
                    circle at ${currentX}% ${currentY}%,
                    rgba(10, 228, 72, 0.15) 0%,
                    rgba(10, 228, 72, 0.05) 30%,
                    transparent 60%
                )
            `;

            requestAnimationFrame(animateLight);
        }

        animateLight();

        // Add glow on hover
        nav.addEventListener('mouseenter', () => {
            if (window.gsap) {
                gsap.to(lightLayer, {
                    opacity: 0.8,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });

        nav.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(lightLayer, {
                    opacity: 0.3,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
        });
    }

    /**
     * Animated shimmer effect
     */
    function setupShimmerEffect(nav) {
        const shimmer = document.querySelector('.liquid-glass-shimmer');
        if (!shimmer || !window.gsap) return;

        // Create continuous shimmer animation
        gsap.to(shimmer, {
            backgroundPosition: '200% center',
            duration: 3,
            ease: 'none',
            repeat: -1
        });

        // Random sparkle bursts
        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.className = 'liquid-glass-sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;

            nav.appendChild(sparkle);

            gsap.to(sparkle, {
                scale: 1.5,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                onComplete: () => sparkle.remove()
            });
        }

        // Trigger sparkles periodically
        setInterval(createSparkle, 2000);
    }

    /**
     * Floating particles for depth
     */
    function initParticles(canvas) {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 30;

        // Particle class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(10, 228, 72, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            particles.forEach(p => p.reset());
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
