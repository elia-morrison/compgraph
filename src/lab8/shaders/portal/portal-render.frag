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
    float halfLife = v_Life / 2.;
    vec3 mod_color = palette(t, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), vec3(0.00, 0.33, 0.67));
    mod_color = mix(vec3(0.1, 0.1, 1.0), vec3(0.6, 0.6, 0.8), t);
    vec4 color = vec4(mod_color, 
                        1.0);//1.0 - abs(v_Age - halfLife) * 2. / v_Life);
    o_FragColor = color * texture(u_Sprite, v_TexCoord);
}