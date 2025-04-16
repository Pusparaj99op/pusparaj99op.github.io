/**
 * Mobile-optimizations.js - Special optimizations for mobile devices
 * This module improves performance and experience on mobile devices
 */

(function() {
    'use strict';
    
    // Expose the API
    window.mobileOptimizations = {
        init: initMobileOptimizations
    };
    
    // Device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    /**
     * Initialize all mobile optimizations
     */
    function initMobileOptimizations() {
        if (!isMobile) return; // Only apply to mobile devices
        
        // Apply mobile-specific optimizations
        optimizeAnimations();
        enhanceTouchInteractions();
        improveScrollPerformance();
        createGestureNavigation();
        optimizeFontRendering();
        
        console.log('📱 Mobile optimizations applied');
    }
    
    /**
     * Optimize animations for mobile by reducing complexity
     */
    function optimizeAnimations() {
        // Reduce particles count for performance
        const particlesCanvas = document.getElementById('particles-canvas');
        if (particlesCanvas) {
            particlesCanvas.style.opacity = '0.5'; // Lower opacity for better performance
        }
        
        // Reduce 3D effects intensity
        const card3dElements = document.querySelectorAll('.card-3d');
        card3dElements.forEach(card => {
            // Replace intensive 3D transforms with lighter ones
            card.addEventListener('mousemove', (e) => {
                // Override the intensive 3D effects with a simpler one for mobile
                e.stopPropagation();
                
                // Simple hover effect instead of expensive 3D transform
                card.style.transform = 'scale(1.03)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
        });
        
        // Make magnetic buttons non-magnetic on mobile
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.classList.remove('magnetic-btn');
            btn.classList.add('mobile-btn');
        });
        
        // Simplify WebGL projects on mobile
        const webglProjects = document.querySelectorAll('.webgl-project');
        webglProjects.forEach(container => {
            // Replace WebGL with a static image if possible
            const canvas = container.querySelector('canvas');
            if (canvas) {
                canvas.style.display = 'none';
                
                // Create and add a placeholder image
                const img = document.createElement('img');
                img.src = 'assets/images/webgl-placeholder.jpg';
                img.alt = 'Project Preview';
                img.classList.add('webgl-placeholder');
                
                // Add a note that full 3D is available on desktop
                const note = document.createElement('div');
                note.classList.add('mobile-note');
                note.innerHTML = '<i class="fas fa-desktop"></i> Full 3D available on desktop';
                
                container.appendChild(img);
                container.appendChild(note);
            }
        });
    }
    
    /**
     * Enhance touch interactions for better mobile experience
     */
    function enhanceTouchInteractions() {
        // Add active state to all clickable elements for better touch feedback
        const touchableElements = document.querySelectorAll('a, button, .btn, .project-item, .achievement-card');
        
        touchableElements.forEach(el => {
            el.addEventListener('touchstart', () => {
                el.classList.add('touch-active');
            });
            
            el.addEventListener('touchend', () => {
                setTimeout(() => {
                    el.classList.remove('touch-active');
                }, 100);
            });
            
            el.addEventListener('touchcancel', () => {
                el.classList.remove('touch-active');
            });
        });
        
        // Improve touch target sizes
        const smallTouchTargets = document.querySelectorAll('.social-icon, .nav-icon, .filter-btn');
        smallTouchTargets.forEach(target => {
            target.classList.add('mobile-touch-target');
        });
        
        // Add swipe capability to sliders
        const sliders = document.querySelectorAll('.testimonial-slider');
        addSwipeSupport(sliders);
    }
    
    /**
     * Add swipe support to elements
     * @param {NodeList} elements - Elements to add swipe support to
     */
    function addSwipeSupport(elements) {
        elements.forEach(element => {
            let startX, startY;
            let distX, distY;
            const threshold = 100; // Minimum distance for a swipe
            
            element.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
            }, { passive: true });
            
            element.addEventListener('touchmove', (e) => {
                if (!startX || !startY) return;
                
                const touch = e.touches[0];
                distX = touch.clientX - startX;
                distY = touch.clientY - startY;
                
                // If horizontal swipe is greater than vertical, prevent scrolling
                if (Math.abs(distX) > Math.abs(distY)) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            element.addEventListener('touchend', (e) => {
                if (!startX || !startY) return;
                
                // Check if it's a horizontal swipe
                if (Math.abs(distX) > threshold && Math.abs(distY) < threshold * 0.5) {
                    // Left swipe
                    if (distX < 0) {
                        // Simulate next slide click
                        const nextDot = element.parentElement.querySelector('.testimonial-dot.active').nextElementSibling;
                        if (nextDot) nextDot.click();
                    } 
                    // Right swipe
                    else {
                        // Simulate prev slide click
                        const prevDot = element.parentElement.querySelector('.testimonial-dot.active').previousElementSibling;
                        if (prevDot) prevDot.click();
                    }
                }
                
                // Reset values
                startX = null;
                startY = null;
                distX = null;
                distY = null;
            }, { passive: true });
        });
    }
    
    /**
     * Improve scroll performance by lazy loading and throttling events
     */
    function improveScrollPerformance() {
        // Add lazy loading to images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
        
        // Throttle scroll events
        let scrollTimeout;
        let lastScrollTop = 0;
        
        // Replace intensive scroll listeners with throttled ones
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    // Clear timeout
                    scrollTimeout = null;
                    
                    // Check scroll direction
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const isScrollingDown = scrollTop > lastScrollTop;
                    
                    // Update header visibility based on scroll direction
                    const header = document.querySelector('header');
                    if (header && scrollTop > 200) {
                        if (isScrollingDown) {
                            header.classList.add('mobile-nav-hidden');
                        } else {
                            header.classList.remove('mobile-nav-hidden');
                        }
                    } else if (header) {
                        header.classList.remove('mobile-nav-hidden');
                    }
                    
                    // Update last scroll position
                    lastScrollTop = scrollTop;
                }, 100); // Throttle to 100ms
            }
        }, { passive: true });
        
        // Disable heavy animations while scrolling
        let isScrolling;
        window.addEventListener('scroll', () => {
            document.body.classList.add('is-scrolling');
            
            // Clear timeout if it exists
            if (isScrolling) clearTimeout(isScrolling);
            
            // Set timeout to remove class after scrolling stops
            isScrolling = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 200);
        }, { passive: true });
    }
    
    /**
     * Create mobile gesture navigation
     */
    function createGestureNavigation() {
        // Create swipe navigation for sections
        let touchStartY;
        let touchEndY;
        const minSwipeDistance = 100;
        
        document.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            handleGesture();
        }, { passive: true });
        
        function handleGesture() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('#navbar li a');
            
            // If enough vertical distance has been covered
            if (touchStartY - touchEndY > minSwipeDistance) {
                // Swiped up - go to next section
                navigateToAdjacentSection('next', sections, navLinks);
            } else if (touchEndY - touchStartY > minSwipeDistance) {
                // Swiped down - go to previous section
                navigateToAdjacentSection('prev', sections, navLinks);
            }
        }
        
        // Add double-tap to top
        let lastTap = 0;
        document.addEventListener('touchend', e => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                e.preventDefault();
            }
            
            lastTap = currentTime;
        });
    }
    
    /**
     * Navigate to adjacent section
     * @param {string} direction - 'next' or 'prev'
     * @param {NodeList} sections - All sections in the document
     * @param {NodeList} navLinks - Navigation links
     */
    function navigateToAdjacentSection(direction, sections, navLinks) {
        // Find current section
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        let currentSectionIndex = -1;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionIndex = index;
            }
        });
        
        if (currentSectionIndex === -1) return;
        
        // Calculate target section based on direction
        let targetIndex;
        if (direction === 'next' && currentSectionIndex < sections.length - 1) {
            targetIndex = currentSectionIndex + 1;
        } else if (direction === 'prev' && currentSectionIndex > 0) {
            targetIndex = currentSectionIndex - 1;
        } else {
            return;
        }
        
        // Scroll to the target section
        const targetSection = sections[targetIndex];
        const targetTop = targetSection.offsetTop - 70; // Accounting for header
        
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }
    
    /**
     * Optimize font rendering for mobile
     */
    function optimizeFontRendering() {
        // Add mobile optimized font class
        document.documentElement.classList.add('mobile-optimized-fonts');
        
        // Disable fancy text gradients
        const gradientTexts = document.querySelectorAll('.gradient-text');
        gradientTexts.forEach(text => {
            // Still keep some visual interest, but simpler
            text.classList.remove('gradient-text');
            text.classList.add('mobile-highlight-text');
        });
        
        // Use system fonts for better performance
        document.documentElement.style.setProperty('--mobile-font-override', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif');
    }
})();