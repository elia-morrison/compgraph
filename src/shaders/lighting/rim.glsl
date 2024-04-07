#pragma glslify: Material = require('../material.glsl')
#define RIM_WIDTH 0.8

precision mediump float;

vec3 calculateRim(Material material, vec3 normal, vec3 viewDir)
{
    float rimndotv =  max(0.0, RIM_WIDTH - max(dot(normal, viewDir), 0.0));

    vec3 rimLight = rimndotv * material.rim_color * material.rim_strength;
    return rimLight;
}

#pragma glslify: export(calculateRim)