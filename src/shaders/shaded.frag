#define NR_POINT_LIGHTS 4

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: Material = require('./material.glsl')
#pragma glslify: calculateDiffusion = require('./maps/calculate_diffusion.glsl')
#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', NR_POINT_LIGHTS=NR_POINT_LIGHTS)

precision mediump float;

uniform Material material;
uniform float ambient_strength;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform vec3 viewPos;

varying vec3 fragColor;
varying vec3 normal;
varying vec2 textCoord;
varying vec3 resultingColor;

varying vec3 FragPos;

void main()
{
    
    if (material.use_fragment_shading) {
        vec3 lighting = calculateLighting(material, textCoord, FragPos, normal, viewPos, pointLights);
        gl_FragColor = vec4(lighting, 1.0);
    }
    else 
    {
        gl_FragColor = vec4(resultingColor, 1.0);
    }
    gl_FragColor *= vec4(calculateDiffusion(material, textCoord), 1.0);
}
