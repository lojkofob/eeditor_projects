varying vec2 vUv;
uniform sampler2D map;
uniform vec3 color;
uniform float opacity;
uniform float a;
uniform vec2 c;

void main() {
    vec4 j = texture2D( map, vUv ) * vec4(color, opacity);
    vec2 k = vUv - c;
    float f = a * 0.9999999;
    float an = tan( 1.570796327 - f ) * k.x;
    float v = step( k.y, an );
    v = (1.0 - v) * step(0.0, k.x) + v * step( sin(f), 0.0 );
    gl_FragColor = j * v * j.a;
} 
