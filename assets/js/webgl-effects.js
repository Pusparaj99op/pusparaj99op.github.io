/**
 * WebGL Effects - Advanced WebGL effects and post-processing
 * Creates particle systems, morphing geometries, and visual effects
 * Version: 1.0
 * Last Modified: August 26, 2025
 */

class WebGLEffects {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.programs = new Map();
        this.buffers = new Map();
        this.textures = new Map();
        this.uniforms = new Map();

        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isRunning = false;

        this.particleSystem = null;
        this.morphingGeometry = null;

        this.init();
    }

    init() {
        try {
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

            if (!this.gl) {
                console.warn('WebGL not supported, falling back to Canvas 2D');
                return false;
            }

            this.setupWebGL();
            this.loadShaders();
            this.createParticleSystem();
            this.createMorphingGeometry();
            this.bindEvents();

            console.log('WebGL Effects initialized successfully');
            return true;
        } catch (error) {
            console.error('WebGL initialization failed:', error);
            return false;
        }
    }

    setupWebGL() {
        const gl = this.gl;

        // Set viewport
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        // Enable blending for transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Enable depth testing
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // Clear color
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
    }

    async loadShaders() {
        if (typeof shaderManager === 'undefined') {
            console.error('ShaderManager not found');
            return;
        }

        try {
            await ShaderUtils.initializeShaders(this.gl);
            console.log('WebGL shaders loaded successfully');
        } catch (error) {
            console.error('Failed to load WebGL shaders:', error);
        }
    }

    createParticleSystem() {
        const gl = this.gl;
        const particleCount = 500;

        // Particle data
        const positions = new Float32Array(particleCount * 3);
        const uvs = new Float32Array(particleCount * 2);
        const sizes = new Float32Array(particleCount);
        const phases = new Float32Array(particleCount);

        // Generate random particle data
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const i2 = i * 2;

            positions[i3] = (Math.random() - 0.5) * this.canvas.width;
            positions[i3 + 1] = (Math.random() - 0.5) * this.canvas.height;
            positions[i3 + 2] = (Math.random() - 0.5) * 200;

            uvs[i2] = Math.random();
            uvs[i2 + 1] = Math.random();

            sizes[i] = Math.random() * 10 + 5;
            phases[i] = Math.random() * Math.PI * 2;
        }

        // Create buffers
        this.buffers.set('particlePositions', this.createBuffer(gl, positions));
        this.buffers.set('particleUVs', this.createBuffer(gl, uvs));
        this.buffers.set('particleSizes', this.createBuffer(gl, sizes));
        this.buffers.set('particlePhases', this.createBuffer(gl, phases));

        this.particleSystem = {
            count: particleCount,
            positions,
            uvs,
            sizes,
            phases
        };
    }

    createMorphingGeometry() {
        const gl = this.gl;

        // Create a plane geometry
        const vertices = new Float32Array([
            -200, -200, 0,
             200, -200, 0,
             200,  200, 0,
            -200,  200, 0
        ]);

        const uvs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]);

        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        this.buffers.set('morphVertices', this.createBuffer(gl, vertices));
        this.buffers.set('morphUVs', this.createBuffer(gl, uvs));
        this.buffers.set('morphIndices', this.createElementBuffer(gl, indices));

        this.morphingGeometry = {
            vertices,
            uvs,
            indices,
            indexCount: indices.length
        };
    }

    createBuffer(gl, data) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    }

    createElementBuffer(gl, data) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    }

    bindEvents() {
        // Mouse tracking
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) / rect.width;
            this.mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
        });

        // Touch tracking
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = (touch.clientX - rect.left) / rect.width;
            this.mouseY = 1.0 - (touch.clientY - rect.top) / rect.height;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    resize() {
        const pixelRatio = window.devicePixelRatio || 1;
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        const width = displayWidth * pixelRatio;
        const height = displayHeight * pixelRatio;

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;

            if (this.gl) {
                this.gl.viewport(0, 0, width, height);
            }
        }
    }

    renderParticles() {
        const gl = this.gl;
        const program = shaderManager.getProgram('particle');

        if (!program) return;

        gl.useProgram(program);

        // Set up attributes
        const positionBuffer = this.buffers.get('particlePositions');
        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        const uvBuffer = this.buffers.get('particleUVs');
        const uvLocation = gl.getAttribLocation(program, 'uv');
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

        const sizeBuffer = this.buffers.get('particleSizes');
        const sizeLocation = gl.getAttribLocation(program, 'size');
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.enableVertexAttribArray(sizeLocation);
        gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, 0, 0);

        const phaseBuffer = this.buffers.get('particlePhases');
        const phaseLocation = gl.getAttribLocation(program, 'phase');
        gl.bindBuffer(gl.ARRAY_BUFFER, phaseBuffer);
        gl.enableVertexAttribArray(phaseLocation);
        gl.vertexAttribPointer(phaseLocation, 1, gl.FLOAT, false, 0, 0);

        // Set uniforms
        const uniforms = {
            time: this.time,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            resolution: [this.canvas.width, this.canvas.height],
            projectionMatrix: this.getProjectionMatrix(),
            modelViewMatrix: this.getModelViewMatrix(),
            color1: ShaderUtils.hexToVec3('#6a7dfe'),
            color2: ShaderUtils.hexToVec3('#ff6b6b'),
            color3: ShaderUtils.hexToVec3('#4ecdc4')
        };

        shaderManager.setUniforms(gl, program, uniforms);

        // Draw particles
        gl.drawArrays(gl.POINTS, 0, this.particleSystem.count);
    }

    renderMorphingGeometry() {
        const gl = this.gl;
        const program = shaderManager.getProgram('morph');

        if (!program) return;

        gl.useProgram(program);

        // Set up attributes
        const vertexBuffer = this.buffers.get('morphVertices');
        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        const uvBuffer = this.buffers.get('morphUVs');
        const uvLocation = gl.getAttribLocation(program, 'uv');
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

        // Set uniforms
        const uniforms = {
            time: this.time,
            morphStrength: 20 + Math.sin(this.time * 0.5) * 10,
            resolution: [this.canvas.width, this.canvas.height],
            projectionMatrix: this.getProjectionMatrix(),
            modelViewMatrix: this.getModelViewMatrix(),
            primaryColor: ShaderUtils.hexToVec3('#6a7dfe'),
            secondaryColor: ShaderUtils.hexToVec3('#ff6b6b'),
            accentColor: ShaderUtils.hexToVec3('#4ecdc4')
        };

        shaderManager.setUniforms(gl, program, uniforms);

        // Bind index buffer and draw
        const indexBuffer = this.buffers.get('morphIndices');
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.morphingGeometry.indexCount, gl.UNSIGNED_SHORT, 0);
    }

    getProjectionMatrix() {
        // Simple orthographic projection matrix
        const left = -this.canvas.width / 2;
        const right = this.canvas.width / 2;
        const bottom = -this.canvas.height / 2;
        const top = this.canvas.height / 2;
        const near = -1000;
        const far = 1000;

        return new Float32Array([
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, -2 / (far - near), 0,
            -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        ]);
    }

    getModelViewMatrix() {
        // Identity matrix
        return ShaderUtils.createIdentityMatrix();
    }

    render() {
        if (!this.gl || !this.isRunning) return;

        const gl = this.gl;

        // Update time
        this.time += 0.016; // Assume 60fps

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render effects
        this.renderMorphingGeometry();
        this.renderParticles();

        // Continue animation loop
        requestAnimationFrame(() => this.render());
    }

    start() {
        if (!this.isRunning && this.gl) {
            this.isRunning = true;
            this.render();
            console.log('WebGL Effects started');
        }
    }

    stop() {
        this.isRunning = false;
        console.log('WebGL Effects stopped');
    }

    updateTheme(colors) {
        // Update color uniforms based on theme
        this.uniforms.set('color1', ShaderUtils.hexToVec3(colors.primary || '#6a7dfe'));
        this.uniforms.set('color2', ShaderUtils.hexToVec3(colors.secondary || '#ff6b6b'));
        this.uniforms.set('color3', ShaderUtils.hexToVec3(colors.accent || '#4ecdc4'));
    }

    dispose() {
        this.stop();

        if (this.gl) {
            // Clean up buffers
            for (const buffer of this.buffers.values()) {
                this.gl.deleteBuffer(buffer);
            }
            this.buffers.clear();

            // Clean up textures
            for (const texture of this.textures.values()) {
                this.gl.deleteTexture(texture);
            }
            this.textures.clear();
        }

        console.log('WebGL Effects disposed');
    }
}

// Post-processing effects
class PostProcessing {
    constructor(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.frameBuffer = null;
        this.texture = null;

        this.createFrameBuffer();
    }

    createFrameBuffer() {
        const gl = this.gl;

        // Create frame buffer
        this.frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

        // Create texture for rendering
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Attach texture to frame buffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    begin() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
        this.gl.viewport(0, 0, this.width, this.height);
    }

    end() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    dispose() {
        const gl = this.gl;
        if (this.frameBuffer) gl.deleteFramebuffer(this.frameBuffer);
        if (this.texture) gl.deleteTexture(this.texture);
    }
}

// Initialize WebGL Effects when DOM is ready
let webGLEffects = null;

function initWebGLEffects() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.warn('Hero canvas not found');
        return;
    }

    try {
        webGLEffects = new WebGLEffects(canvas);
        webGLEffects.start();
    } catch (error) {
        console.error('Failed to initialize WebGL effects:', error);
        // Fallback to canvas 2D effects if available
        if (typeof initCanvasEffects === 'function') {
            initCanvasEffects();
        }
    }
}

// Theme integration
function updateWebGLTheme(themeColors) {
    if (webGLEffects) {
        webGLEffects.updateTheme(themeColors);
    }
}

// Export for global access
if (typeof window !== 'undefined') {
    window.WebGLEffects = WebGLEffects;
    window.PostProcessing = PostProcessing;
    window.initWebGLEffects = initWebGLEffects;
    window.updateWebGLTheme = updateWebGLTheme;
}

// Auto-initialize when shaders are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(initWebGLEffects, 1000);
});
