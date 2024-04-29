#pragma glslify: Material = require('../material.glsl')
#pragma glslify: calculate_tbn = require('../geometry/calculate_tbn.glsl')

precision mediump float;

vec3 bumpMapping(Material material, vec2 texCoord, vec3 normal, vec3 where) {
    if (material.bumpiness == 0.0) {
        return normal;
    }

    float height = texture(material.bump_map, texCoord).r;
    vec2 dTexCoord = vec2(0.01, 0.0);
    float heightRight = texture(material.bump_map, texCoord + dTexCoord).r;
    float heightUp = texture(material.bump_map, texCoord + dTexCoord.yx).r;

    vec3 tangent = normalize(where - dTexCoord.x * heightRight);
    vec3 bitangent = normalize(where - dTexCoord.y * heightUp);
    vec3 bumpedNormal = height * normal + material.bumpiness * (tangent + bitangent);

    return normalize(bumpedNormal);
}

#pragma glslify: export(bumpMapping)