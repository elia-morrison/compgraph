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
        float lifeSpan = u_MaxTheta;
        
        v_Position = u_Origin;
        v_Age = u_MinTheta;
        v_Life = lifeSpan;
        v_Velocity = vec3(0.0, 2.0, 0.0);  // Initial upward velocity
    } else {
        float halfLife = 0.5 * i_Life;
        if (i_Age < halfLife) {
            // Continue upward motion
            v_Position = i_Position + i_Velocity * u_TimeDelta;
            v_Velocity = i_Velocity;
        } else { 
            // Explode in random directions
            if (i_Age - u_TimeDelta < halfLife) {
                // Calculate explosion direction
                ivec2 noise_coord = ivec2(gl_VertexID % 512, gl_VertexID / 512);
                vec3 rand = texelFetch(u_RgNoise, noise_coord, 0).rgb;
                float angle = 2.0 * 3.14159265 * rand.r;  // Random angle
                float x = cos(angle);
                float y = sin(angle);
                
                v_Velocity = vec3(x, y, 0.0) * 20.;
            }
            // Update position based on new velocity
            v_Position = i_Position + v_Velocity * u_TimeDelta;
        }
        v_Age = i_Age + u_TimeDelta;
        v_Life = i_Life;
    }
}
