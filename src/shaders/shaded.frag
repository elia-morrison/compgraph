#version 300 es

const int NR_POINTLIGHTS = 4;
const int NR_SPOTLIGHTS = 8;
const int NR_DIRLIGHTS = 2;
#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: SpotLight = require('./lighting/spotlight.glsl')
#pragma glslify: DirLight = require('./lighting/dirlight.glsl')
#pragma glslify: Material = require('./material.glsl')
#pragma glslify: calculateDiffusion = require('./maps/calculate_diffusion.glsl', texture=texture)
#pragma glslify: calculateNormal = require('./maps/calculate_normal.glsl', texture=texture)
precision mediump float;

uniform Material material;
uniform float ambient_strength;
uniform PointLight pointLights[NR_POINTLIGHTS];
uniform SpotLight spotLights[NR_SPOTLIGHTS];
uniform DirLight dirLights[NR_DIRLIGHTS];

#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', \
, NR_POINTLIGHTS=NR_POINTLIGHTS, NR_SPOTLIGHTS=NR_SPOTLIGHTS, NR_DIRLIGHTS=NR_DIRLIGHTS, \
, pointLights=pointLights, spotLights=spotLights, dirLights=dirLights)

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
        vec3 norm = calculateNormal(material, textCoord, normalize(normal), FragPos);
        vec3 lighting = calculateLighting(material, textCoord, FragPos, norm, viewPos);
        FragColor = vec4(lighting, 1.0);
    }
    FragColor *= vec4(calculateDiffusion(material, textCoord), 1.0);
}
