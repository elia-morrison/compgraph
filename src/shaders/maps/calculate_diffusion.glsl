#pragma glslify: Material = require('../material.glsl')

precision mediump float;

vec3 calculateDiffusion(Material material, vec2 textCoord)
{
    vec3 texture_color = vec3(0, 0, 0);
    texture_color += material.diff_map_1_strength * vec3(texture2D(material.diff_map_1, textCoord));
    texture_color += material.diff_map_2_strength * vec3(texture2D(material.diff_map_2, textCoord));
    texture_color += material.color_strength * material.color;
    return texture_color;
}

#pragma glslify: export(calculateDiffusion)