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
        this.setupFPSMonitoring();
        this.setupMemoryMonitoring();
        this.setupBatteryOptimization();
    }
    
    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return true; // No WebGL support - definitely low-end
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Basic device capability detection
        const lowEndIndicators = [
            navigator.hardwareConcurrency < 4,
            navigator.deviceMemory && navigator.deviceMemory < 4,
            renderer.toLowerCase().includes('intel'),
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            window.innerWidth < 1024
        ];
        
        return lowEndIndicators.filter(Boolean).length >= 2;
    }
    
    determineOptimizationLevel() {
        if (this.isLowEndDevice) return 'high';
        if (navigator.deviceMemory && navigator.deviceMemory < 8) return 'medium';
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
                this.loadingScreen.remove();
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
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            
            .performance-high-optimization .floating,
            .performance-high-optimization .pulse-effect,
            .performance-high-optimization .morphing-bg {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    reduceParticleCount(multiplier = 0.5) {
        // Signal to 3D systems to reduce particle counts
        window.performanceMultiplier = multiplier;
    }
    
    disablePostProcessing() {
        window.disablePostProcessing = true;
    }
    
    limitAnimationFPS() {
        let lastTime = 0;
        const targetFPS = 30;
        const frameTime = 1000 / targetFPS;
        
        // Override requestAnimationFrame for heavy animations
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            return originalRAF(function(time) {
                if (time - lastTime >= frameTime) {
                    lastTime = time;
                    callback(time);
                }
            });
        };
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
        
        const monitor = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round(frames * 1000 / (currentTime - lastTime));
                
                // Auto-adjust performance based on FPS
                if (fps < 30 && this.optimizationLevel !== 'high') {
                    this.increaseOptimization();
                } else if (fps > 55 && this.optimizationLevel === 'high') {
                    this.decreaseOptimization();
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitor);
        };
        
        monitor();
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
        if (this.optimizationLevel === 'low') {
            this.optimizationLevel = 'medium';
            this.reduceParticleCount(0.7);
        } else if (this.optimizationLevel === 'medium') {
            this.optimizationLevel = 'high';
            this.disableHeavyAnimations();
            this.reduceParticleCount(0.3);
        }
    }
    
    decreaseOptimization() {
        if (this.optimizationLevel === 'high') {
            this.optimizationLevel = 'medium';
        } else if (this.optimizationLevel === 'medium') {
            this.optimizationLevel = 'low';
        }
        location.reload(); // Reload to restore full effects
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
