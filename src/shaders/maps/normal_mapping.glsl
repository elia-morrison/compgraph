#pragma glslify: Material = require('../material.glsl')
#pragma glslify: calculate_tbn = require('../geometry/calculate_tbn.glsl')

precision mediump float;

vec3 normalMapping(Material material, vec2 texCoord, vec3 normal, vec3 where) {
    if (material.normal_map_strength == 0.0) {
        return normal;
    }
    vec3 tangentNormal = texture(material.normal_map, texCoord).xyz * 2.0 - 1.0;

    mat3 tbn = calculate_tbn(texCoord, normal, where);
    
    vec3 bumpedNormal = mix(normal, normalize(tbn * tangentNormal), material.normal_map_strength);

    return bumpedNormal;
}

#pragma glslify: export(normalMapping)