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
        this.meshes = [];
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.scrollY = 0;
        this.currentIntersect = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        const canvas = document.getElementById('enhanced-3d-canvas');
        if (!canvas) {
            // Create canvas if it doesn't exist
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'enhanced-3d-canvas';
            newCanvas.style.position = 'fixed';
            newCanvas.style.top = '0';
            newCanvas.style.left = '0';
            newCanvas.style.width = '100%';
            newCanvas.style.height = '100%';
            newCanvas.style.zIndex = '1';
            newCanvas.style.pointerEvents = 'none';
            document.body.appendChild(newCanvas);
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
        this.createScrollElements();
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
        // Create floating geometric shapes that respond to mouse
        const shapes = [
            new THREE.BoxGeometry(8, 8, 8),
            new THREE.SphereGeometry(5, 16, 16),
            new THREE.ConeGeometry(4, 10, 8),
            new THREE.OctahedronGeometry(6),
            new THREE.TorusGeometry(6, 2, 8, 16)
        ];

        shapes.forEach((geometry, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(index * 0.2, 0.7, 0.6),
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (index - 2) * 40,
                Math.sin(index) * 20,
                -80 + index * 10
            );

            mesh.userData = {
                originalPosition: mesh.position.clone(),
                hoverScale: 1,
                rotationSpeed: Math.random() * 0.02 + 0.01
            };

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.scene.add(mesh);
            this.meshes.push(mesh);
        });
    }

    createScrollElements() {
        // Create elements that animate based on scroll position
        const scrollGeometry = new THREE.RingGeometry(10, 15, 32);
        const scrollMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF6B9D,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });

        for (let i = 0; i < 5; i++) {
            const ring = new THREE.Mesh(scrollGeometry, scrollMaterial.clone());
            ring.position.set(
                Math.sin(i * Math.PI * 0.4) * 60,
                i * 100 - 200,
                Math.cos(i * Math.PI * 0.4) * 30
            );
            
            ring.userData = {
                scrollOffset: i * 0.2,
                originalY: ring.position.y
            };

            this.scene.add(ring);
            this.meshes.push(ring);
        }
    }

    setupEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Touch events for mobile
        window.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsedTime = this.clock.getElapsedTime();

        // Update particle systems
        this.updateParticles(elapsedTime);

        // Update interactive meshes
        this.updateMeshes(elapsedTime);

        // Update scroll-based animations
        this.updateScrollAnimations();

        // Update camera based on mouse
        this.updateCamera();

        // Raycast for interactions
        this.updateRaycasting();

        this.renderer.render(this.scene, this.camera);
    }

    updateParticles(time) {
        this.particles.forEach(particleSystem => {
            if (particleSystem.material) {
                particleSystem.material.uniforms.time.value = time;
            }
            
            if (particleSystem.nodes) {
                // Update connected particles
                particleSystem.nodes.forEach(node => {
                    node.position.add(node.userData.velocity);
                    
                    // Bounce off boundaries
                    if (Math.abs(node.position.x) > 50) node.userData.velocity.x *= -1;
                    if (Math.abs(node.position.y) > 50) node.userData.velocity.y *= -1;
                    if (Math.abs(node.position.z) > 25) node.userData.velocity.z *= -1;
                });
            }
        });
    }

    updateMeshes(time) {
        this.meshes.forEach((mesh, index) => {
            // Basic rotation
            if (mesh.userData.rotationSpeed) {
                mesh.rotation.x += mesh.userData.rotationSpeed;
                mesh.rotation.y += mesh.userData.rotationSpeed * 0.7;
            }

            // Morphing animation
            if (mesh.userData.morphSpeed) {
                mesh.scale.setScalar(1 + Math.sin(time * mesh.userData.morphSpeed) * 0.1);
            }

            // Hover effects
            if (mesh.userData.hoverScale) {
                const targetScale = mesh === this.currentIntersect ? 1.2 : 1;
                mesh.userData.hoverScale += (targetScale - mesh.userData.hoverScale) * 0.1;
                mesh.scale.multiplyScalar(mesh.userData.hoverScale);
            }

            // Floating animation
            if (mesh.userData.originalPosition) {
                mesh.position.y = mesh.userData.originalPosition.y + Math.sin(time + index) * 5;
            }
        });
    }

    updateScrollAnimations() {
        const scrollProgress = this.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        this.meshes.forEach(mesh => {
            if (mesh.userData.scrollOffset !== undefined) {
                const offset = mesh.userData.scrollOffset;
                mesh.rotation.z = scrollProgress * Math.PI * 2 + offset;
                mesh.position.y = mesh.userData.originalY - scrollProgress * 200;
                
                // Fade based on scroll
                if (mesh.material.opacity !== undefined) {
                    mesh.material.opacity = Math.max(0.1, 1 - scrollProgress);
                }
            }
        });

        // Update camera position based on scroll
        this.camera.position.z = 100 - scrollProgress * 50;
    }

    updateCamera() {
        // Smooth camera movement based on mouse
        const targetX = this.mouse.x * 20;
        const targetY = this.mouse.y * 10;
        
        this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
        
        this.camera.lookAt(0, 0, 0);
    }

    updateRaycasting() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.meshes);

        if (intersects.length > 0) {
            if (this.currentIntersect !== intersects[0].object) {
                this.currentIntersect = intersects[0].object;
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (this.currentIntersect) {
                this.currentIntersect = null;
                document.body.style.cursor = 'default';
            }
        }
    }

    // Public methods for external control
    addScrollTrigger(element, animationType = 'fadeIn') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(animationType);
                }
            });
        });

        observer.observe(element);
    }

    triggerElementAnimation(type) {
        switch (type) {
            case 'explosion':
                this.createExplosionEffect();
                break;
            case 'wave':
                this.createWaveEffect();
                break;
            case 'spiral':
                this.createSpiralEffect();
                break;
            default:
                this.createFadeEffect();
        }
    }

    createExplosionEffect() {
        const explosionParticles = new THREE.Group();
        
        for (let i = 0; i < 50; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(0, 0, 0);
            
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize();
            
            particle.userData = {
                velocity: direction.multiplyScalar(Math.random() * 20 + 10),
                life: 1.0
            };
            
            explosionParticles.add(particle);
        }
        
        this.scene.add(explosionParticles);
        
        // Animate explosion
        const animateExplosion = () => {
            explosionParticles.children.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                particle.userData.velocity.multiplyScalar(0.98);
                particle.userData.life -= 0.02;
                particle.material.opacity = particle.userData.life;
                
                if (particle.userData.life <= 0) {
                    explosionParticles.remove(particle);
                }
            });
            
            if (explosionParticles.children.length > 0) {
                requestAnimationFrame(animateExplosion);
            } else {
                this.scene.remove(explosionParticles);
            }
        };
        
        animateExplosion();
    }

    createWaveEffect() {
        // Create a wave of energy that ripples through the scene
        const waveGeometry = new THREE.RingGeometry(0, 1, 32);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0x4ECDC4,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.set(0, 0, 0);
        this.scene.add(wave);
        
        let scale = 0;
        const animateWave = () => {
            scale += 2;
            wave.scale.setScalar(scale);
            wave.material.opacity = Math.max(0, 0.8 - scale * 0.01);
            
            if (wave.material.opacity > 0) {
                requestAnimationFrame(animateWave);
            } else {
                this.scene.remove(wave);
            }
        };
        
        animateWave();
    }

    createSpiralEffect() {
        const spiralGroup = new THREE.Group();
        
        for (let i = 0; i < 100; i++) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(i * 0.01, 0.8, 0.6)
            });
            
            const cube = new THREE.Mesh(geometry, material);
            const angle = i * 0.1;
            const radius = i * 0.5;
            
            cube.position.set(
                Math.cos(angle) * radius,
                i * 2 - 100,
                Math.sin(angle) * radius
            );
            
            cube.userData = {
                originalPosition: cube.position.clone(),
                angle: angle,
                speed: Math.random() * 0.05 + 0.02
            };
            
            spiralGroup.add(cube);
        }
        
        this.scene.add(spiralGroup);
        
        let time = 0;
        const animateSpiral = () => {
            time += 0.02;
            
            spiralGroup.children.forEach((cube, index) => {
                const newAngle = cube.userData.angle + time * cube.userData.speed;
                const radius = index * 0.5;
                
                cube.position.set(
                    Math.cos(newAngle) * radius,
                    cube.userData.originalPosition.y + Math.sin(time + index * 0.1) * 5,
                    Math.sin(newAngle) * radius
                );
                
                cube.rotation.x += 0.02;
                cube.rotation.y += 0.03;
            });
            
            if (time < 10) {
                requestAnimationFrame(animateSpiral);
            } else {
                this.scene.remove(spiralGroup);
            }
        };
        
        animateSpiral();
    }

    createFadeEffect() {
        // Simple fade effect for default animations
        this.meshes.forEach(mesh => {
            if (mesh.material.transparent) {
                const originalOpacity = mesh.material.opacity;
                mesh.material.opacity = 0;
                
                const fadeIn = () => {
                    mesh.material.opacity += 0.02;
                    if (mesh.material.opacity < originalOpacity) {
                        requestAnimationFrame(fadeIn);
                    } else {
                        mesh.material.opacity = originalOpacity;
                    }
                };
                
                fadeIn();
            }
        });
    }
}

// Initialize enhanced 3D effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        window.enhanced3D = new Enhanced3DEffects();
        
        // Set up scroll triggers for different sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            const animationType = ['explosion', 'wave', 'spiral', 'fadeIn'][index % 4];
            window.enhanced3D.addScrollTrigger(section, animationType);
        });
    }
});
