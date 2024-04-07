#pragma glslify: Material = require('../material.glsl')
#pragma glslify: PointLight = require('../lighting/pointlight.glsl')
#pragma glslify: lambertian = require('./lambertian.glsl')
precision mediump float;

vec3 phong(Material material, 
           vec3 lightDir, 
           vec3 lightColor,
           vec3 attenuation, 
           vec3 normal, 
           vec3 fragPos, 
           vec3 viewDir) 
{
    vec3 diff = lambertian(material, lightDir, attenuation, normal, fragPos, viewDir);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

    vec3 ambient  = lightColor * material.ambient;
    vec3 diffuse  = lightColor * diff * material.diffusion;
    vec3 specular = lightColor * spec * material.specular;
    diffuse  *= attenuation;
    specular *= attenuation;

    return ambient + diffuse + specular;
}

#pragma glslify: export(phong)
