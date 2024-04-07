#pragma glslify: PointLight, SpotLight = require('./lightsources.glsl')
precision mediump float;

// material properties
struct Material {
    bool use_texture;
    sampler2D diffuse_map;
    vec3 color;

    float shininess;
    float ambient;
    float specular;
    float diffusion;

    float tooniness;
    float rim_strength;
    vec3 rim_color;
};

uniform Material material;

uniform float ambient_strength;

varying vec3 fragColor;
varying vec3 normal;
varying vec2 textCoord;



uniform SpotLight spotLight;

varying vec3 FragPos;
uniform vec3 viewPos;

#define NR_POINT_LIGHTS 4
#define LIGHT_CUTOFF 0.5
#define RIM_WIDTH 0.8
uniform PointLight pointLights[NR_POINT_LIGHTS];

struct DirLight {
    vec3 direction;
    float intensity;
    vec3 color;
};  
uniform DirLight dirLight;

vec3 calculatePointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
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

vec3 calculateDirLight(DirLight light, vec3 normal, vec3 viewDir)
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

vec3 calculateRim(vec3 normal, vec3 viewDir)
{
    float rimndotv =  max(0.0, RIM_WIDTH - max(dot(normal, viewDir), 0.0));

    vec3 rimLight = rimndotv * material.rim_color * material.rim_strength;
    return rimLight;
}

vec3 calculateSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
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
    // spotlight intensity
    float theta = dot(lightDir, normalize(-light.direction)); 
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // combine results
    vec3 ambient  = light.color * material.ambient;
    vec3 diffuse  = light.color * diff * material.diffusion;
    vec3 specular = light.color * spec * material.specular;
    ambient  *= attenuation * (1.-intensity);
    diffuse  *= attenuation * (1.-intensity);
    specular *= attenuation * (1.-intensity);
    return (ambient + diffuse + specular);
    //return light.color * diff * material.diffusion;
}

float reduce_dynamic_range(float normalized_number, float steps)
{
    float step = 1./steps;
    return normalized_number - mod(normalized_number, step) + material.ambient;
}

vec3 calculateToon(vec3 intensity)
{
    float steps = 3.;

    return vec3(reduce_dynamic_range(intensity.x, steps), 
                reduce_dynamic_range(intensity.y, steps),
                reduce_dynamic_range(intensity.z, steps));
}

void main()
{
    // properties
    vec3 norm = normalize(normal);
    vec3 viewDir = normalize(viewPos - FragPos);

    // phase 1: Directional lighting
    vec3 result = vec3(0, 0, 0);
    
    result += calculateDirLight(dirLight, norm, viewDir);

    for(int i = 0; i < NR_POINT_LIGHTS; i++)
    {
        result += calculatePointLight(pointLights[i], norm, FragPos, viewDir);    
    }

    result += calculateSpotLight(spotLight, norm, FragPos, viewDir);

    vec3 texture_color = vec3(0, 0, 0);
    if (material.use_texture)
    {
        texture_color = vec3(texture2D(material.diffuse_map, textCoord));
    }
    else
    {
        texture_color = material.color;
    }

    result = (1. - material.tooniness)*result + material.tooniness*calculateToon(result);

    result *= texture_color; 

    result += calculateRim(norm, viewDir);
    
    gl_FragColor = vec4(result, 1.0);
}
