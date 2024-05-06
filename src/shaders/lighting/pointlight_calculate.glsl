#pragma glslify: PointLight = require('./pointlight.glsl')
#pragma glslify: Material = require('../material.glsl')
precision mediump float;

vec3 pointLightCalculate(PointLight light, Material material, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    float distance = length(light.position - fragPos);
    float d = max(distance - light.radius, 0.);
    float falloff_power = 1.;
    if (light.quadratic_falloff) {
        falloff_power = 2.;
    }
    float denom = d/light.radius;
    
    float attenuation = 1. / (pow(denom, falloff_power) + 1.);
    attenuation = max(attenuation, 0.) * clamp(light.intensity, 0., 1.);

    return vec3(attenuation, attenuation, attenuation);
}

#pragma glslify: export(pointLightCalculate)