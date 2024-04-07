#define NR_POINT_LIGHTS 4
#define LIGHT_CUTOFF 0.5

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: pointLightCalculate = require('./lighting/pointlight_calculate.glsl', LIGHT_CUTOFF=LIGHT_CUTOFF)
#pragma glslify: DirLight = require('./lighting/dirlight.glsl')
#pragma glslify: dirLightCalculate = require('./lighting/dirlight_calculate.glsl')
#pragma glslify: Material = require('./material.glsl')

#pragma glslify: calculateToon = require('./lighting/toon.glsl')
#pragma glslify: calculateRim = require('./lighting/rim.glsl')

precision mediump float;

uniform Material material;
uniform float ambient_strength;

varying vec3 fragColor;
varying vec3 normal;
varying vec2 textCoord;

varying vec3 FragPos;
uniform vec3 viewPos;

uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform DirLight dirLight;


void main()
{
    // properties
    vec3 norm = normalize(normal);
    vec3 viewDir = normalize(viewPos - FragPos);

    // phase 1: Directional lighting
    vec3 result = vec3(0, 0, 0);
    
    result += dirLightCalculate(dirLight, material, norm, viewDir);

    for(int i = 0; i < NR_POINT_LIGHTS; i++)
    {
        result += pointLightCalculate(pointLights[i], material, norm, FragPos, viewDir);    
    }

    vec3 texture_color = vec3(0, 0, 0);
    if (material.use_texture)
    {
        texture_color = vec3(texture2D(material.diffuse_map, textCoord));
    }
    else
    {
        texture_color = material.color;
    }

    result = (1. - material.tooniness) * result + material.tooniness * calculateToon(result, material);

    result *= texture_color; 

    result += calculateRim(material, norm, viewDir);
    
    gl_FragColor = vec4(result, 1.0);
}
