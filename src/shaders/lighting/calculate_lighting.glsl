#pragma glslify: PointLight = require('./pointlight.glsl')
#pragma glslify: SpotLight = require('./spotlight.glsl')
#pragma glslify: DirLight = require('./dirlight.glsl')
#pragma glslify: pointLightCalculate = require('./pointlight_calculate.glsl')
#pragma glslify: spotLightCalculate = require('./spotlight_calculate.glsl')
#pragma glslify: dirLightCalculate = require('./dirlight_calculate.glsl')
#pragma glslify: Material = require('../material.glsl')
#pragma glslify: phong = require('../illumination/phong.glsl')
#pragma glslify: calculateToon = require('./toon.glsl')
#pragma glslify: calculateRim = require('./rim.glsl')
precision mediump float;

vec3 calculateLighting(Material material, vec2 textCoord,
                       vec3 where, vec3 normal, 
                       vec3 viewPos) {
    vec3 norm = normalize(normal);
    vec3 viewDir = normalize(viewPos - where);

    vec3 result = vec3(0, 0, 0);

    for(int i = 0; i < NR_POINTLIGHTS; i++)
    {
        vec3 attenuation = pointLightCalculate(pointLights[i], material, norm, where, viewDir);    
        vec3 lightDir = normalize(pointLights[i].position - where);
        result += phong(material, lightDir, pointLights[i].color, attenuation, norm, where, viewDir);
    }

    for(int i = 0; i < NR_SPOTLIGHTS; i++)
    {
        vec3 attenuation = spotLightCalculate(spotLights[i], material, norm, where, viewDir);    
        vec3 lightDir = normalize(spotLights[i].position - where);
        result += phong(material, lightDir, spotLights[i].color, attenuation, norm, where, viewDir);
    }

    for(int i = 0; i < NR_DIRLIGHTS; i++)
    {
        vec3 attenuation = dirLightCalculate(dirLights[i], material, norm, where, viewDir);    
        vec3 lightDir = normalize(dirLights[i].direction);
        result += phong(material, lightDir, dirLights[i].color, attenuation, norm, where, viewDir);
    }

    result = (1. - material.tooniness) * result + material.tooniness * calculateToon(result, material);

    result += calculateRim(material, norm, viewDir);

    return result;
}

#pragma glslify: export(calculateLighting)