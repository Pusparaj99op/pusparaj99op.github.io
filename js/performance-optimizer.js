/**
 * Performance Optimization System
 * Optimizes high-poly 3D objects, implements loading states, and manages resource loading
 */
class PerformanceOptimizer {
    constructor() {
        this.isLowEndDevice = this.detectDeviceCapabilities();
        this.optimizationLevel = this.determineOptimizationLevel();
        this.loadingStates = new Map();
        this.lazyLoadQueue = [];
        this.animationsPaused = false;
        
        this.init();
    }
    
    init() {
        this.setupLoadingIndicator();
        this.optimizeBasedOnDevice();
        this.setupIntersectionObserver();
        // Conditionally setup FPS monitoring if not on the highest optimization level initially
        if (this.optimizationLevel !== 'high') {
            this.setupFPSMonitoring();
        }
        this.setupMemoryMonitoring();
        this.setupBatteryOptimization();
    }
    
    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return true; // No WebGL support - definitely low-end
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Adjusted device capability detection for more nuanced levels
        const lowEndIndicators = [
            navigator.hardwareConcurrency < 4, // True if < 4 cores (1, 2, or 3 cores)
            navigator.deviceMemory && navigator.deviceMemory < 4, // True if < 4GB RAM
            renderer.toLowerCase().includes('intel integrated graphics'), // More specific for integrated Intel GPUs
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            window.innerWidth < 1024 // Smaller screens more likely low-end
        ];
        
        // If 2 or more indicators are true, or if it's a mobile device, classify as low-end.
        return lowEndIndicators.filter(Boolean).length >= 2 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    determineOptimizationLevel() {
        if (this.isLowEndDevice) { // Based on stricter criteria from detectDeviceCapabilities
            return 'high'; 
        } else if ( (navigator.deviceMemory && navigator.deviceMemory < 8) || // RAM is < 8GB (e.g. 4GB, 6GB)
                    (window.innerWidth < 1366) ) { // Screen width typical of non-high-end laptops
            return 'medium'; 
        }
        // Default to low (full effects) for more capable devices
        return 'low';
    }
    
    setupLoadingIndicator() {
        // Create premium loading screen
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'premium-loading';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">
                    <div class="logo-text">KS</div>
                    <div class="loading-ring"></div>
                </div>
                <div class="loading-text">Loading Premium Experience</div>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                    <div class="progress-glow"></div>
                </div>
                <div class="loading-percentage">0%</div>
            </div>
        `;
        
        // Add loading styles
        this.addLoadingStyles();
        
        document.body.appendChild(loadingScreen);
        this.loadingScreen = loadingScreen;
        
        // Start loading animation
        this.animateLoadingProgress();
    }
    
    addLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #premium-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                transition: opacity 0.5s ease, visibility 0.5s ease;
            }
            
            #premium-loading.hidden {
                opacity: 0;
                visibility: hidden;
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-logo {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .logo-text {
                font-size: 24px;
                font-weight: bold;
                color: white;
                z-index: 2;
                position: relative;
            }
            
            .loading-ring {
                position: absolute;
                width: 80px;
                height: 80px;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                font-size: 18px;
                margin-bottom: 30px;
                opacity: 0.9;
            }
            
            .loading-progress {
                position: relative;
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin: 0 auto 20px;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #00E0FF, #6C63FF);
                border-radius: 2px;
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-glow {
                position: absolute;
                top: -2px;
                left: -10px;
                height: 8px;
                width: 20px;
                background: rgba(108, 99, 255, 0.6);
                border-radius: 50%;
                filter: blur(4px);
                transform: translateX(0%);
                transition: transform 0.3s ease;
            }
            
            .loading-percentage {
                font-size: 14px;
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
    
    animateLoadingProgress() {
        let progress = 0;
        const progressBar = document.querySelector('.progress-bar');
        const progressGlow = document.querySelector('.progress-glow');
        const progressText = document.querySelector('.loading-percentage');
        
        const updateProgress = (newProgress) => {
            progress = Math.min(100, newProgress);
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
                progressGlow.style.transform = `translateX(${progress * 9}px)`;
                progressText.textContent = `${Math.round(progress)}%`;
            }
            
            if (progress >= 100) {
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
        };
        
        // Simulate loading progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5;
            updateProgress(currentProgress);
            
            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 100);
        
        // Complete loading when page is fully loaded
        if (document.readyState === 'complete') {
            updateProgress(100);
        } else {
            window.addEventListener('load', () => updateProgress(100));
        }
    }
    
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (this.loadingScreen) { // Check if still exists
                    this.loadingScreen.remove();
                    this.loadingScreen = null; // Clear reference
                }
            }, 500);
        }
    }
    
    optimizeBasedOnDevice() {
        const body = document.body;
        
        switch (this.optimizationLevel) {
            case 'high':
                body.classList.add('performance-high-optimization');
                this.disableHeavyAnimations();
                this.reduceParticleCount();
                this.disablePostProcessing();
                break;
                
            case 'medium':
                body.classList.add('performance-medium-optimization');
                this.reduceParticleCount(0.7);
                this.limitAnimationFPS();
                break;
                
            case 'low':
                body.classList.add('performance-low-optimization');
                // Full premium experience
                break;
        }
    }
    
    disableHeavyAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .performance-high-optimization * {
                /* Apply more aggressive animation disabling */
                animation-duration: 0s !important;
                animation-iteration-count: 1 !important; /* Run animations once if at all */
                transition-duration: 0s !important;
                transition-delay: 0s !important;
                animation-delay: 0s !important;
            }
            
            .performance-high-optimization .floating,
            .performance-high-optimization .floating-element, /* Ensured .floating-element is also targeted */
            .performance-high-optimization .pulse-effect,
            .performance-high-optimization .morphing-bg,
            .performance-high-optimization .typing-effect,
            .performance-high-optimization .stagger-in > *,
            .performance-high-optimization .animate-on-scroll,
            .performance-high-optimization .scroll-reveal /* Added scroll-reveal */
             {
                animation: none !important;
                transform: none !important; /* Reset transforms that might be part of animations */
                opacity: 1 !important; /* Ensure visibility if animation was fading in */
            }

            /* Further reduce motion for medium optimization */
            .performance-medium-optimization .floating,
            .performance-medium-optimization .floating-element { /* Ensured .floating-element is also targeted */
                 animation-duration: 8s !important; /* Slow down floating significantly */
                 animation-timing-function: ease-in-out !important; /* Smoother easing */
            }
            .performance-medium-optimization .pulse-effect {
                animation-duration: 3s !important; /* Slow down pulse */
            }
            .performance-medium-optimization .scroll-reveal {
                transition-duration: 0.4s !important; /* Faster, less pronounced scroll reveal */
                transform: translateY(15px) scale(0.98) !important;
            }
            .performance-medium-optimization .scroll-reveal.revealed {
                transform: translateY(0) scale(1) !important;
            }

            /* Disable backdrop-filter for medium and high optimization on sticky header */
            .performance-medium-optimization header.sticky,
            .performance-high-optimization header.sticky {
                -webkit-backdrop-filter: none !important;
                backdrop-filter: none !important;
                background-color: var(--glass-bg) !important; /* Ensure a fallback background */
            }

            /* Optionally, simplify sticky header background further for high optimization */
            .performance-high-optimization header.sticky {
                background-color: var(--bg-secondary) !important; /* Use a solid, less transparent background */
            }
        `;
        document.head.appendChild(style);
    }
    
    reduceParticleCount(multiplier = 0.3) { // Default to a more aggressive reduction
        // Signal to 3D systems to reduce particle counts
        window.performanceMultiplier = multiplier;
    }
    
    disablePostProcessing() {
        window.disablePostProcessing = true;
    }
    
    limitAnimationFPS() {
        let lastTime = 0;
        const targetFPS = 30; // Keep at 30 for medium, high will disable/reduce further
        const frameTime = 1000 / targetFPS;
        
        // Store the original requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;
        
        // Create a new function for the throttled RAF
        const throttledRAF = function(callback) {
            return originalRAF(function(time) {
                if (time - lastTime >= frameTime) {
                    lastTime = time;
                    callback(time);
                } else {
                    // If not enough time has passed, schedule it for the next available slot
                    // This prevents callbacks from being dropped entirely if the condition isn't met.
                    originalRAF(() => callback(time));
                }
            });
        };

        // Only override if not on high optimization (where many animations are disabled anyway)
        if (this.optimizationLevel === 'medium') {
            window.requestAnimationFrame = throttledRAF;
        }
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadElement(entry.target);
                    } else {
                        this.unloadElement(entry.target);
                    }
                });
            },
            { 
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
        
        // Observe heavy elements
        document.querySelectorAll('.lazy-3d, .heavy-animation, .particle-system').forEach(el => {
            this.observer.observe(el);
        });
    }
    
    loadElement(element) {
        if (element.classList.contains('lazy-3d')) {
            element.classList.add('loaded');
        }
    }
    
    unloadElement(element) {
        // Pause animations for off-screen elements
        if (!element.classList.contains('critical')) {
            element.style.animationPlayState = 'paused';
        }
    }
    
    setupFPSMonitoring() {
        let frames = 0;
        let lastTime = performance.now();
        let consecutiveLowFPSCount = 0; // Counter for consecutive low FPS readings
        const LOW_FPS_THRESHOLD = 25; // Stricter FPS threshold
        const CONSECUTIVE_FRAMES_TO_OPTIMIZE = 5; // Number of consecutive low FPS readings before optimizing
        
        const monitor = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round(frames * 1000 / (currentTime - lastTime));
                
                if (fps < LOW_FPS_THRESHOLD && this.optimizationLevel !== 'high') {
                    consecutiveLowFPSCount++;
                    if (consecutiveLowFPSCount >= CONSECUTIVE_FRAMES_TO_OPTIMIZE) {
                        this.increaseOptimization();
                        consecutiveLowFPSCount = 0; // Reset counter after optimizing
                    }
                } else if (fps > 55 && this.optimizationLevel === 'high') {
                    // Only decrease optimization if FPS is consistently high
                    // this.decreaseOptimization(); // Consider if this is desired, might cause layout shifts
                    consecutiveLowFPSCount = 0; // Reset counter
                } else {
                    consecutiveLowFPSCount = 0; // Reset counter if FPS is acceptable
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            // Only continue monitoring if not on the highest optimization level
            if (this.optimizationLevel !== 'high') {
                requestAnimationFrame(monitor);
            }
        };
        
        // Start monitoring if not already on high optimization
        if (this.optimizationLevel !== 'high') {
            requestAnimationFrame(monitor);
        }
    }
    
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const usedMB = memInfo.usedJSHeapSize / 1024 / 1024;
                const limitMB = memInfo.jsHeapSizeLimit / 1024 / 1024;
                
                // If memory usage is high, increase optimization
                if (usedMB / limitMB > 0.8) {
                    this.increaseOptimization();
                }
            }, 5000);
        }
    }
    
    setupBatteryOptimization() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const optimizeForBattery = () => {
                    if (battery.level < 0.2 || !battery.charging) {
                        this.increaseOptimization();
                    }
                };
                
                battery.addEventListener('levelchange', optimizeForBattery);
                battery.addEventListener('chargingchange', optimizeForBattery);
                optimizeForBattery();
            });
        }
    }
    
    increaseOptimization() {
        const body = document.body;
        if (this.optimizationLevel === 'low') {
            this.optimizationLevel = 'medium';
            body.classList.remove('performance-low-optimization');
            body.classList.add('performance-medium-optimization');
            this.reduceParticleCount(0.5); // Medium reduction
            this.limitAnimationFPS(); // Apply FPS limiting for medium
            console.log("Performance Optimizer: Increased to Medium Optimization");
        } else if (this.optimizationLevel === 'medium') {
            this.optimizationLevel = 'high';
            body.classList.remove('performance-medium-optimization');
            body.classList.add('performance-high-optimization');
            this.disableHeavyAnimations();
            this.reduceParticleCount(0.1); // Aggressive reduction for high
            // FPS monitoring will stop automatically as per setupFPSMonitoring logic
            console.log("Performance Optimizer: Increased to High Optimization");
        }
    }
    
    decreaseOptimization() {
        const body = document.body;
        if (this.optimizationLevel === 'high') {
            this.optimizationLevel = 'medium';
            body.classList.remove('performance-high-optimization');
            body.classList.add('performance-medium-optimization');
            // Re-enable FPS monitoring if it was stopped
            if (!this.fpsMonitorHandle) {
                 this.setupFPSMonitoring();
            }
            console.log("Performance Optimizer: Decreased to Medium Optimization");
            // location.reload(); // Reloading might be too disruptive, try to re-enable features dynamically
        } else if (this.optimizationLevel === 'medium') {
            this.optimizationLevel = 'low';
            body.classList.remove('performance-medium-optimization');
            body.classList.add('performance-low-optimization');
            // Restore original RAF if it was overridden
            if (window.originalRAF) {
                window.requestAnimationFrame = window.originalRAF;
            }
            console.log("Performance Optimizer: Decreased to Low Optimization (Full Effects)");
            // location.reload(); // Reloading might be too disruptive
        }
        // Potentially re-initialize or enable features that were disabled
        // This part needs careful handling to avoid issues.
        // For now, a reload is safer if full restoration is needed, but we avoid it.
    }
    
    pauseAnimations() {
        this.animationsPaused = true;
        document.body.classList.add('animations-paused');
    }
    
    resumeAnimations() {
        this.animationsPaused = false;
        document.body.classList.remove('animations-paused');
    }
    
    // Public API
    getOptimizationLevel() {
        return this.optimizationLevel;
    }
    
    isOptimizedDevice() {
        return this.isLowEndDevice;
    }
}

// Initialize performance optimization
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Add styles for performance optimization
const performanceStyles = document.createElement('style');
performanceStyles.textContent = `
    .performance-high-optimization .particle-system {
        display: none !important;
    }
    
    .performance-medium-optimization .particle-system {
        opacity: 0.5;
    }
    
    .animations-paused * {
        animation-play-state: paused !important;
    }
    
    /* Lazy loading states */
    .lazy-3d {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .lazy-3d.loaded {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(performanceStyles);
