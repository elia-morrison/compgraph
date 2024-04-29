#pragma glslify: Material = require('../material.glsl')
#pragma glslify: bumpMapping = require('./bump_mapping.glsl', texture=texture)
#pragma glslify: normalMapping = require('./normal_mapping.glsl', texture=texture)

precision mediump float;

vec3 calculateNormal(Material material, vec2 texCoord, vec3 normal, vec3 where) {
    float denom = material.bumpiness + material.normal_map_strength;
    vec3 bumpedNormal = normalize(bumpMapping(material, texCoord, normal, where));
    vec3 normalMapNormal = normalize(normalMapping(material, texCoord, normal, where));

    return normalize(mix(normalMapNormal, bumpedNormal, material.normal_bump_mix));
}

#pragma glslify: export(calculateNormal)