// Fragment Shader - Wave Distortion Effect
// Creates water-like ripple effects with distortion
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
