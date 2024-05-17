#version 300 es
precision mediump float;

in vec3 i_Position;
in float i_Age;
in float i_Life;
in vec3 i_Coord;
in vec2 i_TexCoord;

out float v_Age;
out float v_Life;
out vec2 v_TexCoord;

void main() {
    vec3 vert_coord = i_Position + (0.75*(1.0-i_Age / i_Life) + 0.25) * 0.1 * i_Coord;
    v_Age = i_Age;
    v_Life = i_Life;
    v_TexCoord = i_TexCoord;
    gl_Position = vec4(vert_coord, 1.0);
}