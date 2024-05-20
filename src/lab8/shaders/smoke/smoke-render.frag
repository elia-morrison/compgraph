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
    float halfLife = 0.5 * v_Age;
    if (v_Age < halfLife) {
        opacity = v_Age / v_Life;
    } else { 
        opacity = (1.0 - v_Age / v_Life);
    }
    vec4 color = vec4(1., 1., 1., 
                        opacity * 0.8);
    o_FragColor = color * texture(u_Sprite, v_TexCoord);
}