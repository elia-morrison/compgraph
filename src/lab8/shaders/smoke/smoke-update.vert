#version 300 es
precision mediump float;

uniform float u_TimeDelta;
uniform sampler2D u_RgNoise;
uniform vec3 u_Origin;
uniform float u_MinTheta;
uniform float u_MaxTheta;

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
        // Respawn particle at origin
        ivec2 noise_coord = ivec2(gl_VertexID % 512, gl_VertexID / 512);
        vec3 rand = texelFetch(u_RgNoise, noise_coord, 0).rgb;
        float lifeSpan = (rand.r * 0.3 + 0.7) * u_MaxTheta;

        v_Position = vec3(i_Position[0], u_Origin[1], i_Position[2]);
        v_Age = 0.0;
        v_Life = lifeSpan;
        v_Velocity = vec3(0.0, 1.0, 0.0); // Slower rising velocity for smoke
    } else {
        // Apply upward and swirling motion
        // float angle = 6.2831853 * (i_Age / i_Life); // Full rotation over lifespan
        // float radius = 0.1 * i_Age; // Increasing radius

        // float x = radius * cos(angle);
        // float z = radius * sin(angle);
        float y = 0.6 * u_TimeDelta; // Continuous upward movement

        v_Position = i_Position + vec3(0., y, 0.);
        v_Velocity = i_Velocity; // Maintain velocity

        v_Age = i_Age + u_TimeDelta;
        v_Life = i_Life;
    }
}
