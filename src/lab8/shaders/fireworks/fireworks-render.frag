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
    float t =  v_Age/v_Life;
    vec4 color = vec4(palette(t, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.00, 0.33, 0.67)), 
                        1.0-(v_Age/v_Life));
    o_FragColor = color * texture(u_Sprite, v_TexCoord);
}