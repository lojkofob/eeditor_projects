varying vec2 vUv;
uniform sampler2D map1;
uniform sampler2D map2;
uniform float sc;
uniform float r1;
uniform float g1;
uniform float b1;

void main() {
    vec4 c1 = texture2D( map1, vUv );
    vec4 c2 = texture2D( map2, sc * (vUv - 0.5) + 0.5 );
    c2.r -= c1.r * r1;
    c2.g -= c1.g * g1;
    c2.b -= c1.b * b1;
    vec4 c = mix(c1, c2, 0.5) * 0.8;
    c.a = 0.8;
    gl_FragColor = c * c.a * 0.3;
} 
