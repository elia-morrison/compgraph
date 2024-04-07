#pragma glslify: PointLight = require('./pointlight.glsl')
#pragma glslify: Material = require('../material.glsl')
precision mediump float;

vec3 pointLightCalculate(PointLight light, Material material, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float d = max(distance - light.radius, 0.);
    float denom = d/light.radius + 1.;
    float attenuation = 1. / (denom*denom);
    attenuation = (attenuation - LIGHT_CUTOFF) / (1. - LIGHT_CUTOFF);
    attenuation = max(attenuation, 0.);
    
    // combine all
    vec3 ambient  = light.color * material.ambient;
    vec3 diffuse  = light.color * diff * material.diffusion;
    vec3 specular = light.color * spec * material.specular;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return ambient + diffuse + specular;
}

#pragma glslify: export(pointLightCalculate)