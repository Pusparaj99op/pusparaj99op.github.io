/**
 * Portfolio Website - Three.js Background Animation
 * Creates an interactive 3D background for the hero section
 * Version: 1.0
 * Last Modified: August 24, 2025
 */

class ThreeBackground {
    constructor() {
        this.container = document.getElementById('hero-canvas');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;
        this.particles = [];
        this.particleCount = this.calculateParticleCount();

        this.init();
    }

    calculateParticleCount() {
        // Adjust particle count based on screen size
        const baseCount = 100;
        const multiplier = Math.min(window.innerWidth / 1920, 1);
        return Math.floor(baseCount * multiplier);
    }

    init() {
        if (!this.container) return;

        // Initialize scene, camera, and renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 30;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

        // Create and add particles
        this.createParticles();

        // Add event listeners
        this.addEventListeners();

        // Start animation loop
        this.animate();

        // Theme adaptation
        this.adaptToTheme();
    }

    createParticles() {
        // Get current theme
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const colors = this.getThemeColors(currentTheme);

        // Create particles
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const particleSizes = [];
        const particleColors = [];

        for (let i = 0; i < this.particleCount; i++) {
            // Random position within a sphere
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 50;

            vertices.push(x, y, z);

            // Random size
            particleSizes.push(Math.random() * 2 + 0.5);

            // Random color from theme
            const color = colors[Math.floor(Math.random() * colors.length)];
            particleColors.push(color.r, color.g, color.b);
        }

        // Add attributes to geometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

        // Create shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;

                    // Subtle wave motion
                    pos.x += sin(pos.y * 0.05 + time * 0.2) * 0.5;
                    pos.y += sin(pos.x * 0.05 + time * 0.2) * 0.5;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (1.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    // Circular particle
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Soft edge
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        // Create particle system
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    getThemeColors(theme) {
        // Define color schemes for each theme
        const colorSchemes = {
            light: [
                { r: 0.29, g: 0.38, b: 0.99 }, // Primary
                { r: 1.0, g: 0.42, b: 0.42 },  // Secondary
                { r: 0.23, g: 0.31, b: 0.85 }, // Primary dark
                { r: 0.9, g: 0.33, b: 0.33 }   // Secondary dark
            ],
            dark: [
                { r: 0.42, g: 0.49, b: 0.99 }, // Primary
                { r: 1.0, g: 0.42, b: 0.42 },  // Secondary
                { r: 0.32, g: 0.38, b: 0.84 }, // Primary dark
                { r: 0.9, g: 0.33, b: 0.33 }   // Secondary dark
            ],
            neon: [
                { r: 0.0, g: 0.96, b: 0.83 },  // Primary
                { r: 0.95, g: 0.0, b: 0.54 },  // Secondary
                { r: 0.0, g: 0.77, b: 0.66 },  // Primary dark
                { r: 0.79, g: 0.0, b: 0.43 }   // Secondary dark
            ],
            minimal: [
                { r: 0.13, g: 0.13, b: 0.13 }, // Primary
                { r: 0.4, g: 0.4, b: 0.4 },    // Secondary
                { r: 0.07, g: 0.07, b: 0.07 }, // Primary dark
                { r: 0.27, g: 0.27, b: 0.27 }  // Secondary dark
            ]
        };

        return colorSchemes[theme] || colorSchemes.light;
    }

    addEventListeners() {
        // Mouse move event for parallax effect
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.width, this.height);
        });

        // Theme change event
        document.addEventListener('themeChange', () => {
            this.adaptToTheme();
        });

        // Listen for theme changes through DOM mutation
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.adaptToTheme();
                }
            });
        });

        observer.observe(document.body, { attributes: true });
    }

    adaptToTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const colors = this.getThemeColors(currentTheme);

        if (this.particleSystem) {
            const particleColors = this.particleSystem.geometry.attributes.color;
            const colorArray = particleColors.array;

            for (let i = 0; i < this.particleCount; i++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                colorArray[i * 3] = color.r;
                colorArray[i * 3 + 1] = color.g;
                colorArray[i * 3 + 2] = color.b;
            }

            particleColors.needsUpdate = true;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update time uniform for shader animation
        if (this.particleSystem) {
            this.particleSystem.material.uniforms.time.value += 0.01;
        }

        // Rotate particle system based on mouse position
        if (this.particleSystem) {
            this.particleSystem.rotation.x += (this.mouseY * 0.01 - this.particleSystem.rotation.x) * 0.05;
            this.particleSystem.rotation.y += (this.mouseX * 0.01 - this.particleSystem.rotation.y) * 0.05;
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the Three.js background when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ThreeBackground();
    }, 100);
});
