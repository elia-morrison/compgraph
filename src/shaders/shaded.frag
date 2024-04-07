#define NR_POINT_LIGHTS 4

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: Material = require('./material.glsl')
#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', NR_POINT_LIGHTS=NR_POINT_LIGHTS)

precision mediump float;

uniform Material material;
uniform float ambient_strength;

varying vec3 fragColor;
varying vec3 normal;
varying vec2 textCoord;

varying vec3 FragPos;
uniform vec3 viewPos;

uniform PointLight pointLights[NR_POINT_LIGHTS];

void main()
{
    vec3 lighting = calculateLighting(material, textCoord, FragPos, normal, viewPos, pointLights);
    gl_FragColor = vec4(lighting, 1.0);
}
