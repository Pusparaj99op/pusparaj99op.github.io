// Fragment Shader - Background Particles
// Creates glowing particle effects with color variations
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
