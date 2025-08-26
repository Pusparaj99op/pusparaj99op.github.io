/**
 * Canvas Animations - Advanced 2D Canvas effects and scroll animations
 * Creates particle trails, morphing shapes, and interactive visual effects
 * Version: 1.0
 * Last Modified: August 26, 2025
 */

class CanvasAnimations {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.time = 0;
        this.isRunning = false;
        this.effects = [];
        this.particles = [];

        this.mouse = { x: 0, y: 0, pressed: false };
        this.theme = {
            primary: '#6a7dfe',
            secondary: '#ff6b6b',
            accent: '#4ecdc4',
            background: 'rgba(0, 0, 0, 0.1)'
        };

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticleSystem();
        this.bindEvents();
        this.createScrollAnimations();

        console.log('Canvas Animations initialized');
    }

    setupCanvas() {
        const pixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * pixelRatio;
        this.canvas.height = this.canvas.clientHeight * pixelRatio;
        this.canvas.style.width = this.canvas.clientWidth + 'px';
        this.canvas.style.height = this.canvas.clientHeight + 'px';

        this.ctx.scale(pixelRatio, pixelRatio);
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
    }

    createParticleSystem() {
        this.particles = [];
        const particleCount = Math.min(150, Math.floor(this.width * this.height / 5000));

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }
    }

    bindEvents() {
        // Mouse/touch tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.createTrailParticles(this.mouse.x, this.mouse.y);
        });

        this.canvas.addEventListener('mousedown', () => {
            this.mouse.pressed = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });

        // Touch events
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            this.createTrailParticles(this.mouse.x, this.mouse.y);
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
        });

        // Scroll events for scroll-triggered animations
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });
    }

    createTrailParticles(x, y) {
        for (let i = 0; i < 3; i++) {
            this.particles.push(new TrailParticle(x, y, this.theme));
        }

        // Limit particle count
        if (this.particles.length > 300) {
            this.particles.splice(0, this.particles.length - 300);
        }
    }

    createScrollAnimations() {
        this.scrollAnimations = [
            new WaveScrollAnimation(this.canvas),
            new ParticleTrailAnimation(this.canvas),
            new MorphingShapeAnimation(this.canvas)
        ];
    }

    handleScrollAnimations() {
        const scrollProgress = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);

        this.scrollAnimations.forEach(animation => {
            animation.update(scrollProgress);
        });
    }

    update() {
        this.time += 0.016; // 60fps

        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });

        // Update scroll animations
        this.scrollAnimations.forEach(animation => {
            animation.animate(this.time);
        });

        // Create ambient particles occasionally
        if (Math.random() < 0.02) {
            this.particles.push(new AmbientParticle(this.width, this.height, this.theme));
        }
    }

    render() {
        // Clear canvas with fade effect
        this.ctx.fillStyle = this.theme.background;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Render particles
        this.particles.forEach(particle => {
            particle.render(this.ctx);
        });

        // Render scroll animations
        this.scrollAnimations.forEach(animation => {
            animation.render(this.ctx);
        });

        // Render mouse interaction effects
        this.renderMouseEffects();
    }

    renderMouseEffects() {
        if (this.mouse.x > 0 && this.mouse.y > 0) {
            // Glowing cursor effect
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, 50
            );

            gradient.addColorStop(0, 'rgba(106, 125, 254, 0.3)');
            gradient.addColorStop(1, 'rgba(106, 125, 254, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(this.mouse.x - 50, this.mouse.y - 50, 100, 100);

            // Ripple effect when pressed
            if (this.mouse.pressed) {
                this.ctx.strokeStyle = `rgba(106, 125, 254, ${0.5 * Math.sin(this.time * 5)})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.mouse.x, this.mouse.y, 30 + Math.sin(this.time * 8) * 10, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.update();
        this.render();

        requestAnimationFrame(() => this.animate());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
            console.log('Canvas Animations started');
        }
    }

    stop() {
        this.isRunning = false;
        console.log('Canvas Animations stopped');
    }

    resize() {
        this.setupCanvas();
        this.createParticleSystem();

        // Update scroll animations
        this.scrollAnimations.forEach(animation => {
            animation.resize(this.width, this.height);
        });
    }

    updateTheme(newTheme) {
        this.theme = { ...this.theme, ...newTheme };

        // Update existing particles
        this.particles.forEach(particle => {
            if (particle.updateTheme) {
                particle.updateTheme(this.theme);
            }
        });
    }
}

// Particle Classes
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
    }

    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1;
        this.maxLife = 1;
        this.size = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.005;

        // Bounce off edges
        if (this.x <= 0 || this.x >= this.canvasWidth) this.vx *= -1;
        if (this.y <= 0 || this.y >= this.canvasHeight) this.vy *= -1;

        // Keep in bounds
        this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class TrailParticle extends Particle {
    constructor(x, y, theme) {
        super(0, 0);
        this.x = x + (Math.random() - 0.5) * 20;
        this.y = y + (Math.random() - 0.5) * 20;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.maxLife = 1;
        this.size = Math.random() * 5 + 2;
        this.color = theme.primary;
        this.theme = theme;
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );

        gradient.addColorStop(0, `${this.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${this.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class AmbientParticle extends Particle {
    constructor(canvasWidth, canvasHeight, theme) {
        super(canvasWidth, canvasHeight);
        this.phase = Math.random() * Math.PI * 2;
        this.amplitude = Math.random() * 30 + 10;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.originalY = this.y;
        this.theme = theme;
        this.colorIndex = Math.floor(Math.random() * 3);
        this.updateColor();
    }

    updateColor() {
        const colors = [this.theme.primary, this.theme.secondary, this.theme.accent];
        this.color = colors[this.colorIndex];
    }

    update() {
        super.update();
        // Add wave motion
        this.y = this.originalY + Math.sin(Date.now() * this.frequency + this.phase) * this.amplitude;
    }

    updateTheme(newTheme) {
        this.theme = newTheme;
        this.updateColor();
    }
}

// Scroll Animation Classes
class WaveScrollAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.waves = [];
        this.scrollProgress = 0;

        for (let i = 0; i < 3; i++) {
            this.waves.push({
                amplitude: 20 + i * 10,
                frequency: 0.01 + i * 0.005,
                phase: i * Math.PI / 3,
                color: `hsla(${200 + i * 30}, 70%, 60%, 0.3)`
            });
        }
    }

    update(scrollProgress) {
        this.scrollProgress = scrollProgress;
    }

    animate(time) {
        // Animate wave parameters
        this.waves.forEach((wave, index) => {
            wave.phase += 0.02 * (index + 1);
        });
    }

    render(ctx) {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.waves.forEach(wave => {
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 3;
            ctx.beginPath();

            for (let x = 0; x <= width; x += 5) {
                const y = height / 2 +
                         Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
                         Math.sin(this.scrollProgress * Math.PI * 2) * 20;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
        });
    }

    resize(width, height) {
        // Update wave parameters if needed
    }
}

class ParticleTrailAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.trails = [];
        this.scrollProgress = 0;
    }

    update(scrollProgress) {
        this.scrollProgress = scrollProgress;

        // Create new trail particles based on scroll
        if (Math.random() < scrollProgress) {
            this.trails.push({
                x: Math.random() * this.canvas.clientWidth,
                y: this.canvas.clientHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 5 - 2,
                life: 1,
                size: Math.random() * 3 + 1,
                color: `hsl(${200 + scrollProgress * 60}, 70%, 60%)`
            });
        }
    }

    animate(time) {
        this.trails = this.trails.filter(trail => {
            trail.x += trail.vx;
            trail.y += trail.vy;
            trail.life -= 0.02;
            return trail.life > 0;
        });
    }

    render(ctx) {
        this.trails.forEach(trail => {
            ctx.save();
            ctx.globalAlpha = trail.life;
            ctx.fillStyle = trail.color;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    resize(width, height) {
        // Filter out off-screen trails
        this.trails = this.trails.filter(trail =>
            trail.x >= 0 && trail.x <= width && trail.y >= 0 && trail.y <= height
        );
    }
}

class MorphingShapeAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.shapes = [];
        this.scrollProgress = 0;

        // Create morphing shapes
        for (let i = 0; i < 5; i++) {
            this.shapes.push({
                x: Math.random() * canvas.clientWidth,
                y: Math.random() * canvas.clientHeight,
                radius: Math.random() * 50 + 20,
                sides: Math.floor(Math.random() * 6) + 3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                morphPhase: Math.random() * Math.PI * 2,
                color: `hsla(${Math.random() * 360}, 70%, 60%, 0.3)`
            });
        }
    }

    update(scrollProgress) {
        this.scrollProgress = scrollProgress;
    }

    animate(time) {
        this.shapes.forEach(shape => {
            shape.rotation += shape.rotationSpeed;
            shape.morphPhase += 0.03;

            // Morph the shape based on scroll progress
            const morphAmount = this.scrollProgress * Math.sin(shape.morphPhase);
            shape.currentRadius = shape.radius + morphAmount * 20;
        });
    }

    render(ctx) {
        this.shapes.forEach(shape => {
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation);

            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let i = 0; i <= shape.sides; i++) {
                const angle = (i / shape.sides) * Math.PI * 2;
                const radius = shape.currentRadius || shape.radius;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
            ctx.restore();
        });
    }

    resize(width, height) {
        // Reposition shapes within new bounds
        this.shapes.forEach(shape => {
            shape.x = Math.min(shape.x, width);
            shape.y = Math.min(shape.y, height);
        });
    }
}

// Initialize Canvas Animations
let canvasAnimations = null;

function initCanvasAnimations() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.warn('Hero canvas not found for Canvas Animations');
        return;
    }

    try {
        canvasAnimations = new CanvasAnimations(canvas);
        canvasAnimations.start();
        console.log('Canvas Animations initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Canvas Animations:', error);
    }
}

// Theme integration
function updateCanvasTheme(themeColors) {
    if (canvasAnimations) {
        canvasAnimations.updateTheme(themeColors);
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.CanvasAnimations = CanvasAnimations;
    window.initCanvasAnimations = initCanvasAnimations;
    window.updateCanvasTheme = updateCanvasTheme;
}

// Auto-initialize as fallback
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.webGLEffects) {
            initCanvasAnimations();
        }
    }, 1500);
});
