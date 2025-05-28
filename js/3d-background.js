// 3D Background Animation System
class ThreeDBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.animationId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        
        this.init();
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
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0x6C63FF, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0x00E0FF, 0.8, 10);
        pointLight.position.set(-5, -5, 2);
        this.scene.add(pointLight);
    }
    
    createFloatingObjects() {
        const geometries = [
            new THREE.BoxGeometry(0.3, 0.3, 0.3),
            new THREE.SphereGeometry(0.2, 16, 16),
            new THREE.ConeGeometry(0.2, 0.4, 8),
            new THREE.OctahedronGeometry(0.25),
            new THREE.TetrahedronGeometry(0.3),
            new THREE.TorusGeometry(0.2, 0.08, 8, 16)
        ];
        
        const materials = [
            new THREE.MeshPhongMaterial({ 
                color: 0x6C63FF, 
                transparent: true, 
                opacity: 0.7,
                shininess: 100
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0x00E0FF, 
                transparent: true, 
                opacity: 0.6,
                shininess: 100
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0xFF6B6B, 
                transparent: true, 
                opacity: 0.5,
                shininess: 100
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0x4ECDC4, 
                transparent: true, 
                opacity: 0.6,
                shininess: 100
            })
        ];
        
        // Create multiple floating objects
        for (let i = 0; i < 25; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random positioning
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 15;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            // Store animation properties
            mesh.userData = {
                originalX: mesh.position.x,
                originalY: mesh.position.y,
                originalZ: mesh.position.z,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatRange: Math.random() * 2 + 1
            };
            
            this.objects.push(mesh);
            this.scene.add(mesh);
        }
        
        // Create particle system
        this.createParticleSystem();
    }
    
    createParticleSystem() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;     // x
            positions[i + 1] = (Math.random() - 0.5) * 50; // y
            positions[i + 2] = (Math.random() - 0.5) * 50; // z
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x6C63FF,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        
        // Store for animation
        this.particleSystem = particleSystem;
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Animate floating objects
        this.objects.forEach((object, index) => {
            // Rotation animation
            object.rotation.x += object.userData.rotationSpeed.x;
            object.rotation.y += object.userData.rotationSpeed.y;
            object.rotation.z += object.userData.rotationSpeed.z;
            
            // Floating animation
            const floatOffset = Math.sin(this.time * object.userData.floatSpeed + index) * object.userData.floatRange;
            object.position.y = object.userData.originalY + floatOffset;
            
            // Mouse interaction
            const mouseInfluence = 0.0005;
            object.position.x = object.userData.originalX + this.mouseX * mouseInfluence * (index % 3 + 1);
            object.position.z = object.userData.originalZ + this.mouseY * mouseInfluence * (index % 2 + 1);
        });
        
        // Animate particle system
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x += 0.0005;
        }
        
        // Camera subtle movement
        this.camera.position.x = Math.sin(this.time * 0.1) * 0.5;
        this.camera.position.y = Math.cos(this.time * 0.15) * 0.3;
        
        this.renderer.render(this.scene, this.camera);
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
            });
        });
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
