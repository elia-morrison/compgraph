#version 300 es
precision mediump float;

uniform sampler2D u_Sprite;

in float v_Age;
in float v_Life;
in vec2 v_TexCoord;

out vec4 o_FragColor;

/* From http://iquilezles.org/www/articles/palettes/palettes.htm */
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {  
    return a + b*cos( 6.28318*(c*t+d) ); 
}

void main() {
    float opacity = 0.;
    float halfLife = 0.5 * v_Life;
    if (v_Age < halfLife) {
        opacity = 1.;
    } else { 
        opacity = (1.0 - v_Age / v_Life);
    }
    //vec3 paletteColor = palette(v_Age/v_Life, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.5, 0.5, 0.5));
    vec4 color = vec4(mix(vec3(1.0, 0.5, 0.1), vec3(0.7, 0.7, 0.9), v_Age/v_Life), opacity);
    o_FragColor = color * texture(u_Sprite, v_TexCoord);
}