#pragma glslify: Material = require('../material.glsl')

precision mediump float;

vec3 calculateDiffusion(Material material, vec2 textCoord)
{
    vec3 texture_color = vec3(0, 0, 0);
    float denom = material.diff_map_1_strength + material.diff_map_2_strength + material.color_strength;
    texture_color += material.diff_map_1_strength * vec3(texture(material.diff_map_1, textCoord)) / denom;
    texture_color += material.diff_map_2_strength * vec3(texture(material.diff_map_2, textCoord)) / denom;
    texture_color += material.color_strength * material.color / denom;
    return texture_color;
}

#pragma glslify: export(calculateDiffusion)