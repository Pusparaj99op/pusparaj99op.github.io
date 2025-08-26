/**
 * GLSL Shaders Management
 * Handles loading, compilation, and management of WebGL shaders
 * Version: 1.0
 * Last Modified: August 26, 2025
 */

class ShaderManager {
    constructor() {
        this.shaders = new Map();
        this.programs = new Map();
        this.loadedShaders = new Set();
    }

    /**
     * Load shader from file or string
     */
    async loadShader(gl, name, vertexSource, fragmentSource) {
        try {
            const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexSource);
            const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

            if (!vertexShader || !fragmentShader) {
                throw new Error(`Failed to compile shaders for ${name}`);
            }

            const program = this.createProgram(gl, vertexShader, fragmentShader);
            if (!program) {
                throw new Error(`Failed to create shader program for ${name}`);
            }

            this.programs.set(name, program);
            this.shaders.set(name, { vertexShader, fragmentShader });
            this.loadedShaders.add(name);

            console.log(`Shader "${name}" loaded successfully`);
            return program;
        } catch (error) {
            console.error(`Error loading shader "${name}":`, error);
            throw error;
        }
    }

    /**
     * Compile individual shader
     */
    compileShader(gl, type, source) {
        const shader = gl.createShader(type);
        if (!shader) {
            console.error('Failed to create shader');
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('Shader compilation error:', error);
            console.error('Shader source:', source);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    /**
     * Create shader program
     */
    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        if (!program) {
            console.error('Failed to create shader program');
            return null;
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(program);
            console.error('Program linking error:', error);
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    /**
     * Get shader program
     */
    getProgram(name) {
        return this.programs.get(name);
    }

    /**
     * Use shader program
     */
    useProgram(gl, name) {
        const program = this.programs.get(name);
        if (program) {
            gl.useProgram(program);
            return program;
        }
        console.warn(`Shader program "${name}" not found`);
        return null;
    }

    /**
     * Set uniform values
     */
    setUniforms(gl, program, uniforms) {
        for (const [name, value] of Object.entries(uniforms)) {
            const location = gl.getUniformLocation(program, name);
            if (location === null) continue;

            if (Array.isArray(value)) {
                switch (value.length) {
                    case 1:
                        gl.uniform1f(location, value[0]);
                        break;
                    case 2:
                        gl.uniform2f(location, value[0], value[1]);
                        break;
                    case 3:
                        gl.uniform3f(location, value[0], value[1], value[2]);
                        break;
                    case 4:
                        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        break;
                    case 16:
                        gl.uniformMatrix4fv(location, false, value);
                        break;
                }
            } else if (typeof value === 'number') {
                gl.uniform1f(location, value);
            }
        }
    }

    /**
     * Dispose shader resources
     */
    dispose(gl, name) {
        const program = this.programs.get(name);
        const shaders = this.shaders.get(name);

        if (program) {
            gl.deleteProgram(program);
            this.programs.delete(name);
        }

        if (shaders) {
            gl.deleteShader(shaders.vertexShader);
            gl.deleteShader(shaders.fragmentShader);
            this.shaders.delete(name);
        }

        this.loadedShaders.delete(name);
    }

    /**
     * Dispose all shaders
     */
    disposeAll(gl) {
        for (const name of this.loadedShaders) {
            this.dispose(gl, name);
        }
    }
}

// Predefined shader sources
const SHADER_SOURCES = {
    // Particle System Shaders
    particleVertex: `
        attribute vec3 position;
        attribute vec2 uv;
        attribute float size;
        attribute float phase;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        uniform vec2 resolution;

        varying vec2 vUv;
        varying float vAlpha;

        void main() {
            vUv = uv;

            vec3 pos = position;

            // Wave animation
            float wave = sin(pos.x * 0.01 + time * 0.5 + phase) *
                        cos(pos.z * 0.01 + time * 0.3 + phase) * 10.0;
            pos.y += wave;

            // Mouse interaction
            vec2 mouse = vec2(mouseX, mouseY);
            vec2 screenPos = pos.xy / resolution;
            float mouseDistance = distance(screenPos, mouse);
            float mouseEffect = 1.0 / (mouseDistance * 5.0 + 1.0);
            pos.z += mouseEffect * 20.0;

            // Particle size based on distance and time
            float pointSize = size * (1.0 + sin(time + phase) * 0.3);
            pointSize *= (1.0 - mouseDistance * 0.5);

            // Alpha based on distance and wave
            vAlpha = (1.0 - mouseDistance) * (0.5 + sin(time + phase) * 0.3);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = pointSize;
        }
    `,

    particleFragment: `
        precision mediump float;

        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;

        varying vec2 vUv;
        varying float vAlpha;

        void main() {
            // Create circular particle shape
            vec2 center = vec2(0.5);
            float dist = distance(gl_PointCoord, center);

            if (dist > 0.5) {
                discard;
            }

            // Create glow effect
            float glow = 1.0 - (dist * 2.0);
            glow = pow(glow, 2.0);

            // Color mixing based on time and position
            float colorMix1 = sin(time * 0.5 + vUv.x * 10.0) * 0.5 + 0.5;
            float colorMix2 = cos(time * 0.3 + vUv.y * 8.0) * 0.5 + 0.5;

            vec3 mixedColor = mix(color1, color2, colorMix1);
            mixedColor = mix(mixedColor, color3, colorMix2);

            // Final alpha with glow
            float alpha = vAlpha * glow;

            gl_FragColor = vec4(mixedColor, alpha);
        }
    `,

    // Morphing Geometry Shaders
    morphVertex: `
        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float time;
        uniform float morphStrength;
        uniform vec2 resolution;

        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
            vUv = uv;
            vPosition = position;

            vec3 pos = position;

            // Morphing effect using multiple sine waves
            float morphX = sin(pos.y * 0.02 + time * 0.8) * morphStrength;
            float morphY = cos(pos.x * 0.02 + time * 0.6) * morphStrength;
            float morphZ = sin(pos.x * 0.01 + pos.y * 0.01 + time * 1.2) * morphStrength * 0.5;

            pos.x += morphX;
            pos.y += morphY;
            pos.z += morphZ;

            // Additional twist effect
            float angle = time * 0.3 + pos.z * 0.01;
            float cosA = cos(angle);
            float sinA = sin(angle);

            vec3 twisted;
            twisted.x = pos.x * cosA - pos.y * sinA;
            twisted.y = pos.x * sinA + pos.y * cosA;
            twisted.z = pos.z;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(twisted, 1.0);
        }
    `,

    morphFragment: `
        precision mediump float;

        uniform float time;
        uniform vec3 primaryColor;
        uniform vec3 secondaryColor;
        uniform vec3 accentColor;
        uniform vec2 resolution;

        varying vec2 vUv;
        varying vec3 vPosition;

        // Noise function for organic texture
        float noise(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float smoothNoise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            float a = noise(i);
            float b = noise(i + vec2(1.0, 0.0));
            float c = noise(i + vec2(0.0, 1.0));
            float d = noise(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) +
                   (c - a) * u.y * (1.0 - u.x) +
                   (d - b) * u.x * u.y;
        }

        void main() {
            vec2 st = vUv;

            // Create flowing patterns
            float flow1 = sin(st.x * 8.0 + time * 2.0) * cos(st.y * 6.0 + time * 1.5);
            float flow2 = cos(st.x * 6.0 - time * 1.8) * sin(st.y * 8.0 - time * 2.2);

            // Add noise for organic texture
            float noiseValue = smoothNoise(st * 10.0 + time * 0.5);

            // Combine flows with noise
            float pattern = (flow1 + flow2) * 0.5 + noiseValue * 0.3;
            pattern = (pattern + 1.0) * 0.5; // Normalize to 0-1

            // Color mixing based on pattern and position
            vec3 color1 = mix(primaryColor, secondaryColor, pattern);
            vec3 color2 = mix(secondaryColor, accentColor, sin(time + st.x * 5.0) * 0.5 + 0.5);

            vec3 finalColor = mix(color1, color2, cos(time * 0.8 + st.y * 4.0) * 0.5 + 0.5);

            // Add iridescent effect
            float iridescence = abs(sin(st.x * 15.0 + time * 3.0) * cos(st.y * 12.0 + time * 2.5));
            finalColor += iridescence * 0.2;

            // Distance-based alpha for smooth edges
            vec2 center = vec2(0.5);
            float dist = distance(st, center);
            float alpha = smoothstep(0.5, 0.3, dist);

            gl_FragColor = vec4(finalColor, alpha);
        }
    `,

    // Post-processing Effects
    waveFragment: `
        precision mediump float;

        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform sampler2D tDiffuse;
        uniform float distortionStrength;

        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;

            // Create multiple wave layers
            float wave1 = sin(uv.x * 20.0 + time * 2.0) * cos(uv.y * 15.0 + time * 1.5);
            float wave2 = cos(uv.x * 15.0 - time * 1.8) * sin(uv.y * 18.0 + time * 2.2);
            float wave3 = sin(uv.x * 25.0 + uv.y * 20.0 + time * 3.0);

            // Mouse ripple effect
            vec2 mousePos = mouse / resolution;
            float mouseDistance = distance(uv, mousePos);
            float ripple = sin(mouseDistance * 30.0 - time * 8.0) * exp(-mouseDistance * 3.0);

            // Combine all waves
            float totalWave = (wave1 + wave2 + wave3) * 0.2 + ripple * 0.5;

            // Apply distortion to UV coordinates
            vec2 distortedUV = uv + totalWave * distortionStrength;

            // Sample the texture with distorted coordinates
            vec4 color = texture2D(tDiffuse, distortedUV);

            // Add wave-based color tinting
            vec3 tint = vec3(
                0.5 + sin(time + totalWave) * 0.2,
                0.6 + cos(time * 0.8 + totalWave * 2.0) * 0.2,
                0.8 + sin(time * 1.2 + totalWave * 1.5) * 0.2
            );

            color.rgb *= tint;

            gl_FragColor = color;
        }
    `
};

// Initialize and export shader manager
const shaderManager = new ShaderManager();

// Utility functions for shader management
const ShaderUtils = {
    /**
     * Initialize all predefined shaders
     */
    async initializeShaders(gl) {
        const promises = [];

        for (const [name, source] of Object.entries(SHADER_SOURCES)) {
            if (name.endsWith('Vertex')) {
                const fragmentName = name.replace('Vertex', 'Fragment');
                const fragmentSource = SHADER_SOURCES[fragmentName];

                if (fragmentSource) {
                    const shaderName = name.replace('Vertex', '');
                    promises.push(
                        shaderManager.loadShader(gl, shaderName, source, fragmentSource)
                    );
                }
            }
        }

        try {
            await Promise.all(promises);
            console.log('All shaders loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load shaders:', error);
            return false;
        }
    },

    /**
     * Create matrix utilities
     */
    createMatrix4: () => new Float32Array(16),

    createIdentityMatrix: () => new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]),

    /**
     * Color utilities
     */
    hexToVec3: (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    },

    hslToVec3: (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        const r = hue2rgb(p, q, h + 1/3);
        const g = hue2rgb(p, q, h);
        const b = hue2rgb(p, q, h - 1/3);

        return [r, g, b];
    }
};

// Export modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { shaderManager, ShaderUtils, SHADER_SOURCES };
} else {
    window.shaderManager = shaderManager;
    window.ShaderUtils = ShaderUtils;
    window.SHADER_SOURCES = SHADER_SOURCES;
}
