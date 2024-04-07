#define NR_POINT_LIGHTS 4
#define LIGHT_CUTOFF 0.5
#define RIM_WIDTH 0.8

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: pointLightCalculate = require('./lighting/pointlight_calculate.glsl', LIGHT_CUTOFF=LIGHT_CUTOFF)
#pragma glslify: Material = require('./material.glsl')
precision mediump float;

uniform Material material;

uniform float ambient_strength;

varying vec3 fragColor;
varying vec3 normal;
varying vec2 textCoord;

varying vec3 FragPos;
uniform vec3 viewPos;
uniform PointLight pointLights[NR_POINT_LIGHTS];

struct DirLight {
    vec3 direction;
    float intensity;
    vec3 color;
};

uniform DirLight dirLight;

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
        result += pointLightCalculate(pointLights[i], material, norm, FragPos, viewDir);    
    }

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
