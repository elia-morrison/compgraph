#pragma glslify: PointLight = require('./pointlight.glsl')
#pragma glslify: pointLightCalculate = require('./pointlight_calculate.glsl')
#pragma glslify: Material = require('../material.glsl')
#pragma glslify: phong = require('../illumination/phong.glsl')
#pragma glslify: calculateToon = require('./toon.glsl')
#pragma glslify: calculateRim = require('./rim.glsl')
precision mediump float;

vec3 calculateLighting(Material material, vec2 textCoord,
                       vec3 where, vec3 normal, 
                       vec3 viewPos, PointLight pointLights[NR_POINT_LIGHTS]) {
    vec3 norm = normalize(normal);
    vec3 viewDir = normalize(viewPos - where);

    vec3 result = vec3(0, 0, 0);

    for(int i = 0; i < NR_POINT_LIGHTS; i++)
    {
        vec3 attenuation = pointLightCalculate(pointLights[i], material, norm, where, viewDir);    
        vec3 lightDir = normalize(pointLights[i].position - where);
        result += phong(material, lightDir, pointLights[i].color, attenuation, normal, where, viewDir);
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

    return result;
}

#pragma glslify: export(calculateLighting)