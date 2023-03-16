varying vec2 vUv;
uniform float opacity;
uniform vec3 color;
uniform float width;
uniform float height;

void main() {
    
    vec4 c = vec4(color, 1.0) * opacity;
    float gg = 3.0;
    c.rgb *= mix( smoothstep( 1.0, 0.99, cos( vUv.x * width / gg ) ) * smoothstep( 1.0, 0.8, sin( vUv.y * height / gg / 1.0 ) ), 1.0, 0.7);
    
    gl_FragColor = c;
} 
