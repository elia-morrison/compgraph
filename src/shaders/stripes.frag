#version 300 es

precision mediump float;

uniform vec3 viewPos;

in vec3 normal;
in vec2 textCoord;
in vec3 resultingColor;
in vec3 FragPos;

out vec4 FragColor;

float float_mod(float a, float b) {
    return a - (b * floor(a/b));
}

void main()
{
    float xCoord = textCoord.r;
    float other_intensity = float_mod(floor(xCoord / 0.08), 2.0);
    vec3 color = vec3(0.0, 0.0, 1.0) + other_intensity * vec3(1.0, 1.0, 0.0);
    FragColor = vec4(color, 1.0);
}
