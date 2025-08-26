/**
 * 3D Animated Background
 * Creates an immersive 3D background with Three.js
 * Version: 1.0
 * Last Modified: August 26, 2025
 */

class AnimatedBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            70,
            this.width / this.height,
            0.1,
            2000
        );
        this.camera.position.z = 500;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        this.renderer.setClearColor(0x000000, 0); // Transparent background

        // Add lights
        this.addLights();

        // Create background objects
        this.createObjects();

        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start animation loop
        this.animate();

        console.log('3D Background initialized successfully');
    }

    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 5);
        this.scene.add(directionalLight);

        // Point lights with different colors
        const colors = [0x6a7dfe, 0x78fd61, 0xff6b6b];

        colors.forEach((color, index) => {
            const light = new THREE.PointLight(color, 1, 500);
            light.position.set(
                Math.sin(Math.PI * 2 / 3 * index) * 200,
                Math.cos(Math.PI * 2 / 3 * index) * 200,
                100
            );
            this.scene.add(light);

            // Store light for animation
            if (!this.lights) this.lights = [];
            this.lights.push(light);
        });
    }

    createObjects() {
        // Create particles
        this.createParticles();

        // Create floating shapes
        this.createFloatingShapes();
    }

    createParticles() {
        const particleCount = 2000; // Increased particle count
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 2000; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1000; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z

            // Colors - mix of blues, purples, and whites
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                // Blue particles
                colors[i * 3] = 0.4; // r
                colors[i * 3 + 1] = 0.6; // g
                colors[i * 3 + 2] = 1.0; // b
            } else if (colorChoice < 0.6) {
                // Purple particles
                colors[i * 3] = 0.8; // r
                colors[i * 3 + 1] = 0.4; // g
                colors[i * 3 + 2] = 1.0; // b
            } else {
                // White particles
                colors[i * 3] = 1.0; // r
                colors[i * 3 + 1] = 1.0; // g
                colors[i * 3 + 2] = 1.0; // b
            }

            // Size
            sizes[i] = Math.random() * 8 + 2; // Larger particles
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Enhanced particle material
        const particleMaterial = new THREE.PointsMaterial({
            size: 8, // Larger base size
            transparent: true,
            opacity: 0.8, // More visible
            vertexColors: true, // Use vertex colors
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            alphaTest: 0.001
        });

        // Create points system
        this.particles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particles);

        console.log(`Created ${particleCount} particles`);
    }

    createFloatingShapes() {
        this.shapes = [];
        const geometries = [
            new THREE.IcosahedronGeometry(40, 0),
            new THREE.OctahedronGeometry(40, 0),
            new THREE.TetrahedronGeometry(40, 0)
        ];

        // Create several shapes and position them randomly
        for (let i = 0; i < 15; i++) { // More shapes
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];

            // Create different materials for variety
            let material;
            const materialType = Math.random();

            if (materialType < 0.4) {
                // Wireframe material
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                    transparent: true,
                    opacity: 0.4,
                    wireframe: true
                });
            } else if (materialType < 0.8) {
                // Solid material with emissive glow
                material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
                    transparent: true,
                    opacity: 0.3,
                    emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.1)
                });
            } else {
                // Points material for particle-like shapes
                material = new THREE.PointsMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.9, 0.7),
                    size: 3,
                    transparent: true,
                    opacity: 0.8
                });
            }

            const mesh = materialType < 0.8 ?
                new THREE.Mesh(geometry, material) :
                new THREE.Points(geometry, material);

            // Random position
            mesh.position.set(
                (Math.random() - 0.5) * 1500,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 800
            );

            // Random rotation
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Random scale
            const scale = 0.3 + Math.random() * 1.2;
            mesh.scale.set(scale, scale, scale);

            // Add to scene and store for animation
            this.scene.add(mesh);
            this.shapes.push({
                mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.008,
                    y: (Math.random() - 0.5) * 0.008,
                    z: (Math.random() - 0.5) * 0.008
                },
                initialPosition: {
                    x: mesh.position.x,
                    y: mesh.position.y,
                    z: mesh.position.z
                }
            });
        }

        console.log(`Created ${this.shapes.length} floating shapes`);
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouseX = (event.clientX / this.width) * 2 - 1;
        this.mouseY = -(event.clientY / this.height) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        // Animate particles
        this.particles.rotation.y += 0.0005;

        // Animate shapes
        if (this.shapes) {
            const time = Date.now() * 0.001;

            this.shapes.forEach(shape => {
                // Rotate
                shape.mesh.rotation.x += shape.rotationSpeed.x;
                shape.mesh.rotation.y += shape.rotationSpeed.y;
                shape.mesh.rotation.z += shape.rotationSpeed.z;

                // Float up and down
                shape.mesh.position.y = shape.initialPosition.y + Math.sin(time + shape.initialPosition.x) * 20;

                // React to mouse position
                shape.mesh.position.x += (this.mouseX * 10 - shape.mesh.position.x) * 0.01;
                shape.mesh.position.z += (this.mouseY * 10 - shape.mesh.position.z) * 0.01;
            });
        }

        // Animate lights
        if (this.lights) {
            const time = Date.now() * 0.001;

            this.lights.forEach((light, index) => {
                light.position.x = Math.sin(time * 0.5 + index * Math.PI * 2 / 3) * 200;
                light.position.y = Math.cos(time * 0.5 + index * Math.PI * 2 / 3) * 200;
            });
        }

        // Move camera based on mouse position
        this.camera.position.x += (this.mouseX * 50 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 50 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize animated background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure canvas is ready
    setTimeout(() => {
        const canvas = document.getElementById('hero-canvas');
        if (canvas) {
            const background = new AnimatedBackground('hero-canvas');
            console.log('AnimatedBackground initialized');
        } else {
            console.error('Hero canvas not found!');
        }
    }, 500);
});

// Also try on window load as fallback
window.addEventListener('load', () => {
    setTimeout(() => {
        const canvas = document.getElementById('hero-canvas');
        if (canvas && !canvas.hasAttribute('data-initialized')) {
            canvas.setAttribute('data-initialized', 'true');
            const background = new AnimatedBackground('hero-canvas');
            console.log('AnimatedBackground initialized on window load');
        }
    }, 1000);
});
