#pragma glslify: Material = require('../material.glsl')
precision mediump float;

vec3 lambertian(Material material, 
             vec3 lightDir, 
             vec3 attenuation, 
             vec3 normal, 
             vec3 fragPos, 
             vec3 viewDir) 
{
    float diff = max(dot(normal, lightDir), 0.0);
    return vec3(diff, diff, diff);
}

#pragma glslify: export(lambertian)