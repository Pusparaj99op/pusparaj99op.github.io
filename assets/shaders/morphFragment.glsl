// Fragment Shader - Morphing Geometric Shapes
// Creates iridescent, color-shifting surface effects
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
