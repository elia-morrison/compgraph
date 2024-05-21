#version 300 es
precision mediump float;

uniform float u_TimeDelta;
uniform sampler2D u_RgNoise;
uniform vec3 u_Origin;
uniform float u_MinTheta;  
uniform float u_MaxTheta; // Uniform for the radius of the portal circumference

in vec3 i_Position;
in float i_Age;
in float i_Life;
in vec3 i_Velocity;

out vec3 v_Position;
out float v_Age;
out float v_Life;
out vec3 v_Velocity;

void main() {
    float angle = 0.;
    if (i_Age >= i_Life) {
        ivec2 noise_coord = ivec2(gl_VertexID % 512, gl_VertexID / 512);
        vec3 rand = texelFetch(u_RgNoise, noise_coord, 0).rgb;
        angle = 2.0 * 3.14159265 * rand.r; // Random angle
        float radius = (rand.g * 0.1) + 0.9;
        float x = u_Origin.x + u_MaxTheta * radius * cos(angle);
        float y = u_Origin.y + u_MaxTheta * radius * sin(angle);
        float z = u_Origin.z;

        v_Position = vec3(x, y, z);
        v_Age = 0.0;
        v_Life = i_Life;
    } else {
        vec3 displacement = i_Position - u_Origin;
        angle = atan(displacement.y, displacement.x);

        v_Age = i_Age + u_TimeDelta;
        v_Life = i_Life;
        v_Position = i_Position;
    }
    float currentRadius = length(v_Position - u_Origin);
    float inwardSpeed = (u_MaxTheta / currentRadius) * 1.; // Increase speed as particles move inward

    // Calculate the initial velocity pointing towards the center
    vec3 centerDirection = vec3(-cos(angle), -sin(angle), 0.0);
    // Calculate the perpendicular component for the clockwise spiral
    vec3 spiralComponent = vec3(-sin(angle), cos(angle), 0.0);

    // Combine the center direction and the spiral component
    float spiralStrength = inwardSpeed; // Adjust this value to control the strength of the spiral effect
    v_Velocity = centerDirection + spiralStrength * spiralComponent;
    v_Position = v_Position + v_Velocity * u_TimeDelta;
}
