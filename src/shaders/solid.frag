#version 300 es

precision mediump float;

uniform vec3 viewPos;

in vec3 normal;
in vec2 textCoord;
in vec3 resultingColor;
in vec3 FragPos;

out vec4 FragColor;

void main()
{
    FragColor = vec4(0.1, 0.5, 0.1, 1.0);
}
