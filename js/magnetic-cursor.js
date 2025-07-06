/**
 * Magnetic Cursor Effects System
 * Creates interactive cursor that follows magnetic elements and adds premium distortion effects
 */
class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.mousePos = { x: 0, y: 0 };
        this.cursorPos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.magneticElements = [];
        this.isHovering = false;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        // Skip on mobile devices to preserve performance
        if (this.isMobile()) {
            return;
        }
        
        this.createCursor();
        this.setupMagneticElements();
        this.setupEventListeners();
        this.animate();
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    createCursor() {
        // Create custom cursor element
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        this.cursor.innerHTML = '<div class="cursor-dot"></div>';
        
        // Create cursor follower (larger circle)
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'magnetic-cursor-follower';
        
        // Add styles
        this.addCursorStyles();
        
        // Append to body
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        // Hide default cursor
        document.body.style.cursor = 'none';
    }
    
    addCursorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .magnetic-cursor {
                position: fixed;
                top: 0;
                left: 0;
                width: 8px;
                height: 8px;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transition: transform 0.1s ease-out;
            }
            
            .cursor-dot {
                width: 100%;
                height: 100%;
                background: #ffffff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            
            .magnetic-cursor-follower {
                position: fixed;
                top: 0;
                left: 0;
                width: 30px;
                height: 30px;
                pointer-events: none;
                z-index: 9998;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                backdrop-filter: blur(2px);
            }
            
            .magnetic-cursor.hovering {
                transform: scale(1.5);
            }
            
            .magnetic-cursor-follower.hovering {
                width: 60px;
                height: 60px;
                border-color: rgba(108, 99, 255, 0.6);
                background: rgba(108, 99, 255, 0.1);
            }
            
            .magnetic-cursor.clicking {
                transform: scale(0.8);
            }
            
            .magnetic-cursor-follower.clicking {
                width: 20px;
                height: 20px;
                background: rgba(108, 99, 255, 0.3);
            }
            
            /* Hide cursor on elements that should show default cursor */
            input:hover ~ .magnetic-cursor,
            textarea:hover ~ .magnetic-cursor,
            select:hover ~ .magnetic-cursor {
                opacity: 0;
            }
            
            /* Dark theme adjustments */
            [data-theme="dark"] .cursor-dot {
                background: #ffffff;
            }
            
            [data-theme="light"] .cursor-dot {
                background: #000000;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupMagneticElements() {
        // Find all magnetic elements
        const selectors = [
            '.magnetic-element',
            '.premium-button',
            'nav a',
            '.project-card',
            '.glass-card-premium',
            '.skill-item',
            'button:not(.theme-toggle)',
            'a[href]',
            '.floating'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!this.magneticElements.includes(element)) {
                    this.magneticElements.push(element);
                    this.setupMagneticEffect(element);
                }
            });
        });
    }
    
    setupMagneticEffect(element) {
        let magneticStrength = element.dataset.magneticStrength || 0.3;
        magneticStrength = parseFloat(magneticStrength);
        
        element.addEventListener('mouseenter', (e) => {
            this.isHovering = true;
            this.cursor.classList.add('hovering');
            this.cursorFollower.classList.add('hovering');
        });
        
        element.addEventListener('mouseleave', (e) => {
            this.isHovering = false;
            this.cursor.classList.remove('hovering');
            this.cursorFollower.classList.remove('hovering');
            
            // Reset element position
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        element.addEventListener('mousemove', (e) => {
            if (this.isMobile()) return;
            
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * magneticStrength;
            const deltaY = (e.clientY - centerY) * magneticStrength;
            
            // Apply magnetic effect with GSAP if available, otherwise use CSS transforms
            if (typeof gsap !== 'undefined') {
                gsap.to(element, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            }
        });
        
        element.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
            this.cursorFollower.classList.add('clicking');
        });
        
        element.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
            this.cursorFollower.classList.remove('clicking');
        });
    }
    
    setupEventListeners() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        
        // Handle clicks
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
            this.cursorFollower.classList.add('clicking');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
            this.cursorFollower.classList.remove('clicking');
        });
        
        // Handle cursor visibility
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        });
        
        // Handle input elements
        const inputElements = document.querySelectorAll('input, textarea, select');
        inputElements.forEach(input => {
            input.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'text';
                this.cursor.style.opacity = '0';
                this.cursorFollower.style.opacity = '0';
            });
            
            input.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'none';
                this.cursor.style.opacity = '1';
                this.cursorFollower.style.opacity = '1';
            });
        });
        
        // Update magnetic elements on DOM changes (for dynamic content)
        this.observeDOM();
    }
    
    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                // Debounce updates
                clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => {
                    this.setupMagneticElements();
                }, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    animate() {
        // Smooth cursor following with easing
        // const ease = 0.15; // Original value
        // const followerEase = 0.08; // Original value

        // Increase easing values for faster response (less "lag")
        // Values closer to 1 mean faster following. Values too high can make it jerky.
        const ease = 0.3; // Faster response for the main dot
        const followerEase = 0.15; // Faster response for the follower
        
        // Update cursor position
        this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * ease;
        this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * ease;
        
        // Update follower position (slower for trail effect)
        this.followerPos.x += (this.mousePos.x - this.followerPos.x) * followerEase;
        this.followerPos.y += (this.mousePos.y - this.followerPos.y) * followerEase;
        
        // Apply positions
        if (this.cursor) {
            this.cursor.style.transform = `translate(${this.cursorPos.x}px, ${this.cursorPos.y}px)`;
        }
        
        if (this.cursorFollower) {
            this.cursorFollower.style.transform = `translate(${this.followerPos.x}px, ${this.followerPos.y}px)`;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Public methods for controlling the cursor
    show() {
        if (this.cursor) this.cursor.style.opacity = '1';
        if (this.cursorFollower) this.cursorFollower.style.opacity = '1';
    }
    
    hide() {
        if (this.cursor) this.cursor.style.opacity = '0';
        if (this.cursorFollower) this.cursorFollower.style.opacity = '0';
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.cursor) {
            this.cursor.remove();
        }
        
        if (this.cursorFollower) {
            this.cursorFollower.remove();
        }
        
        document.body.style.cursor = '';
        
        // Remove magnetic effects from elements
        this.magneticElements.forEach(element => {
            element.style.transform = '';
        });
    }
}

// Initialize magnetic cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    // Initialize magnetic cursor
    window.magneticCursor = new MagneticCursor();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (window.magneticCursor) {
            window.magneticCursor.destroy();
        }
    });
});
