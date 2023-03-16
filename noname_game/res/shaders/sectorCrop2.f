varying vec2 vUv;
uniform sampler2D map;
uniform vec3 color;
uniform float opacity;
uniform float a;
uniform vec2 c;

void main() {
    vec4 j = texture2D( map, vUv ) * vec4(color, opacity);
    float v = distance( vUv, c + vec2( sin(a), cos(a) ) * 100.0 / 2048.0 ) * 15.0;
    v = v * v * v;
    gl_FragColor = j * min(1.0, v * v + j.r) * j.a;
} 
