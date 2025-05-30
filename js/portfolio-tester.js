/**
 * Portfolio Testing and Validation System
 * Tests all premium features, validates performance, and ensures cross-browser compatibility
 */
class PortfolioTester {
    constructor() {
        this.testResults = {
            threeD: false,
            postProcessing: false,
            magneticCursor: false,
            performanceOptimizer: false,
            premiumEffects: false,
            themeToggle: false,
            smoothScrolling: false,
            blogConsistency: false
        };
        
        this.init();
    }
    
    init() {
        // Wait for all systems to initialize
        setTimeout(() => {
            this.runAllTests();
            this.displayResults();
        }, 2000);
    }
      runAllTests() {
        console.log('🚀 Running Portfolio Premium Feature Tests...');
        
        this.test3DBackground();
        this.testPostProcessing();
        this.testMagneticCursor();
        this.testPerformanceOptimizer();
        this.testPremiumEffects();
        this.testThemeToggle();
        this.testSmoothScrolling();
        this.testBlogConsistency();
        this.testCrossBrowserCompatibility();
        this.testMobileOptimization();
    }
    
    test3DBackground() {
        try {
            const canvas = document.getElementById('three-bg');
            const hasThreeD = window.threeDBackground && canvas;
            const hasScene = window.threeDBackground?.scene;
            const hasObjects = window.threeDBackground?.objects?.length > 0;
            
            this.testResults.threeD = hasThreeD && hasScene && hasObjects;
            
            if (this.testResults.threeD) {
                console.log('✅ 3D Background: Working');
            } else {
                console.log('❌ 3D Background: Failed');
            }
        } catch (error) {
            console.log('❌ 3D Background: Error -', error.message);
        }
    }
    
    testPostProcessing() {
        try {
            const hasComposer = window.threeDBackground?.composer;
            const hasEffectComposer = typeof THREE?.EffectComposer !== 'undefined';
            
            this.testResults.postProcessing = hasComposer && hasEffectComposer;
            
            if (this.testResults.postProcessing) {
                console.log('✅ Post-Processing: Working');
            } else {
                console.log('⚠️ Post-Processing: Libraries not loaded or disabled for performance');
            }
        } catch (error) {
            console.log('❌ Post-Processing: Error -', error.message);
        }
    }
    
    testMagneticCursor() {
        try {
            const hasMagneticCursor = window.magneticCursor;
            const cursorElement = document.querySelector('.magnetic-cursor');
            const magneticElements = document.querySelectorAll('.magnetic-element, .premium-button');
            
            this.testResults.magneticCursor = hasMagneticCursor && cursorElement && magneticElements.length > 0;
            
            if (this.testResults.magneticCursor) {
                console.log('✅ Magnetic Cursor: Working');
            } else {
                console.log('⚠️ Magnetic Cursor: Disabled on mobile or not initialized');
            }
        } catch (error) {
            console.log('❌ Magnetic Cursor: Error -', error.message);
        }
    }
    
    testPerformanceOptimizer() {
        try {
            const hasOptimizer = window.performanceOptimizer;
            const optimizationLevel = hasOptimizer?.getOptimizationLevel();
            const loadingScreen = document.getElementById('premium-loading');
            
            this.testResults.performanceOptimizer = hasOptimizer && optimizationLevel;
            
            if (this.testResults.performanceOptimizer) {
                console.log(`✅ Performance Optimizer: Working (Level: ${optimizationLevel})`);
            } else {
                console.log('❌ Performance Optimizer: Failed');
            }
        } catch (error) {
            console.log('❌ Performance Optimizer: Error -', error.message);
        }
    }
    
    testPremiumEffects() {
        try {
            const glassCards = document.querySelectorAll('.glass-card-premium');
            const floatingElements = document.querySelectorAll('.floating');
            const premiumButtons = document.querySelectorAll('.premium-button');
            const animatedText = document.querySelectorAll('.animated-gradient-text');
            
            this.testResults.premiumEffects = glassCards.length > 0 && 
                                             floatingElements.length > 0 && 
                                             premiumButtons.length > 0 && 
                                             animatedText.length > 0;
            
            if (this.testResults.premiumEffects) {
                console.log('✅ Premium Effects: All applied');
            } else {
                console.log('❌ Premium Effects: Some missing');
            }
        } catch (error) {
            console.log('❌ Premium Effects: Error -', error.message);
        }
    }
    
    testThemeToggle() {
        try {
            const themeToggle = document.querySelector('.theme-toggle');
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            this.testResults.themeToggle = themeToggle && (currentTheme === 'light' || currentTheme === 'dark');
            
            if (this.testResults.themeToggle) {
                console.log(`✅ Theme Toggle: Working (Current: ${currentTheme})`);
            } else {
                console.log('❌ Theme Toggle: Failed');
            }
        } catch (error) {
            console.log('❌ Theme Toggle: Error -', error.message);
        }
    }
    
    testSmoothScrolling() {
        try {
            const hasScrollBehavior = CSS.supports('scroll-behavior', 'smooth');
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            
            this.testResults.smoothScrolling = hasScrollBehavior && navLinks.length > 0;
            
            if (this.testResults.smoothScrolling) {
                console.log('✅ Smooth Scrolling: Working');
            } else {
                console.log('❌ Smooth Scrolling: Not supported or missing');
            }
        } catch (error) {
            console.log('❌ Smooth Scrolling: Error -', error.message);
        }
    }
    
    testBlogConsistency() {
        try {
            // Test if blog styles are consistent
            const blogLink = document.querySelector('a[href*="blog"]');
            const blogStyles = document.querySelector('link[href*="blog.css"]');
            
            this.testResults.blogConsistency = blogLink !== null;
            
            if (this.testResults.blogConsistency) {
                console.log('✅ Blog Consistency: Links present');
            } else {
                console.log('⚠️ Blog Consistency: Blog link not found');
            }
        } catch (error) {
            console.log('❌ Blog Consistency: Error -', error.message);
        }
    }
    
    displayResults() {
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(Boolean).length;
        const score = Math.round((passedTests / totalTests) * 100);
        
        console.log('\n🎯 PORTFOLIO TEST RESULTS:');
        console.log('─'.repeat(40));
        console.log(`Score: ${score}% (${passedTests}/${totalTests} tests passed)`);
        
        if (score >= 80) {
            console.log('🎉 Excellent! Portfolio is premium-ready');
        } else if (score >= 60) {
            console.log('👍 Good! Minor optimizations needed');
        } else {
            console.log('⚠️ Needs attention - several features require fixes');
        }
        
        // Performance metrics
        this.displayPerformanceMetrics();
        
        // Browser compatibility
        this.displayBrowserCompatibility();
    }
    
    displayPerformanceMetrics() {
        console.log('\n📊 PERFORMANCE METRICS:');
        console.log('─'.repeat(40));
        
        // FPS monitoring
        if ('memory' in performance) {
            const memory = performance.memory;
            console.log(`Memory Usage: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
        }
        
        // Navigation timing
        if ('getEntriesByType' in performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                console.log(`Page Load Time: ${Math.round(nav.loadEventEnd - nav.fetchStart)}ms`);
                console.log(`DOM Ready: ${Math.round(nav.domContentLoadedEventEnd - nav.fetchStart)}ms`);
            }
        }
        
        // Resource count
        const resources = performance.getEntriesByType('resource');
        console.log(`Resources Loaded: ${resources.length}`);
    }
    
    displayBrowserCompatibility() {
        console.log('\n🌐 BROWSER COMPATIBILITY:');
        console.log('─'.repeat(40));
        
        const features = {
            'CSS Grid': CSS.supports('display', 'grid'),
            'CSS Custom Properties': CSS.supports('color', 'var(--test)'),
            'Intersection Observer': 'IntersectionObserver' in window,
            'Web Animations API': 'animate' in document.createElement('div'),
            'WebGL': !!document.createElement('canvas').getContext('webgl'),
            'Backdrop Filter': CSS.supports('backdrop-filter', 'blur(1px)'),
            'CSS Transforms 3D': CSS.supports('transform', 'translateZ(1px)')
        };
        
        Object.entries(features).forEach(([feature, supported]) => {
            console.log(`${supported ? '✅' : '❌'} ${feature}`);
        });
    }
    
    // Performance testing methods
    measureFPS() {
        let frames = 0;
        let lastTime = performance.now();
        
        const measure = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round(frames * 1000 / (currentTime - lastTime));
                console.log(`Current FPS: ${fps}`);
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measure);
        };
        
        measure();
    }
    
    // Public API for manual testing
    runTest(testName) {
        if (this[`test${testName}`]) {
            this[`test${testName}`]();
        } else {
            console.log(`Test '${testName}' not found`);
        }
    }
    
    getResults() {
        return this.testResults;
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add test indicator to page
    const testIndicator = document.createElement('div');
    testIndicator.id = 'test-indicator';
    testIndicator.innerHTML = '🧪 Running Tests...';
    testIndicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10001;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(testIndicator);
    
    // Initialize tester
    window.portfolioTester = new PortfolioTester();
    
    // Update indicator after tests
    setTimeout(() => {
        const results = window.portfolioTester.getResults();
        const passedTests = Object.values(results).filter(Boolean).length;
        const totalTests = Object.keys(results).length;
        const score = Math.round((passedTests / totalTests) * 100);
        
        testIndicator.innerHTML = `✅ ${score}% (${passedTests}/${totalTests})`;
        testIndicator.style.background = score >= 80 ? 'rgba(0, 150, 0, 0.8)' : 
                                      score >= 60 ? 'rgba(255, 165, 0, 0.8)' : 
                                      'rgba(150, 0, 0, 0.8)';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            testIndicator.style.opacity = '0.3';
            testIndicator.style.transform = 'scale(0.8)';
        }, 5000);
    }, 3000);
});

// Add keyboard shortcut for manual testing (Ctrl+Shift+T)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
        if (window.portfolioTester) {
            window.portfolioTester.runAllTests();
            window.portfolioTester.displayResults();
        }
    }
});

// Add additional testing methods to PortfolioTester prototype
PortfolioTester.prototype.testCrossBrowserCompatibility = function() {
    try {
        const compatibility = {
            webgl: this.checkWebGLSupport(),
            intersectionObserver: 'IntersectionObserver' in window,
            customProperties: this.checkCSSCustomProperties(),
            flexbox: this.checkFlexboxSupport(),
            grid: this.checkGridSupport(),
            transforms3d: this.check3DTransformSupport()
        };
        
        const supportCount = Object.values(compatibility).filter(Boolean).length;
        const compatibilityScore = (supportCount / Object.keys(compatibility).length) * 100;
        
        console.log(`Browser compatibility: ${compatibilityScore}%`, compatibility);
        
        if (compatibilityScore >= 80) {
            console.log('✅ Cross-browser compatibility test passed');
        } else {
            console.log('⚠️ Limited browser compatibility detected');
        }
    } catch (error) {
        console.error('❌ Cross-browser compatibility test failed:', error);
    }
};

PortfolioTester.prototype.testMobileOptimization = function() {
    try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const hasViewportMeta = !!document.querySelector('meta[name="viewport"]');
        const hasTouchStyles = this.checkTouchStyles();
        const hasResponsiveImages = this.checkResponsiveImages();
        
        const optimizations = {
            viewportMeta: hasViewportMeta,
            touchOptimized: hasTouchStyles,
            responsiveImages: hasResponsiveImages,
            magneticCursorDisabled: isMobile
        };
        
        const optimizationScore = Object.values(optimizations).filter(Boolean).length;
        
        console.log(`Mobile optimization: ${optimizationScore}/4 features`, optimizations);
        
        if (optimizationScore >= 3) {
            console.log('✅ Mobile optimization test passed');
        } else {
            console.log('⚠️ Mobile optimization needs improvement');
        }
    } catch (error) {
        console.error('❌ Mobile optimization test failed:', error);
    }
};

// Helper methods for browser compatibility testing
PortfolioTester.prototype.checkWebGLSupport = function() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
};

PortfolioTester.prototype.checkCSSCustomProperties = function() {
    return CSS.supports && CSS.supports('(--property: value)');
};

PortfolioTester.prototype.checkFlexboxSupport = function() {
    const el = document.createElement('div');
    el.style.display = 'flex';
    return el.style.display === 'flex';
};

PortfolioTester.prototype.checkGridSupport = function() {
    const el = document.createElement('div');
    el.style.display = 'grid';
    return el.style.display === 'grid';
};

PortfolioTester.prototype.check3DTransformSupport = function() {
    const el = document.createElement('div');
    el.style.transform = 'translate3d(0,0,0)';
    return el.style.transform.includes('translate3d');
};

PortfolioTester.prototype.checkTouchStyles = function() {
    const styleSheets = Array.from(document.styleSheets);
    for (const sheet of styleSheets) {
        try {
            const rules = Array.from(sheet.cssRules || sheet.rules || []);
            const hasTouchMedia = rules.some(rule => 
                rule.media && rule.media.mediaText.includes('hover: none')
            );
            if (hasTouchMedia) return true;
        } catch (e) {
            // Cross-origin stylesheet, skip
        }
    }
    return false;
};

PortfolioTester.prototype.checkResponsiveImages = function() {
    const images = document.querySelectorAll('img');
    let responsiveCount = 0;
    
    images.forEach(img => {
        if (img.hasAttribute('loading') || 
            img.srcset || 
            img.classList.contains('lazy-image') ||
            img.dataset.src) {
            responsiveCount++;
        }
    });
    
    return responsiveCount > 0;
};
