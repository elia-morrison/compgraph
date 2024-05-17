#version 300 es
precision mediump float;

uniform float u_TimeDelta;
uniform sampler2D u_RgNoise;
uniform vec3 u_Gravity;
uniform vec3 u_Origin;
uniform float u_MinTheta;
uniform float u_MaxTheta;
uniform float u_MinSpeed;
uniform float u_MaxSpeed;

in vec3 i_Position;
in float i_Age;
in float i_Life;
in vec3 i_Velocity;

out vec3 v_Position;
out float v_Age;
out float v_Life;
out vec3 v_Velocity;

void main() {
    if (i_Age >= i_Life) {
        ivec2 noise_coord = ivec2(gl_VertexID % 512, gl_VertexID / 512);
        vec2 rand = texelFetch(u_RgNoise, noise_coord, 0).rg;
        float theta = u_MinTheta + rand.r*(u_MaxTheta - u_MinTheta);
        float x = cos(theta);
        float y = sin(theta);
        v_Position = u_Origin;
        v_Age = 0.0;
        v_Life = i_Life;
        v_Velocity = vec3(x, y, 0.) * (u_MinSpeed + rand.g * (u_MaxSpeed - u_MinSpeed));
        v_Velocity = v_Velocity + u_Gravity * u_TimeDelta; 
    } else {
        v_Position = i_Position + i_Velocity * u_TimeDelta;
        v_Age = i_Age + u_TimeDelta;
        v_Life = i_Life;
        v_Velocity = i_Velocity + u_Gravity * u_TimeDelta;
    }
}