// Vertex Shader - Background Particles
// Creates dynamic particle system with wave effects
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
