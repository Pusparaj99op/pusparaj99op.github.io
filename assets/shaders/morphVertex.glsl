// Vertex Shader - Morphing Geometric Shapes
// Creates dynamic geometric shapes that morph over time
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
