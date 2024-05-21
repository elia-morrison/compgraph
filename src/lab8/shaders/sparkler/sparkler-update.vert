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
uniform vec3 u_MaxVelocity;

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
        vec3 rand = texelFetch(u_RgNoise, noise_coord, 0).rgb;
        float lifeSpan = (rand.r * 0.3 + 0.7) * u_MaxTheta;
        v_Position = u_Origin;
        v_Age = 0.0;
        v_Life = lifeSpan;
        
    } else {
        v_Age = i_Age + u_TimeDelta;
        v_Life = i_Life;
        float halfLife = 0.5 * v_Life;
        if (v_Age < halfLife) {
            v_Position = i_Position + i_Velocity * u_TimeDelta * 4.0;
        } else { 
            v_Position = i_Position + vec3(0, -1., 0) * u_TimeDelta * 0.5;
        }
    }
    v_Velocity = i_Velocity;
}