#pragma glslify: SpotLight = require('./spotlight.glsl')
#pragma glslify: Material = require('../material.glsl')
#define LIGHT_CUTOFF 0.5
precision mediump float;

vec3 spotLightCalculate(SpotLight light, Material material, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    float diff = max(dot(normal, lightDir), 0.0);
    // attenuation
    float distance = length(light.position - fragPos);
    float d = max(distance - light.radius, 0.);
    float denom = d/light.radius + 1.;
    float attenuation = 1. / (denom*denom);
    attenuation = (attenuation - LIGHT_CUTOFF) / (1. - LIGHT_CUTOFF);
    attenuation = max(attenuation, 0.);   
    // spotlight intensity
    float theta = dot(lightDir, normalize(-light.direction)); 
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) * light.intensity/ epsilon, 0.0, 1.0);
    attenuation = attenuation * (1. - intensity);
    return vec3(attenuation, attenuation, attenuation);
}

#pragma glslify: export(spotLightCalculate)