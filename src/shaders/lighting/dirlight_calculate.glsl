#pragma glslify: DirLight = require('./dirlight.glsl')
#pragma glslify: Material = require('../material.glsl')
precision mediump float;

vec3 dirLightCalculate(DirLight light, Material material, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // combine results
    vec3 ambient  = light.color  * material.ambient;
    vec3 diffuse  = light.color  * diff * material.diffusion;
    vec3 specular = light.color  * spec * material.specular;
    return (ambient + diffuse + specular) * light.intensity;
} 

#pragma glslify: export(dirLightCalculate)