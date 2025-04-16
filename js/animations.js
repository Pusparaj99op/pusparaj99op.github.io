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
        perspective: initPerspectiveEffects
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
        }
    };
    
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
        initParticleSystem();
        initParallaxEffects();
        initScrollReveal();
        initMorphingEffects();
        initPerspectiveEffects();
        initProjectItemEffects();
        
        // Add general page animations
        addPageAnimations();
        
        console.log('✨ Advanced animations initialized');
    }
    
    /**
     * Check if device is high-end enough for advanced animations
     * @returns {boolean} True if device is capable of advanced animations
     */
    function isHighEndDevice() {
        // Check for hardware concurrency (CPU cores)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) {
            return true;
        }
        
        // If we can't detect hardware specs, use rough heuristics
        const isHighResDpi = window.devicePixelRatio >= 2;
        const isRecentBrowser = 'IntersectionObserver' in window && 'requestIdleCallback' in window;
        
        return isHighResDpi && isRecentBrowser;
    }
    
    /**
     * Initialize basic animations for lower-end devices
     */
    function initBasicAnimations() {
        // Simple fade-in animations using Intersection Observer
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, [data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
        
        console.log('🎭 Basic animations initialized for performance');
    }
    
    /**
     * Initialize advanced particle system for backgrounds
     */
    function initParticleSystem() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        let canvas = document.getElementById('particles-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'particles-canvas';
            heroSection.appendChild(canvas);
            
            // Style canvas
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0';
            canvas.style.pointerEvents = 'none';
        }
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width, height;
        let animationFrame;
        
        // Set canvas size
        function resizeCanvas() {
            width = heroSection.offsetWidth;
            height = heroSection.offsetHeight;
            
            canvas.width = width;
            canvas.height = height;
        }
        
        // Create particles
        function createParticles() {
            particles = [];
            const particleCount = Math.min(Math.floor(width / 20), config.particles.count);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * config.particles.speed,
                    speedY: (Math.random() - 0.5) * config.particles.speed,
                    opacity: Math.random() * 0.5 + 0.2,
                    hue: Math.random() * 60 - 30 // Hue variation around the base color
                });
            }
        }
        
        // Draw particles
        function drawParticles() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connections between particles
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < config.particles.connectionDistance) {
                        const opacity = (1 - distance / config.particles.connectionDistance) * 0.2;
                        ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                    }
                }
            }
            ctx.stroke();
            
            // Draw particles
            particles.forEach(particle => {
                // Calculate color based on base color + particle hue variation
                const baseHue = 251; // Base color in HSL (purple)
                const finalHue = (baseHue + particle.hue + Date.now() * 0.01 % 360) % 360;
                
                // Create gradient for glow effect
                const gradient = ctx.createRadialGradient(
                    particle.x, 
                    particle.y, 
                    0, 
                    particle.x, 
                    particle.y, 
                    particle.radius * 3
                );
                
                gradient.addColorStop(0, `hsla(${finalHue}, 80%, 60%, ${particle.opacity})`);
                gradient.addColorStop(1, `hsla(${finalHue}, 80%, 60%, 0)`);
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // Move particles
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Bounce off walls
                if (particle.x < 0 || particle.x > width) {
                    particle.speedX *= -1;
                }
                
                if (particle.y < 0 || particle.y > height) {
                    particle.speedY *= -1;
                }
            });
            
            animationFrame = requestAnimationFrame(drawParticles);
        }
        
        // Handle mouse interaction
        function handleMouseInteraction() {
            heroSection.addEventListener('mousemove', e => {
                const rect = heroSection.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                particles.forEach(particle => {
                    const dx = mouseX - particle.x;
                    const dy = mouseY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const angle = Math.atan2(dy, dx);
                        const force = 0.5 * (1 - distance / 150);
                        
                        particle.speedX -= Math.cos(angle) * force;
                        particle.speedY -= Math.sin(angle) * force;
                        
                        // Maximum speed limit
                        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                        if (speed > 2) {
                            particle.speedX = (particle.speedX / speed) * 2;
                            particle.speedY = (particle.speedY / speed) * 2;
                        }
                    }
                });
            });
        }
        
        // Initialize particle system
        resizeCanvas();
        createParticles();
        drawParticles();
        handleMouseInteraction();
        
        // Handle resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        
        // Cleanup on page hide/change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrame);
            } else {
                drawParticles();
            }
        });
        
        // Return cleanup function
        return function cleanup() {
            cancelAnimationFrame(animationFrame);
            canvas.remove();
        };
    }
    
    /**
     * Initialize parallax effects for various elements
     */
    function initParallaxEffects() {
        // Sections to apply parallax to
        const sections = [
            { selector: '.hero', intensity: 0.1, elements: ['.hero-content', '.hero-model'] },
            { selector: '.about', intensity: 0.05, elements: ['.about-img', '.about-text'] },
            { selector: '.skills', intensity: 0.03, elements: ['.skills-chart', '.skill-category'] },
            { selector: '.projects', intensity: 0.02, elements: ['.project-item'] },
            { selector: '.achievements', intensity: 0.04, elements: ['.achievement-card'] }
        ];
        
        // Apply parallax to each section
        sections.forEach(section => {
            const sectionElement = document.querySelector(section.selector);
            if (!sectionElement) return;
            
            // Get elements to apply parallax to
            const elements = section.elements.map(selector => {
                return sectionElement.querySelectorAll(selector);
            }).flat();
            
            // Apply parallax
            sectionElement.addEventListener('mousemove', e => {
                const rect = sectionElement.getBoundingClientRect();
                const mouseX = e.clientX - rect.left - rect.width / 2;
                const mouseY = e.clientY - rect.top - rect.height / 2;
                
                elements.forEach((element, index) => {
                    // Vary intensity slightly for each element for depth effect
                    const elementIntensity = section.intensity * (1 + index * 0.1);
                    
                    // Different movement direction for alternating elements
                    const directionX = index % 2 === 0 ? 1 : -1;
                    const directionY = index % 3 === 0 ? 1 : -1;
                    
                    // Apply transform
                    element.style.transform = `translate(${mouseX * elementIntensity * directionX}px, ${mouseY * elementIntensity * directionY}px)`;
                });
            });
            
            // Reset on mouse leave
            sectionElement.addEventListener('mouseleave', () => {
                elements.forEach(element => {
                    element.style.transform = 'translate(0, 0)';
                });
            });
        });
        
        // Background parallax effect
        const blurCircles = document.querySelectorAll('.blur-circle');
        document.addEventListener('mousemove', e => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            blurCircles.forEach((circle, index) => {
                const intensity = 0.02 + (index * 0.01);
                const moveX = (mouseX - 0.5) * 100 * intensity;
                const moveY = (mouseY - 0.5) * 100 * intensity;
                
                circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }
    
    /**
     * Initialize scroll reveal animations with sequential effects
     */
    function initScrollReveal() {
        // Elements to reveal on scroll
        const revealContainers = document.querySelectorAll('section');
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElementsInSection(entry.target);
                }
            });
        }, {
            threshold: config.reveal.threshold,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observe all sections
        revealContainers.forEach(container => {
            observer.observe(container);
        });
        
        // Reveal elements in a section with staggered delay
        function revealElementsInSection(section) {
            // Find elements to reveal
            const revealElements = section.querySelectorAll('.animate-on-scroll:not(.animated)');
            
            // Apply staggered animation
            revealElements.forEach((element, index) => {
                setTimeout(() => {
                    const animation = element.dataset.animation || 'fade-up';
                    element.classList.add('animated', animation);
                }, index * config.reveal.delay);
            });
        }
    }
    
    /**
     * Initialize morphing text and shape effects
     */
    function initMorphingEffects() {
        // Morphing text animations
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach(element => {
            const words = JSON.parse(element.getAttribute('data-words') || '[""]');
            if (!words.length) return;
            
            let currentWordIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;
            
            function type() {
                const currentWord = words[currentWordIndex];
                
                if (isDeleting) {
                    element.textContent = currentWord.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                    typingSpeed = 30;
                } else {
                    element.textContent = currentWord.substring(0, currentCharIndex + 1);
                    currentCharIndex++;
                    typingSpeed = 100;
                }
                
                if (!isDeleting && currentCharIndex === currentWord.length) {
                    isDeleting = true;
                    typingSpeed = 1500; // Pause at end of word
                } else if (isDeleting && currentCharIndex === 0) {
                    isDeleting = false;
                    currentWordIndex = (currentWordIndex + 1) % words.length;
                    typingSpeed = 500; // Pause before starting new word
                }
                
                setTimeout(type, typingSpeed);
            }
            
            type();
        });
        
        // Morphing shapes
        const morphingElements = document.querySelectorAll('.blur-circle');
        
        morphingElements.forEach(element => {
            // Generate random animation parameters
            const animDuration = 15 + Math.random() * 10; // 15-25s
            const delay = Math.random() * 5; // 0-5s
            
            // Apply random animation
            element.style.animation = `morph ${animDuration}s ease-in-out ${delay}s infinite alternate`;
        });
    }
    
    /**
     * Initialize perspective and 3D effects
     */
    function initPerspectiveEffects() {
        // 3D card effect
        const cards = document.querySelectorAll('.card-3d');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                // Add glow effect based on mouse position
                updateGlowEffect(card, x / rect.width, y / rect.height);
                
                // Elevate child elements
                const children = card.querySelectorAll('.card-3d-content');
                children.forEach(child => {
                    child.style.transform = `translateZ(50px)`;
                });
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                
                // Reset glow effect
                card.style.boxShadow = '';
                card.style.background = '';
                
                // Reset child elements
                const children = card.querySelectorAll('.card-3d-content');
                children.forEach(child => {
                    child.style.transform = 'translateZ(0)';
                });
            });
        });
        
        // 3D model viewer controls
        const modelViewer = document.querySelector('model-viewer');
        if (modelViewer) {
            // Make model respond to mouse movement
            const modelContainer = modelViewer.parentElement;
            
            modelContainer.addEventListener('mousemove', e => {
                if (!modelViewer.hasAttribute('auto-rotate')) return;
                
                const rect = modelContainer.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
                
                // Adjust camera orbit based on mouse position
                const currentOrbit = modelViewer.getCameraOrbit();
                const theta = x * 90 + 0; // Rotate based on mouse X position
                
                modelViewer.cameraOrbit = `${theta}deg 75deg 105%`;
            });
        }
    }
    
    /**
     * Update glow effect for 3D cards
     * @param {Element} element - The element to apply the glow effect to
     * @param {number} x - Normalized x position (0-1)
     * @param {number} y - Normalized y position (0-1)
     */
    function updateGlowEffect(element, x, y) {
        // Calculate angle and strength based on mouse position
        const strength = 15;
        
        // Create shadow based on mouse position
        const shadowX = (x - 0.5) * strength;
        const shadowY = (y - 0.5) * strength;
        
        // Apply shadow
        element.style.boxShadow = `
            ${-shadowX}px ${-shadowY}px 20px rgba(108, 99, 255, 0.3),
            0 10px 30px rgba(0, 0, 0, 0.2)
        `;
        
        // Create gradient background based on mouse position
        const gradientX = x * 100;
        const gradientY = y * 100;
        
        // Apply subtle gradient overlay
        element.style.backgroundImage = `
            radial-gradient(
                circle at ${gradientX}% ${gradientY}%, 
                rgba(108, 99, 255, 0.1), 
                transparent 80%
            )
        `;
    }
    
    /**
     * Initialize special effects for project items
     */
    function initProjectItemEffects() {
        const projectItems = document.querySelectorAll('.project-item');
        
        projectItems.forEach(item => {
            // Add tilt effect on hover
            item.addEventListener('mousemove', e => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
            
            // Add flowing background effect
            const projectImg = item.querySelector('.project-img');
            if (projectImg) {
                projectImg.addEventListener('mousemove', e => {
                    const rect = projectImg.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    const img = projectImg.querySelector('img');
                    if (img) {
                        img.style.transform = `scale(1.1) translate(${(x - 0.5) * -10}px, ${(y - 0.5) * -10}px)`;
                    }
                });
                
                projectImg.addEventListener('mouseleave', () => {
                    const img = projectImg.querySelector('img');
                    if (img) {
                        img.style.transform = 'scale(1)';
                    }
                });
            }
        });
        
        // WebGL Effect for special projects
        const webglProjects = document.querySelectorAll('.webgl-project');
        
        // Only initialize if Three.js is available
        if (webglProjects.length > 0 && typeof THREE !== 'undefined') {
            webglProjects.forEach((container, idx) => {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                container.appendChild(renderer.domElement);
                
                // Create geometries based on index for variety
                let geometry, material, mesh;
                
                switch (idx % 3) {
                    case 0: // Sphere
                        geometry = new THREE.SphereGeometry(2, 32, 32);
                        material = new THREE.MeshStandardMaterial({
                            color: 0x6C63FF,
                            wireframe: true,
                            emissive: 0x6C63FF,
                            emissiveIntensity: 0.2
                        });
                        break;
                    case 1: // Torus
                        geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
                        material = new THREE.MeshStandardMaterial({
                            color: 0x00E0FF,
                            wireframe: true,
                            emissive: 0x00E0FF,
                            emissiveIntensity: 0.2
                        });
                        break;
                    case 2: // Icosahedron
                        geometry = new THREE.IcosahedronGeometry(2, 0);
                        material = new THREE.MeshStandardMaterial({
                            color: 0xFF6B6B,
                            wireframe: true,
                            emissive: 0xFF6B6B,
                            emissiveIntensity: 0.2
                        });
                        break;
                }
                
                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                
                // Add lighting
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(0, 0, 5);
                scene.add(light);
                
                const ambientLight = new THREE.AmbientLight(0x404040);
                scene.add(ambientLight);
                
                // Position camera
                camera.position.z = 5;
                
                // Add animation
                function animate() {
                    requestAnimationFrame(animate);
                    
                    mesh.rotation.x += 0.005;
                    mesh.rotation.y += 0.01;
                    
                    renderer.render(scene, camera);
                }
                
                animate();
                
                // Handle resize
                window.addEventListener('resize', () => {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                });
                
                // Interactive control
                container.addEventListener('mousemove', e => {
                    const rect = container.getBoundingClientRect();
                    const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
                    const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
                    
                    // Rotate based on mouse position
                    mesh.rotation.x = mouseY * 0.5;
                    mesh.rotation.y = mouseX * 0.5;
                });
            });
        }
    }
    
    /**
     * Add general page animations
     */
    function addPageAnimations() {
        // Fade in page on load
        document.body.classList.add('loaded');
        
        // Add scroll animations
        document.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Header transform
            const header = document.querySelector('header');
            if (header) {
                const blurAmount = Math.min(scrollPosition / 100, 10);
                if (scrollPosition > 50) {
                    header.style.backdropFilter = `blur(${blurAmount}px)`;
                    header.style.webkitBackdropFilter = `blur(${blurAmount}px)`;
                } else {
                    header.style.backdropFilter = '';
                    header.style.webkitBackdropFilter = '';
                }
            }
            
            // Parallax scroll for sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionCenter = sectionTop + sectionHeight / 2;
                
                // Calculate distance from center of viewport
                const distanceFromCenter = (sectionCenter - (scrollPosition + windowHeight / 2)) / windowHeight;
                
                // Apply transform based on distance from center
                section.style.transform = `translateY(${distanceFromCenter * 20}px)`;
                section.style.opacity = 1 - Math.min(Math.abs(distanceFromCenter * 0.5), 0.2);
            });
        });
        
        // Add cursor effects
        if (!('ontouchstart' in window)) { // Only for non-touch devices
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                // Enhanced cursor animation
                document.addEventListener('mousemove', e => {
                    // Use requestAnimationFrame for better performance
                    requestAnimationFrame(() => {
                        cursor.style.left = `${e.clientX}px`;
                        cursor.style.top = `${e.clientY}px`;
                    });
                });
                
                // Add magnetic pull effect on interactive elements
                const interactiveElements = document.querySelectorAll('a, button, .hover-card');
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursor.classList.add('hover');
                        
                        // Add ripple effect
                        const ripple = document.createElement('div');
                        ripple.classList.add('cursor-ripple');
                        cursor.appendChild(ripple);
                        
                        // Animate and remove ripple
                        setTimeout(() => {
                            ripple.remove();
                        }, 500);
                    });
                    
                    el.addEventListener('mouseleave', () => {
                        cursor.classList.remove('hover');
                    });
                });
            }
        }
    }
    
})();