/**
 * Enhanced 3D Effects System
 * Advanced 3D animations, scroll-triggered effects, and interactive elements
 */

class Enhanced3DEffects {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.interactiveMeshes = []; // Renamed from this.meshes for clarity
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.scrollY = 0;
        this.currentIntersect = null;
        this.isDisposed = false; // Flag to prevent multiple disposals

        // Singleton pattern: Ensure only one instance is created
        if (Enhanced3DEffects.instance) {
            // Optionally, log a warning or handle as needed
            console.warn("Enhanced3DEffects instance already exists. Disposing new one.");
            this.dispose(); // Dispose this new instance
            return Enhanced3DEffects.instance;
        }
        Enhanced3DEffects.instance = this;

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        const canvasId = 'enhanced-3d-canvas';
        let canvas = document.getElementById(canvasId);

        if (!canvas) {
            // console.log("Enhanced3DEffects: Canvas not found, creating one.");
            // canvas = document.createElement('canvas');
            // canvas.id = canvasId;
            // canvas.style.position = 'fixed';
            // canvas.style.top = '0';
            // canvas.style.left = '0';
            // canvas.style.width = '100%';
            // canvas.style.height = '100%';
            // canvas.style.zIndex = '0'; // Ensure it's behind content
            // canvas.style.pointerEvents = 'none'; // Allow interaction with elements on top
            // document.body.insertBefore(canvas, document.body.firstChild); // Insert at the beginning
            console.warn("Enhanced3DEffects: Canvas with ID 'enhanced-3d-canvas' not found. Effects will not be initialized.");
            this.dispose(); // Dispose if canvas is not found
            return;
        }

        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup with enhanced settings
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 0, 100);

        // Enhanced renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas || document.getElementById('enhanced-3d-canvas'),
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Create enhanced lighting
        this.setupLighting();
        
        // Create advanced particle systems
        this.createParticleSystem();
        
        // Create interactive 3D meshes
        this.createInteractiveMeshes();
        
        // Create scroll-triggered 3D elements
        // this.createScrollElements(); // Commented out as per removal request
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Directional light with shadows
        const directionalLight = new THREE.DirectionalLight(0x6C63FF, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for dynamic effects
        const pointLight1 = new THREE.PointLight(0xFF6B9D, 0.8, 100);
        pointLight1.position.set(30, 0, 30);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4ECDC4, 0.8, 100);
        pointLight2.position.set(-30, 0, 30);
        this.scene.add(pointLight2);
    }

    createParticleSystem() {
        // Create multiple particle systems with different behaviors
        this.createFloatingParticles();
        this.createConnectedParticles();
        this.createMorphingParticles();
    }

    createFloatingParticles() {
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 200;
            positions[i3 + 1] = (Math.random() - 0.5) * 200;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;
            
            // Colors
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.7, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Add floating animation
                    mvPosition.y += sin(time + position.x * 0.01) * 5.0;
                    mvPosition.x += cos(time + position.z * 0.01) * 3.0;
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                    float strength = 0.05 / distanceToCenter - 0.1;
                    
                    gl_FragColor = vec4(vColor, strength);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push({ mesh: particles, material: material });
    }

    createConnectedParticles() {
        const nodeCount = 50;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 8, 6);
            const material = new THREE.MeshLambertMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                transparent: true,
                opacity: 0.7
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 50
            );
            
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1,
                    (Math.random() - 0.5) * 0.1
                )
            };
            
            this.scene.add(mesh);
            nodes.push(mesh);
        }

        // Create connections between nearby nodes
        this.createNodeConnections(nodes);
        this.particles.push({ nodes: nodes, type: 'connected' });
    }

    createNodeConnections(nodes) {
        const connectionGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                
                if (distance < 30) {
                    positions.push(
                        nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                        nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                    );
                    
                    const alpha = 1 - (distance / 30);
                    colors.push(0.4, 0.8, 1, alpha, 0.4, 0.8, 1, alpha);
                }
            }
        }

        connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        connectionGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

        const connectionMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3
        });

        const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
        this.scene.add(connections);
    }

    createMorphingParticles() {
        const geometry = new THREE.IcosahedronGeometry(15, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x6C63FF,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(50, 0, -50);
        
        mesh.userData = {
            morphSpeed: Math.random() * 0.02 + 0.01,
            rotationSpeed: Math.random() * 0.02 + 0.01
        };

        this.scene.add(mesh);
        this.meshes.push(mesh);
    }

    createInteractiveMeshes() {
        // Simplified: Create fewer, less complex meshes or remove them entirely
        // For now, we will remove the creation of these meshes to disable the Figma-like feature.
        this.interactiveMeshes = []; 

        /* Example of how you might add a simple mesh if desired later:
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.1 });
        const simpleMesh = new THREE.Mesh(geometry, material);
        simpleMesh.position.set(0, 0, -20);
        this.scene.add(simpleMesh);
        this.interactiveMeshes.push(simpleMesh);
        */
    }

    // createScrollElements() { // Commented out as per removal request
    //     // ... existing scroll elements creation ...
    // }

    setupEventListeners() {
        if (this.isDisposed) return;
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        // window.addEventListener('scroll', this.onScroll.bind(this), false); // Commented out scroll listener
    }

    onMouseMove(event) {
        if (this.isDisposed) return;
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycasting for hover effects (Simplified or removed if no interactive meshes)
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveMeshes);

        if (intersects.length > 0) {
            if (this.currentIntersect !== intersects[0].object) {
                // Optional: Handle hover on any remaining simple meshes
                // intersects[0].object.material.color.set(0xff0000); // Example: change color
                this.currentIntersect = intersects[0].object;
                document.body.style.cursor = 'pointer'; // Or 'grab' if it makes sense
            }
        } else {
            if (this.currentIntersect) {
                // Optional: Revert hover effect
                // this.currentIntersect.material.color.set(0x00ff00); // Example: revert color
            }
            this.currentIntersect = null;
            document.body.style.cursor = 'default';
        }
    }

    // onScroll() { // Commented out as per removal request
    //     if (this.isDisposed) return;
    //     this.scrollY = window.scrollY;
    //     // ... existing scroll animation logic ...
    // }

    animate() {
        if (this.isDisposed) return;
        requestAnimationFrame(this.animate.bind(this));
        const delta = this.clock.getDelta();

        // Animate particles
        this.particles.forEach(particleSystem => {
            if (particleSystem.material.uniforms && particleSystem.material.uniforms.time) {
                particleSystem.material.uniforms.time.value += delta * 0.5;
            }
            // Add any other particle animation logic here
        });

        // Animate interactive meshes (if any remain)
        this.interactiveMeshes.forEach(mesh => {
            // mesh.rotation.x += 0.005;
            // mesh.rotation.y += 0.005;
        });

        // Animate scroll elements (if any remain)
        // this.scrollElements.forEach(element => { ... });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (this.isDisposed) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    dispose() {
        if (this.isDisposed) return;
        this.isDisposed = true;

        console.log("Disposing Enhanced3DEffects...");

        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        // window.removeEventListener('scroll', this.onScroll.bind(this)); // Ensure scroll listener is removed

        // Dispose Three.js objects
        if (this.scene) {
            this.scene.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            this.scene.clear(); // Clears the scene of all objects
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            // Remove canvas if it was created by this script and is not the one from HTML
            const canvas = document.getElementById('enhanced-3d-canvas');
            if (canvas && canvas.parentElement && canvas.dataset.createdByScript === "true") {
                // canvas.parentElement.removeChild(canvas);
            } else if (canvas) {
                // Clear the canvas context if it's not removed
                const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
                if (context) {
                    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT | context.STENCIL_BUFFER_BIT);
                }
            }
        }

        // Nullify properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.interactiveMeshes = [];
        // this.scrollElements = [];
        this.clock = null;
        this.raycaster = null;

        // Reset singleton instance
        if (Enhanced3DEffects.instance === this) {
            Enhanced3DEffects.instance = null;
        }
        console.log("Enhanced3DEffects disposed.");
    }
}

// Initialize on DOMContentLoaded if canvas exists
// Ensure this script runs after the canvas element is in the DOM.
// If the canvas is critical, consider moving this to a more robust initialization strategy.
// For now, we rely on the script being deferred or placed at the end of the body.

let enhanced3DEffectsInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('enhanced-3d-canvas');
    if (canvas) {
        // enhanced3DEffectsInstance = new Enhanced3DEffects();
        // To effectively remove the effects, we will not initialize it here.
        // If an old instance exists, try to dispose it.
        if (Enhanced3DEffects.instance) {
            Enhanced3DEffects.instance.dispose();
        }
        console.log("Enhanced3DEffects initialization skipped to remove effects.");
        // Optionally, hide or remove the canvas if it's solely for these effects
        // canvas.style.display = 'none'; 
    } else {
        console.warn("Enhanced3DEffects: Canvas 'enhanced-3d-canvas' not found on DOMContentLoaded. Effects not initialized.");
    }
});

// Optional: Provide a global function to manually dispose of the effects if needed
function removeEnhanced3DEffects() {
    if (Enhanced3DEffects.instance) {
        Enhanced3DEffects.instance.dispose();
    }
    const canvas = document.getElementById('enhanced-3d-canvas');
    if (canvas) {
        // canvas.style.display = 'none'; // Or remove it
    }
    console.log("Attempted to remove Enhanced3DEffects.");
}
