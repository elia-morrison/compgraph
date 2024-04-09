#version 300 es

#define NR_POINT_LIGHTS 4
#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: Material = require('./material.glsl')
#pragma glslify: calculateDiffusion = require('./maps/calculate_diffusion.glsl', texture=texture)
#pragma glslify: calculateBumping = require('./maps/calculate_bumping.glsl', texture=texture)
#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', NR_POINT_LIGHTS=NR_POINT_LIGHTS)

precision mediump float;

uniform Material material;
uniform float ambient_strength;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform vec3 viewPos;

in vec3 normal;
in vec2 textCoord;
in vec3 resultingColor;
in vec3 FragPos;

out vec4 FragColor;

void main()
{
    FragColor = vec4(resultingColor, 1.0);
    if (material.use_fragment_shading) {
        vec3 norm = calculateBumping(material, textCoord, normalize(normal), FragPos);
        vec3 lighting = calculateLighting(material, textCoord, FragPos, norm, viewPos, pointLights);
        FragColor = vec4(lighting, 1.0);
    }
    FragColor *= vec4(calculateDiffusion(material, textCoord), 1.0);
}
