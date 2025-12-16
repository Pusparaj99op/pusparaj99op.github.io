
// Silk Effect Background
// Based on https://reactbits.dev/backgrounds/silk

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        // If hero-canvas is missing or used by something else, we might need to create one or check IDs
        // The HTML has <canvas id="hero-canvas"></canvas>
        return;
    }

    // Configuration
    const config = {
        speed: 0.8,
        scale: 1,
        color: 0x7B7481,
        noiseIntensity: 1.5,
        rotation: 0
    };

    // Theme Colors
    const colors = {
        night: new THREE.Color(0x7B7481),
        day: new THREE.Color(0x848B7E) // Negative/Inverted of night color
    };

    // Get initial theme
    const getInitialTheme = () => document.body.getAttribute('data-theme') || 'night';
    let currentTheme = getInitialTheme();


    // Initialize Three.js Scene
    const scene = new THREE.Scene();

    // Camera: Orthographic camera to render full screen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false // Background doesn't strictly need antialias, better perf
    });

    // Size management handled in resize
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Shader Code
    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vPosition = position;
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;

        uniform float uTime;
        uniform vec3  uColor;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uRotation;
        uniform float uNoiseIntensity;

        const float e = 2.71828182845904523536;

        float noise(vec2 texCoord) {
            float G = e;
            vec2  r = (G * sin(G * texCoord));
            return fract(r.x * r.y * (1.0 + texCoord.x));
        }

        vec2 rotateUvs(vec2 uv, float angle) {
            float c = cos(angle);
            float s = sin(angle);
            mat2  rot = mat2(c, -s, s, c);
            return rot * uv;
        }

        void main() {
            float rnd        = noise(gl_FragCoord.xy);
            vec2  uv         = rotateUvs(vUv * uScale, uRotation);
            vec2  tex        = uv * uScale;
            float tOffset    = uSpeed * uTime;

            tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

            float pattern = 0.6 +
                            0.4 * sin(5.0 * (tex.x + tex.y +
                                            cos(3.0 * tex.x + 5.0 * tex.y) +
                                            0.02 * tOffset) +
                                    sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

            vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
            col.a = 1.0;
            gl_FragColor = col;
        }
    `;

    // Uniforms
    const uniforms = {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(colors[currentTheme]) },
        uSpeed: { value: config.speed },
        uScale: { value: config.scale },
        uRotation: { value: config.rotation },
        uNoiseIntensity: { value: config.noiseIntensity }
    };

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const newTheme = document.body.getAttribute('data-theme');
                const targetColor = colors[newTheme] || colors.night;

                // Animate color transition using GSAP
                if (window.gsap) {
                    gsap.to(uniforms.uColor.value, {
                        r: targetColor.r,
                        g: targetColor.g,
                        b: targetColor.b,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                } else {
                    uniforms.uColor.value.copy(targetColor);
                }
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Material
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.DoubleSide
    });

    // Geometry: Full screen quad (2x2)
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize Handler
    function handleResize() {
        const parent = canvas.parentElement;
        if (parent) {
            const width = parent.clientWidth;
            const height = parent.clientHeight;
            renderer.setSize(width, height);

            // If we needed to correct aspect ratio in shader, we would pass resolution uniform
        }
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        if (!canvas.isConnected) return; // Stop if canvas removed

        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        uniforms.uTime.value = elapsedTime;

        renderer.render(scene, camera);
    }

    animate();
});
