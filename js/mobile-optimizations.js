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

/**
 * Mobile Optimizations - Enhanced for the new Contact section
 * This module provides performance improvements and better UX for mobile devices
 */

(function() {
    'use strict';

    // Expose the API
    window.mobileOpt = {
        init: initOptimizations,
        checkDevice: checkDeviceCapabilities,
        optimizeImages: optimizeImages,
        adaptiveFeatures: initAdaptiveFeatures,
        preventLag: preventAnimationLag
    };

    // Configuration
    const config = {
        // Define breakpoints for responsive behavior
        breakpoints: {
            small: 480,
            medium: 768,
            large: 992,
            xlarge: 1200
        },
        // Animation optimizations
        animations: {
            disableHeavyOnScroll: true,
            optimizeParticles: true,
            reduceMotionSupport: true
        },
        // Performance thresholds
        performance: {
            batteryThreshold: 0.2,  // Activate battery saving mode when battery < 20%
            memoryThreshold: 0.7,   // Reduce features when memory pressure is high (70%+)
            fpsThreshold: 45        // Reduce animations when FPS drops below this value
        }
    };

    // Tracks device state
    let deviceState = {
        isMobile: false,
        isTablet: false,
        isLowEndDevice: false,
        hasTouchScreen: false,
        isReducedMotion: false,
        batteryLow: false,
        memoryPressure: false,
        isScrolling: false,
        lastScrollTime: 0,
        scrollTimeout: null,
        currentMode: 'full',   // full, balanced, minimal
        orientation: 'portrait'
    };

    // Initialize all mobile optimizations
    function initOptimizations() {
        // Check device capabilities first
        checkDeviceCapabilities();
        
        // Apply mobile-specific CSS classes
        applyMobileClasses();
        
        // Set up event listeners
        setupEventListeners();
        
        // Optimize images for device
        optimizeImages();
        
        // Initialize adaptive features based on device capabilities
        initAdaptiveFeatures();
        
        // Optimize animations for the contact section
        optimizeContactAnimations();
        
        // Fix for any animation issues
        fixAnimationIssues();
        
        // Setup performance monitoring
        if (!deviceState.isLowEndDevice) {
            setupPerformanceMonitoring();
        }
        
        console.log('📱 Mobile optimizations initialized in ' + deviceState.currentMode + ' mode');
    }
    
    // Check device capabilities to determine optimization level
    function checkDeviceCapabilities() {
        // Check if device is mobile or tablet
        deviceState.isMobile = window.innerWidth < config.breakpoints.medium;
        deviceState.isTablet = window.innerWidth >= config.breakpoints.medium && window.innerWidth < config.breakpoints.large;
        
        // Check for touch screen
        deviceState.hasTouchScreen = ('ontouchstart' in window) || 
                                     (navigator.maxTouchPoints > 0) || 
                                     (navigator.msMaxTouchPoints > 0);
        
        // Check for reduced motion preference
        deviceState.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Check device memory if API is available
        if (navigator.deviceMemory) {
            deviceState.isLowEndDevice = navigator.deviceMemory < 4; // Less than 4GB RAM
        } else {
            // Fallback check using processor cores if available
            if (navigator.hardwareConcurrency) {
                deviceState.isLowEndDevice = navigator.hardwareConcurrency < 4; // Less than 4 cores
            }
        }
        
        // Set current mode based on device capabilities
        if (deviceState.isLowEndDevice || deviceState.isReducedMotion) {
            deviceState.currentMode = 'minimal';
        } else if (deviceState.isMobile) {
            deviceState.currentMode = 'balanced';
        } else {
            deviceState.currentMode = 'full';
        }
        
        // Detect orientation
        deviceState.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

        // Check battery if API is available
        if ('getBattery' in navigator) {
            navigator.getBattery().then(function(battery) {
                checkBatteryStatus(battery);
                
                battery.addEventListener('levelchange', function() {
                    checkBatteryStatus(battery);
                });
            });
        }
    }

    // Check battery status and apply optimizations if needed
    function checkBatteryStatus(battery) {
        const oldBatteryLow = deviceState.batteryLow;
        deviceState.batteryLow = battery.level <= config.performance.batteryThreshold && !battery.charging;
        
        // If battery is now low, enable battery saving mode
        if (deviceState.batteryLow && !oldBatteryLow) {
            enableBatterySavingMode();
        } 
        // If battery is no longer low, disable battery saving mode
        else if (!deviceState.batteryLow && oldBatteryLow) {
            disableBatterySavingMode();
        }
    }

    // Enable battery saving mode
    function enableBatterySavingMode() {
        document.body.classList.add('battery-saving-mode');
        console.log('Battery saving mode enabled');
        
        // Show notification to user
        if (window.psychology && typeof window.psychology.scarcity === 'function') {
            showNotification('Battery Saving Mode enabled', 'Animations reduced to conserve power', 'fa-battery-quarter');
        }
    }

    // Disable battery saving mode
    function disableBatterySavingMode() {
        document.body.classList.remove('battery-saving-mode');
        console.log('Battery saving mode disabled');
    }

    // Apply mobile-specific CSS classes
    function applyMobileClasses() {
        const html = document.documentElement;
        
        if (deviceState.hasTouchScreen) {
            html.classList.add('touch-device');
        }
        
        if (deviceState.isMobile) {
            html.classList.add('mobile-device');
        } else if (deviceState.isTablet) {
            html.classList.add('tablet-device');
        } else {
            html.classList.add('desktop-device');
        }
        
        if (deviceState.isLowEndDevice) {
            html.classList.add('low-end-device');
        }
        
        if (deviceState.isReducedMotion) {
            html.classList.add('reduced-motion');
        }
        
        html.classList.add(`opt-mode-${deviceState.currentMode}`);
    }

    // Set up event listeners for mobile optimizations
    function setupEventListeners() {
        // Handle scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Handle resize events
        window.addEventListener('resize', handleResize, { passive: true });
        
        // Handle orientation change
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Handle visibility change to pause animations when page is not visible
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Touch events for contact section
        setupContactTouchEvents();
    }
    
    // Handle scroll events
    function handleScroll() {
        if (!deviceState.isScrolling) {
            document.body.classList.add('is-scrolling');
            deviceState.isScrolling = true;
        }
        
        // Clear previous timeout
        if (deviceState.scrollTimeout) {
            clearTimeout(deviceState.scrollTimeout);
        }
        
        // Set a timeout to detect when scrolling stops
        deviceState.scrollTimeout = setTimeout(function() {
            document.body.classList.remove('is-scrolling');
            deviceState.isScrolling = false;
        }, 150); // Adjust timeout as needed
        
        deviceState.lastScrollTime = Date.now();
    }
    
    // Handle resize events
    function handleResize() {
        // Update device state on resize
        const wasScrolling = deviceState.isScrolling;
        deviceState.isScrolling = true;
        document.body.classList.add('is-resizing');
        
        // Update orientation
        const oldOrientation = deviceState.orientation;
        deviceState.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        
        if (oldOrientation !== deviceState.orientation) {
            handleOrientationChange();
        }
        
        // Clear previous timeout
        if (deviceState.resizeTimeout) {
            clearTimeout(deviceState.resizeTimeout);
        }
        
        // Set a timeout to detect when resize ends
        deviceState.resizeTimeout = setTimeout(function() {
            document.body.classList.remove('is-resizing');
            deviceState.isScrolling = wasScrolling;
            
            // Recalculate device capabilities
            checkDeviceCapabilities();
            
            // Re-optimize contact section
            optimizeContactAnimations();
        }, 200);
    }
    
    // Handle orientation changes on mobile
    function handleOrientationChange() {
        document.body.classList.add('orientation-changing');
        
        // Forcibly pause animations during orientation change
        document.body.classList.add('pause-animations');
        
        setTimeout(function() {
            document.body.classList.remove('orientation-changing');
            document.body.classList.remove('pause-animations');
            
            // Re-optimize contact elements after orientation change
            optimizeContactAnimations();
        }, 300);
    }
    
    // Handle visibility change
    function handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause heavy animations
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible again
            document.body.classList.remove('page-hidden');
        }
    }

    // Optimize image loading for mobile
    function optimizeImages() {
        // Find all images that can be lazy loaded
        const images = document.querySelectorAll('img[data-src]');
        
        // Set up intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        let src = img.getAttribute('data-src');
                        
                        // For mobile devices, use smaller images if available
                        if (deviceState.isMobile && img.getAttribute('data-src-mobile')) {
                            src = img.getAttribute('data-src-mobile');
                        }
                        
                        img.src = src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '0px 0px 200px 0px' }); // Start loading when within 200px of viewport
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        } 
        // Fallback for browsers that don't support IntersectionObserver
        else {
            // Simple lazy loading using scroll event
            function lazyLoad() {
                let scrollTop = window.pageYOffset;
                images.forEach(img => {
                    if (img.offsetTop < (window.innerHeight + scrollTop)) {
                        let src = img.getAttribute('data-src');
                        
                        // For mobile devices, use smaller images if available
                        if (deviceState.isMobile && img.getAttribute('data-src-mobile')) {
                            src = img.getAttribute('data-src-mobile');
                        }
                        
                        img.src = src;
                        img.classList.add('loaded');
                    }
                });
            }
            
            // Load images that are already visible
            lazyLoad();
            
            // Listen for scroll events
            window.addEventListener('scroll', lazyLoad);
        }
    }

    // Initialize adaptive features based on device capabilities
    function initAdaptiveFeatures() {
        // Adapt contact interface for mobile
        adaptContactInterface();
        
        // Adapt animations based on device capability
        if (deviceState.currentMode === 'minimal') {
            minimizeAnimations();
        } else if (deviceState.currentMode === 'balanced') {
            balanceAnimations();
        }
        
        // Adapt form elements for better mobile UX
        adaptFormElements();
        
        // Handle double-tap behaviors on mobile
        setupDoubleTapHandler();
        
        // Handle ripple effects differently on touch devices
        adaptRippleEffects();
    }

    // Apply minimal animations mode
    function minimizeAnimations() {
        // Disable particle effects
        const particles = document.getElementById('particles-canvas');
        if (particles) {
            particles.style.opacity = "0.2";
        }
        
        // Reduce blur circle intensity
        const blurCircles = document.querySelectorAll('.blur-circle');
        blurCircles.forEach(circle => {
            circle.style.opacity = "0.2";
            circle.style.filter = "blur(70px)";
        });
        
        // Disable 3D card effects
        const cards3d = document.querySelectorAll('.card-3d');
        cards3d.forEach(card => {
            card.classList.add('card-3d-disabled');
        });
        
        // Simplify contact animations
        document.body.classList.add('simple-animations');
    }
    
    // Apply balanced animation mode (moderate effects)
    function balanceAnimations() {
        // Reduce particle count and movement
        if (window.animations && typeof window.animations.particles === 'function') {
            // If animations module is loaded, ask it to use balanced particles
            window.animations.particles('balanced');
        }
        
        // Reduce motion intensity
        document.body.classList.add('balanced-animations');
    }

    // Optimize contact section animations
    function optimizeContactAnimations() {
        const contactSection = document.querySelector('.contact');
        if (!contactSection) return;
        
        // Apply specific optimizations for contact section
        if (deviceState.isMobile) {
            // Simplify form transitions
            const formInputs = contactSection.querySelectorAll('input, textarea, select');
            formInputs.forEach(input => {
                input.classList.add('mobile-optimized-input');
            });
            
            // Optimize chat interface for mobile
            const chatContainer = contactSection.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.classList.add('mobile-optimized-chat');
            }
            
            // Make buttons more tappable
            const buttons = contactSection.querySelectorAll('button, .btn');
            buttons.forEach(button => {
                button.classList.add('mobile-touch-target');
            });
            
            // Optimize calendar
            const calendar = contactSection.querySelector('.availability-calendar');
            if (calendar) {
                calendar.classList.add('mobile-optimized-calendar');
            }
        }
        
        // Add a few extra optimizations for very low-end devices
        if (deviceState.isLowEndDevice) {
            contactSection.classList.add('no-transitions');
            
            // Get all animated elements
            const animatedElements = contactSection.querySelectorAll('.message-choice, .social-box, .contact-info-item');
            animatedElements.forEach(el => {
                el.style.transition = 'none';
                el.style.transform = 'none';
            });
        }
    }

    // Adapt contact interface based on device
    function adaptContactInterface() {
        const contactSection = document.querySelector('.contact');
        if (!contactSection) return;
        
        if (deviceState.isMobile) {
            // Switch the default active tab to form on mobile (more direct)
            const formBtn = contactSection.querySelector('.switcher-btn[data-contact-mode="form"]');
            const chatBtn = contactSection.querySelector('.switcher-btn[data-contact-mode="chat"]');
            const formMode = contactSection.querySelector('#contact-form-mode');
            const chatMode = contactSection.querySelector('#contact-chat-mode');
            
            if (formBtn && chatBtn && formMode && chatMode) {
                formBtn.classList.add('active');
                chatBtn.classList.remove('active');
                formMode.classList.add('active-mode');
                chatMode.classList.remove('active-mode');
            }
            
            // Adjust social grid layout on mobile
            const socialGrid = contactSection.querySelector('.social-grid');
            if (socialGrid) {
                socialGrid.classList.add('mobile-social-grid');
            }
            
            // Optimize chat container height for mobile
            const chatContainer = contactSection.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.style.height = '350px';
            }
        }
    }

    // Adapt form elements for better mobile experience
    function adaptFormElements() {
        // Get all form elements
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            if (!input) return;
            
            if (deviceState.isMobile) {
                // Increase tap target size
                input.classList.add('mobile-touch-input');
                
                // Optimize keyboard interactions
                if (input.tagName.toLowerCase() === 'input') {
                    switch (input.type) {
                        case 'email':
                            input.setAttribute('inputmode', 'email');
                            break;
                        case 'tel':
                            input.setAttribute('inputmode', 'tel');
                            break;
                        case 'number':
                            input.setAttribute('inputmode', 'numeric');
                            break;
                        case 'url':
                            input.setAttribute('inputmode', 'url');
                            break;
                        default:
                            input.setAttribute('inputmode', 'text');
                    }
                }
                
                // Add active state for touch feedback
                input.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                });
                
                input.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                });
            }
        });
    }

    // Set up contact-specific touch events
    function setupContactTouchEvents() {
        // Get all interactive elements in the contact section
        const contactSection = document.querySelector('.contact');
        if (!contactSection) return;
        
        const interactiveElements = contactSection.querySelectorAll('.btn, button, .social-box, .contact-info-item, .message-choice');
        
        interactiveElements.forEach(element => {
            // Add active state on touch start
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            // Remove active state on touch end
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
            
            // Also remove on touch move (user scrolled rather than tapped)
            element.addEventListener('touchmove', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }

    // Set up double-tap handler for mobile
    function setupDoubleTapHandler() {
        if (!deviceState.hasTouchScreen) return;
        
        // Create the double-tap indicator
        const indicator = document.createElement('div');
        indicator.classList.add('double-tap-indicator');
        indicator.textContent = 'Double-tap to zoom disabled';
        document.body.appendChild(indicator);
        
        // Prevent double-tap zoom on interactive elements
        const interactiveElements = document.querySelectorAll('button, a, .btn, .form-group, .contact-info-item, .social-box');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchend', function(e) {
                e.preventDefault();
            }, { passive: false });
        });
    }

    // Adapt ripple effects for touch devices
    function adaptRippleEffects() {
        if (!deviceState.hasTouchScreen) return;
        
        const buttons = document.querySelectorAll('.btn, button, .social-box');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', function(e) {
                // Create ripple effect
                const rect = this.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('psychology-ripple', 'touch-ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }, { passive: true });
        });
    }

    // Fix animation issues in the contact section
    function fixAnimationIssues() {
        // Fix for animation issues in mobile-optimizations.css
        const mobileAnimations = document.styleSheets;
        let sheet;
        
        // Find the mobile optimizations stylesheet
        for (let i = 0; i < mobileAnimations.length; i++) {
            if (mobileAnimations[i].href && mobileAnimations[i].href.includes('mobile-optimizations.css')) {
                sheet = mobileAnimations[i];
                break;
            }
        }
        
        // Get all form elements that have animations
        const formElements = document.querySelectorAll('.form-group, .input-wrapper, .textarea-wrapper, .select-wrapper');
        
        // Apply specific fixes
        formElements.forEach(element => {
            // Fix transition issues
            element.style.willChange = 'opacity, transform';
            
            // Ensure animations run smoothly
            const inputs = element.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    // Force GPU acceleration
                    this.style.transform = 'translateZ(0)';
                });
                
                input.addEventListener('blur', function() {
                    // Reset after animation completes
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);
                });
            });
        });
        
        // Fix social box animation issues
        const socialBoxes = document.querySelectorAll('.social-box');
        socialBoxes.forEach(box => {
            box.addEventListener('touchstart', function() {
                // Force GPU acceleration
                this.style.willChange = 'transform';
            }, { passive: true });
            
            box.addEventListener('touchend', function() {
                // Reset after animation
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 300);
            }, { passive: true });
        });
    }

    // Set up performance monitoring
    function setupPerformanceMonitoring() {
        if (!window.requestAnimationFrame) return;
        
        let lastTime = performance.now();
        let frames = 0;
        let frameRate = 60;
        
        function checkPerformance(timestamp) {
            // Count frames
            frames++;
            
            // Check FPS every second
            if (timestamp - lastTime > 1000) {
                frameRate = Math.round((frames * 1000) / (timestamp - lastTime));
                frames = 0;
                lastTime = timestamp;
                
                // If FPS drops below threshold, optimize further
                if (frameRate < config.performance.fpsThreshold) {
                    preventAnimationLag();
                }
            }
            
            requestAnimationFrame(checkPerformance);
        }
        
        requestAnimationFrame(checkPerformance);
    }

    // Prevent animation lag when performance is poor
    function preventAnimationLag() {
        // Only take action if not already in minimal mode
        if (deviceState.currentMode === 'minimal') return;
        
        console.log('Performance optimization triggered');
        
        // Temporarily reduce animation complexity
        document.body.classList.add('reduced-animations');
        
        // Keep this mode for 10 seconds, then try to restore
        setTimeout(() => {
            document.body.classList.remove('reduced-animations');
        }, 10000);
    }

    // Show notification to user
    function showNotification(title, message, iconClass) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'psychology-notification';
        notification.innerHTML = `
            <div class="psychology-notification-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="psychology-notification-content">
                <p><strong>${title}</strong></p>
                <p>${message}</p>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('psychology-notification-show');
            
            // Auto hide after delay
            setTimeout(() => {
                notification.classList.remove('psychology-notification-show');
                notification.classList.add('psychology-notification-hide');
                
                // Remove from DOM after animation
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }, 100);
    }

})();

// Initialize mobile optimizations when page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileOpt);
} else {
    initMobileOpt();
}

function initMobileOpt() {
    if (window.mobileOpt && typeof window.mobileOpt.init === 'function') {
        window.mobileOpt.init();
    }
}