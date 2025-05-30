// 3D Background Animation System with Post-Processing Effects
class ThreeDBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null; // Post-processing composer
        this.objects = [];
        this.particleSystem = null;
        this.animationId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        
        // Performance optimization settings
        this.performanceLevel = window.performanceOptimizer?.getOptimizationLevel() || 'low';
        this.particleMultiplier = window.performanceMultiplier || 1.0;
        this.shouldDisablePostProcessing = window.disablePostProcessing || false;
        
        this.init();
        if (!this.shouldDisablePostProcessing) {
            this.setupPostProcessing();
        }
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        const canvas = document.getElementById('three-bg');
        if (!canvas) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create floating objects
        this.createFloatingObjects();
          // Enhanced lighting setup for premium quality
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // Primary directional light
        const directionalLight = new THREE.DirectionalLight(0x6C63FF, 1.2);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Secondary accent light
        const pointLight = new THREE.PointLight(0x00E0FF, 1.0, 15);
        pointLight.position.set(-5, -5, 2);
        this.scene.add(pointLight);
        
        // Additional rim light for depth
        const rimLight = new THREE.SpotLight(0xFF6B6B, 0.8, 20, Math.PI / 6, 0.2, 1);
        rimLight.position.set(3, 8, 4);
        rimLight.target.position.set(0, 0, 0);
        this.scene.add(rimLight);
        this.scene.add(rimLight.target);
        
        // Environment mapping for reflections
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        const environment = pmremGenerator.fromScene(this.scene, 0.04).texture;
        this.scene.environment = environment;
    }
      createFloatingObjects() {
        // High-poly geometries for premium quality
        const geometries = [
            new THREE.BoxGeometry(0.3, 0.3, 0.3, 4, 4, 4), // Increased segments
            new THREE.SphereGeometry(0.2, 32, 32), // High-poly sphere (was 16, 16)
            new THREE.ConeGeometry(0.2, 0.4, 16), // Increased segments from 8 to 16
            new THREE.OctahedronGeometry(0.25, 2), // Added detail level
            new THREE.TetrahedronGeometry(0.3, 1), // Added detail level
            new THREE.TorusGeometry(0.2, 0.08, 16, 32), // Increased segments (was 8, 16)
            new THREE.DodecahedronGeometry(0.25, 1), // New high-detail shape
            new THREE.IcosahedronGeometry(0.25, 2), // New high-detail shape
            new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16), // New cylindrical shape
            new THREE.TorusKnotGeometry(0.15, 0.05, 64, 16) // Complex high-detail shape
        ];
        
        // Enhanced materials with better visual effects
        const materials = [
            new THREE.MeshPhysicalMaterial({ 
                color: 0x6C63FF, 
                transparent: true, 
                opacity: 0.8,
                metalness: 0.3,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            }),
            new THREE.MeshPhysicalMaterial({ 
                color: 0x00E0FF, 
                transparent: true, 
                opacity: 0.7,
                metalness: 0.5,
                roughness: 0.1,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2
            }),
            new THREE.MeshPhysicalMaterial({ 
                color: 0xFF6B6B, 
                transparent: true, 
                opacity: 0.6,
                metalness: 0.2,
                roughness: 0.3,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1
            }),
            new THREE.MeshPhysicalMaterial({ 
                color: 0x4ECDC4, 
                transparent: true, 
                opacity: 0.7,
                metalness: 0.4,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            }),
            new THREE.MeshPhysicalMaterial({ 
                color: 0xFFD93D, 
                transparent: true, 
                opacity: 0.6,
                metalness: 0.6,
                roughness: 0.1,
                clearcoat: 0.7,
                clearcoatRoughness: 0.2
            })
        ];
          // Create multiple high-quality floating objects
        const baseObjectCount = 35;
        const objectCount = this.performanceLevel === 'high' ? 15 : 
                           this.performanceLevel === 'medium' ? 25 : baseObjectCount;
        
        for (let i = 0; i < objectCount; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Enhanced positioning with better distribution
            mesh.position.x = (Math.random() - 0.5) * 25;
            mesh.position.y = (Math.random() - 0.5) * 25;
            mesh.position.z = (Math.random() - 0.5) * 18;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            // Enhanced animation properties
            mesh.userData = {
                originalX: mesh.position.x,
                originalY: mesh.position.y,
                originalZ: mesh.position.z,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.015,
                    y: (Math.random() - 0.5) * 0.015,
                    z: (Math.random() - 0.5) * 0.015
                },
                floatSpeed: Math.random() * 0.018 + 0.008,
                floatRange: Math.random() * 2.5 + 1.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                originalScale: 1.0
            };
            
            this.objects.push(mesh);
            this.scene.add(mesh);
        }
        
        // Create enhanced particle system
        this.createParticleSystem();
    }      createParticleSystem() {
        // Skip particle system on high optimization
        if (this.performanceLevel === 'high') {
            return;
        }
        
        // Enhanced particle system with multiple layers
        const baseParticleCount = 200;
        const particleCount = Math.floor(baseParticleCount * this.particleMultiplier);
        const particleGroups = [];
        
        // Reduce groups based on performance level
        const groupCount = this.performanceLevel === 'medium' ? 2 : 3;
        
        // Create multiple particle systems with different properties
        for (let group = 0; group < groupCount; group++) {
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Position
                positions[i3] = (Math.random() - 0.5) * 60;     // x
                positions[i3 + 1] = (Math.random() - 0.5) * 60; // y
                positions[i3 + 2] = (Math.random() - 0.5) * 60; // z
                
                // Colors based on group
                const groupColors = [
                    [0.42, 0.39, 1.0],  // Purple
                    [0.0, 0.88, 1.0],   // Cyan
                    [1.0, 0.42, 0.42]   // Red
                ];
                colors[i3] = groupColors[group][0];
                colors[i3 + 1] = groupColors[group][1];
                colors[i3 + 2] = groupColors[group][2];
                
                // Size variation
                sizes[i] = Math.random() * 0.08 + 0.02;
            }
            
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            // Enhanced particle material with vertex colors
            const particleMaterial = new THREE.PointsMaterial({
                size: 0.1,
                transparent: true,
                opacity: 0.4 + group * 0.2,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                sizeAttenuation: true
            });
            
            const particleSystem = new THREE.Points(particles, particleMaterial);
            this.scene.add(particleSystem);
            
            particleGroups.push({
                system: particleSystem,
                geometry: particles,
                positions: positions,
                rotationSpeed: 0.0005 + group * 0.0003,
                floatSpeed: 0.001 + group * 0.0005
            });
        }
        
        // Store for animation
        this.particleGroups = particleGroups;
        
        // Add star field for depth
        this.createStarField();
    }
    
    createStarField() {
        const starCount = 500;
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 200;     // x
            starPositions[i + 1] = (Math.random() - 0.5) * 200; // y
            starPositions[i + 2] = (Math.random() - 0.5) * 200; // z
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    }
      animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Animate objects with enhanced effects
        this.objects.forEach((object, index) => {
            // Enhanced rotation animation
            object.rotation.x += object.userData.rotationSpeed.x;
            object.rotation.y += object.userData.rotationSpeed.y;
            object.rotation.z += object.userData.rotationSpeed.z;
            
            // Enhanced floating animation
            const floatOffset = Math.sin(this.time * object.userData.floatSpeed + index) * object.userData.floatRange;
            object.position.y = object.userData.originalY + floatOffset;
            
            // Pulsing scale animation for premium effect
            const pulseScale = 1 + Math.sin(this.time * object.userData.pulseSpeed + index * 0.5) * 0.1;
            object.scale.setScalar(object.userData.originalScale * pulseScale);
            
            // Enhanced mouse interaction with depth
            const mouseInfluence = 0.0008;
            const depthInfluence = (index % 4 + 1) * 0.5;
            object.position.x = object.userData.originalX + this.mouseX * mouseInfluence * depthInfluence;
            object.position.z = object.userData.originalZ + this.mouseY * mouseInfluence * depthInfluence;
            
            // Color pulsing for premium visual effect
            if (object.material.emissive) {
                const emissiveIntensity = Math.sin(this.time * 0.003 + index) * 0.1 + 0.05;
                object.material.emissiveIntensity = emissiveIntensity;
            }
        });
        
        // Animate enhanced particle groups
        if (this.particleGroups) {
            this.particleGroups.forEach((group, groupIndex) => {
                // Rotate each group at different speeds
                group.system.rotation.y += group.rotationSpeed;
                group.system.rotation.x += group.rotationSpeed * 0.5;
                
                // Floating motion for particles
                const positions = group.positions;
                for (let i = 1; i < positions.length; i += 3) {
                    positions[i] += Math.sin(this.time * group.floatSpeed + i) * 0.02;
                }
                group.geometry.attributes.position.needsUpdate = true;
                
                // Opacity pulsing
                const opacity = 0.3 + Math.sin(this.time * 0.002 + groupIndex) * 0.2;
                group.system.material.opacity = opacity;
            });
        }
        
        // Animate star field
        if (this.starField) {
            this.starField.rotation.y += 0.0002;
            this.starField.rotation.x += 0.0001;
        }
        
        // Camera subtle movement with improved smoothness
        this.camera.position.x = Math.sin(this.time * 0.08) * 0.3;        this.camera.position.y = Math.cos(this.time * 0.12) * 0.2;
        this.camera.lookAt(0, 0, 0);
        
        // Render with post-processing if available, otherwise use standard rendering
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
            this.mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Scroll-based animations
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
            
            // Adjust camera position based on scroll
            this.camera.position.z = 5 + scrollPercent * 10;
            
            // Rotate objects based on scroll
            this.objects.forEach((object, index) => {
                object.rotation.y += scrollPercent * 0.01 * (index % 2 === 0 ? 1 : -1);
            });        });
    }
    
    setupPostProcessing() {
        // Check if post-processing libraries are available
        if (typeof THREE.EffectComposer === 'undefined' || 
            typeof THREE.RenderPass === 'undefined' || 
            typeof THREE.UnrealBloomPass === 'undefined') {
            console.warn('Post-processing libraries not loaded, skipping advanced effects');
            return;
        }
        
        try {
            // Create composer for post-processing pipeline
            this.composer = new THREE.EffectComposer(this.renderer);
            this.composer.setSize(window.innerWidth, window.innerHeight);
            
            // Base render pass
            const renderPass = new THREE.RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
            
            // Bloom effect for glowing objects
            const bloomPass = new THREE.UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                1.5,    // Bloom strength
                0.4,    // Bloom radius
                0.85    // Bloom threshold
            );
            this.composer.addPass(bloomPass);
            
            // Depth of field (bokeh) effect - optional for premium feel
            if (typeof THREE.BokehPass !== 'undefined') {
                const bokehPass = new THREE.BokehPass(this.scene, this.camera, {
                    focus: 1.0,
                    aperture: 0.025,
                    maxblur: 0.01,
                    width: window.innerWidth,
                    height: window.innerHeight
                });
                bokehPass.enabled = false; // Start disabled, can be enabled later
                this.composer.addPass(bokehPass);
                this.bokehPass = bokehPass;
            }
            
            // Film grain effect for cinematic quality
            if (typeof THREE.FilmPass !== 'undefined') {
                const filmPass = new THREE.FilmPass(
                    0.35,   // Noise intensity
                    0.025,  // Scanline intensity
                    648,    // Scanline count
                    false   // Grayscale
                );
                this.composer.addPass(filmPass);
            }
            
            // FXAA anti-aliasing for smooth edges
            if (typeof THREE.ShaderPass !== 'undefined' && typeof THREE.FXAAShader !== 'undefined') {
                const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
                fxaaPass.material.uniforms['resolution'].value.x = 1 / window.innerWidth;
                fxaaPass.material.uniforms['resolution'].value.y = 1 / window.innerHeight;
                this.composer.addPass(fxaaPass);
                this.fxaaPass = fxaaPass;
            }
            
            // Update post-processing on window resize
            this.setupPostProcessingResize();
            
            console.log('✨ Post-processing effects initialized successfully');
            
        } catch (error) {
            console.warn('Failed to initialize post-processing:', error);
            this.composer = null;
        }
    }
    
    setupPostProcessingResize() {
        const originalResize = this.onWindowResize;
        this.onWindowResize = () => {
            if (originalResize) originalResize.call(this);
            
            if (this.composer) {
                this.composer.setSize(window.innerWidth, window.innerHeight);
                
                // Update FXAA resolution
                if (this.fxaaPass) {
                    this.fxaaPass.material.uniforms['resolution'].value.x = 1 / window.innerWidth;
                    this.fxaaPass.material.uniforms['resolution'].value.y = 1 / window.innerHeight;
                }
            }
        };
    }
      destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up Three.js objects
        this.objects.forEach(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
            this.scene.remove(object);
        });
        
        // Clean up post-processing composer
        if (this.composer) {
            this.composer.dispose();
            this.composer = null;
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Scroll-triggered 3D Object Animations
class ScrollAnimations {
    constructor() {
        this.scrollObjects = [];
        this.init();
    }
    
    init() {
        this.createScrollObjects();
        this.setupScrollListener();
    }
    
    createScrollObjects() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            if (section.id === 'home') return; // Skip hero section
            
            const canvas = document.createElement('canvas');
            canvas.className = 'scroll-3d-object';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.right = '0';
            canvas.style.width = '200px';
            canvas.style.height = '200px';
            canvas.style.opacity = '0.6';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '1';
            
            // Make section relative if not already
            if (getComputedStyle(section).position === 'static') {
                section.style.position = 'relative';
            }
            
            section.appendChild(canvas);
            
            // Create Three.js scene for this canvas
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            
            renderer.setSize(200, 200);
            camera.position.z = 3;
            
            // Create object based on section
            let geometry, material;
            const colors = [0x6C63FF, 0x00E0FF, 0xFF6B6B, 0x4ECDC4, 0xFFD93D];
            
            switch (index % 5) {
                case 0:
                    geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 64, 8);
                    break;
                case 1:
                    geometry = new THREE.IcosahedronGeometry(1, 0);
                    break;
                case 2:
                    geometry = new THREE.OctahedronGeometry(1);
                    break;
                case 3:
                    geometry = new THREE.DodecahedronGeometry(1);
                    break;
                default:
                    geometry = new THREE.TetrahedronGeometry(1);
            }
            
            material = new THREE.MeshPhongMaterial({
                color: colors[index % colors.length],
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            
            // Lighting
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(2, 2, 2);
            scene.add(light);
            
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);
            
            this.scrollObjects.push({
                canvas,
                scene,
                camera,
                renderer,
                mesh,
                section,
                rotation: { x: 0, y: 0, z: 0 }
            });
        });
    }
    
    setupScrollListener() {
        let ticking = false;
        
        const updateObjects = () => {
            this.scrollObjects.forEach((obj) => {
                const rect = obj.section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const scrollProgress = Math.max(0, Math.min(1, 
                        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                    ));
                    
                    // Animate based on scroll progress
                    obj.rotation.x += 0.02;
                    obj.rotation.y += 0.015;
                    obj.rotation.z += 0.01;
                    
                    obj.mesh.rotation.x = obj.rotation.x;
                    obj.mesh.rotation.y = obj.rotation.y;
                    obj.mesh.rotation.z = obj.rotation.z;
                    
                    // Scale based on visibility
                    const scale = 0.5 + scrollProgress * 0.5;
                    obj.mesh.scale.setScalar(scale);
                    
                    obj.renderer.render(obj.scene, obj.camera);
                    obj.canvas.style.opacity = scrollProgress * 0.6;
                } else {
                    obj.canvas.style.opacity = '0';
                }
            });
            
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateObjects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Initial update
        updateObjects();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
        // Initialize 3D background
        const threeDBackground = new ThreeDBackground();
        
        // Initialize scroll animations
        const scrollAnimations = new ScrollAnimations();
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            threeDBackground.destroy();
        });
    }
});
