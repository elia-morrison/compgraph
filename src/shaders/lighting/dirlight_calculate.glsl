#pragma glslify: DirLight = require('./dirlight.glsl')
#pragma glslify: Material = require('../material.glsl')
precision mediump float;

vec3 dirLightCalculate(DirLight light, Material material, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    float attenuation = max(dot(normal, lightDir), 0.0);
    attenuation = attenuation * clamp(1. - light.intensity, 0., 1.);
    return vec3(attenuation, attenuation, attenuation);
}

#pragma glslify: export(dirLightCalculate)