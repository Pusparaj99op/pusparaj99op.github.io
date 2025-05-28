/**
 * Mobile Optimizations
 * Enhances website performance on mobile devices
 */
window.mobileOptimizations = (function() {
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * Initialize mobile optimizations
     */
    function init() {
        if (!isMobile) return;
        
        optimizeAnimations();
        optimizeImages();
        enhanceTouchInteractions();
        optimizeScrolling();
        addPullToRefresh();
        
        // Apply further optimizations for low-memory devices
        if (lowMemory) {
            applyLowMemoryOptimizations();
        }
    }
    
    /**
     * Optimize animations for mobile devices
     */
    function optimizeAnimations() {
        // Disable or simplify heavy animations on mobile
        document.querySelectorAll('.animation-heavy').forEach(el => {
            el.classList.add('animation-mobile');
        });
        
        // Reduce the number of particles in particle systems
        document.querySelectorAll('[data-particle-count]').forEach(el => {
            // Reduce particle count by 70% on mobile
            const originalCount = parseInt(el.dataset.particleCount) || 50;
            el.dataset.particleCount = Math.max(5, Math.floor(originalCount * 0.3));
        });
        
        // Simplify or disable parallax effects
        document.querySelectorAll('[data-parallax]').forEach(el => {
            el.dataset.parallax = '0';  // Disable parallax
        });
        
        // Disable 3D card effects
        document.querySelectorAll('.card-3d').forEach(el => {
            el.classList.remove('card-3d');
        });
        
        // Simplify hover effects that might cause lag on touch devices
        document.querySelectorAll('.hover-reveal, .hover-card, .glass-effect').forEach(el => {
            el.classList.add('mobile-optimized');
        });
    }
    
    /**
     * Optimize images for mobile devices
     */
    function optimizeImages() {
        if ('loading' in HTMLImageElement.prototype) {
            // Use native lazy loading
            document.querySelectorAll('img').forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }
        
        // Check and swap to mobile optimized images if available
        document.querySelectorAll('img[data-mobile-src]').forEach(img => {
            const mobileSrc = img.dataset.mobileSrc;
            if (mobileSrc) {
                img.src = mobileSrc;
            }
        });
        
        // Optimize image sizes based on viewport
        document.querySelectorAll('img:not(.no-optimize)').forEach(img => {
            if (!img.complete || !img.naturalWidth) {
                // Skip images that haven't loaded
                return;
            }
            
            const containerWidth = img.parentElement.offsetWidth;
            
            // If image is significantly larger than its container, add a size hint
            if (img.naturalWidth > containerWidth * 1.5) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }
    
    /**
     * Enhance touch interactions for better mobile UX
     */
    function enhanceTouchInteractions() {
        // Increase touch target sizes for better accessibility
        document.querySelectorAll('a, button, .btn, .nav-link').forEach(el => {
            if (el.offsetWidth < 44 || el.offsetHeight < 44) {
                el.classList.add('mobile-touch-target');
            }
        });
        
        // Add CSS to improve touch targets if not already in stylesheet
        if (!document.querySelector('#mobile-touch-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-touch-styles';
            style.textContent = `
                .mobile-touch-target {
                    min-height: 44px !important;
                    min-width: 44px !important;
                    padding: 10px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* Improve tap feedback */
                a:active, button:active, .btn:active {
                    opacity: 0.7 !important;
                    transition: opacity 0.1s !important;
                }
                
                /* Optimize mobile hover effects */
                .mobile-optimized {
                    transform: none !important;
                    transition: none !important;
                }
                
                .mobile-optimized:active {
                    transform: scale(0.98) !important;
                    transition: transform 0.2s !important;
                }
                
                /* Optimize animations for mobile */
                .animation-mobile {
                    animation-duration: 50% !important;
                    animation-delay: 0ms !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add active state for touch feedback
        document.querySelectorAll('a, button, .btn').forEach(el => {
            el.addEventListener('touchstart', () => {
                el.classList.add('touch-active');
            }, { passive: true });
            
            el.addEventListener('touchend', () => {
                el.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    /**
     * Optimize scrolling performance on mobile
     */
    function optimizeScrolling() {
        // Use passive event listeners for scroll events
        const scrollElements = document.querySelectorAll('.scroll-container');
        
        scrollElements.forEach(el => {
            el.addEventListener('scroll', handleScroll, { passive: true });
        });
        
        // Main scroll optimization
        window.addEventListener('scroll', () => {
            // Add a "is-scrolling" class to reduce animations during scroll
            if (!document.body.classList.contains('is-scrolling')) {
                document.body.classList.add('is-scrolling');
                
                // Remove the class after scrolling stops
                clearTimeout(window.scrollTimeout);
                window.scrollTimeout = setTimeout(() => {
                    document.body.classList.remove('is-scrolling');
                }, 100);
            }
        }, { passive: true });
        
        function handleScroll() {
            // Placeholder for custom scroll handling if needed
        }
    }
    
    /**
     * Add pull-to-refresh functionality for mobile web apps
     */
    function addPullToRefresh() {
        // Only add if this is configured as a web app
        if (!document.body.dataset.webapp) return;
        
        let touchStart = 0;
        let touchDistance = 0;
        const threshold = 150;
        let isPulling = false;
        
        // Create refresh indicator if it doesn't exist
        let refreshIndicator = document.querySelector('.pull-to-refresh-indicator');
        if (!refreshIndicator) {
            refreshIndicator = document.createElement('div');
            refreshIndicator.className = 'pull-to-refresh-indicator';
            refreshIndicator.innerHTML = '<div class="refresh-spinner"></div><span>Pull to refresh</span>';
            document.body.appendChild(refreshIndicator);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .pull-to-refresh-indicator {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    transform: translateY(-100%);
                    transition: transform 0.3s;
                    z-index: 9999;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .refresh-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid transparent;
                    border-top-color: var(--accent-primary);
                    border-radius: 50%;
                    margin-right: 10px;
                }
                
                .pull-to-refresh-indicator.pulling .refresh-spinner {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add touch event listeners
        document.addEventListener('touchstart', e => {
            // Only enable pull-to-refresh at the top of the page
            if (window.scrollY <= 0) {
                touchStart = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', e => {
            if (!isPulling) return;
            
            touchDistance = e.touches[0].clientY - touchStart;
            
            // Only activate when pulling down
            if (touchDistance > 0) {
                refreshIndicator.style.transform = `translateY(${Math.min(touchDistance * 0.5, threshold)}px)`;
                
                if (touchDistance > threshold) {
                    refreshIndicator.querySelector('span').textContent = 'Release to refresh';
                    refreshIndicator.classList.add('pulling');
                } else {
                    refreshIndicator.querySelector('span').textContent = 'Pull to refresh';
                    refreshIndicator.classList.remove('pulling');
                }
                
                // Prevent default scrolling behavior when pulling
                if (touchDistance > 10) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            if (!isPulling) return;
            isPulling = false;
            
            if (touchDistance > threshold) {
                // Refresh the page
                refreshIndicator.querySelector('span').textContent = 'Refreshing...';
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            } else {
                // Reset
                refreshIndicator.style.transform = 'translateY(-100%)';
            }
            
            touchDistance = 0;
        }, { passive: true });
    }
    
    /**
     * Apply more aggressive optimizations for low memory devices
     */
    function applyLowMemoryOptimizations() {
        // Remove all heavy animations
        document.querySelectorAll('.animation-heavy, .particles-enhanced, .fire-container, .water-ripple').forEach(el => {
            el.classList.add('low-memory-disabled');
        });
        
        // Disable all unnecessary effects
        document.querySelectorAll('.blur-circle').forEach(el => {
            el.style.display = 'none';
        });
        
        // Reduce image quality for better performance
        document.querySelectorAll('img:not(.essential-img)').forEach(img => {
            img.classList.add('low-quality');
        });
        
        // Add style for low memory optimizations
        const style = document.createElement('style');
        style.textContent = `
            .low-memory-disabled {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            
            .low-memory-disabled * {
                animation: none !important;
                transition: none !important;
            }
            
            .low-quality {
                image-rendering: auto;
                filter: brightness(1.05);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Return public API
    return {
        init,
        optimizeAnimations,
        optimizeImages,
        enhanceTouchInteractions,
        optimizeScrolling
    };
})();