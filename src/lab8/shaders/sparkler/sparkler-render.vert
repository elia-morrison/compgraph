#version 300 es
precision mediump float;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 rotMatr;
uniform mat4 mProj;

in vec3 i_Position;
in float i_Age;
in float i_Life;
in vec3 i_Coord;
in vec2 i_TexCoord;

out float v_Age;
out float v_Life;
out vec2 v_TexCoord;

void main() {
    float size = 0.4;
    float halfLife = 0.5 * i_Life;
    if (i_Age < halfLife) {
        size = max(0.25, i_Age / i_Life) * size;
    } else { 
        size = (1. - i_Age / i_Life) * size;
    }
    vec3 vert_coord = i_Position + size * i_Coord;
    v_Age = i_Age;
    v_Life = i_Life;
    v_TexCoord = i_TexCoord;
    
    // billboarding
    vec4 camRight = vec4(mView[0][0], mView[1][0], mView[2][0], 0.0);
    vec4 camUp = vec4(mView[0][1], mView[1][1], mView[2][1], 0.0);
    vec4 worldPosition = mWorld * vec4(0.0, 0.0, 0.0, 1.0); // Center of billboard
    vec4 world_homog = worldPosition + camRight * vert_coord.x + camUp * vert_coord.y;
    gl_Position = mProj * mView * world_homog;
}