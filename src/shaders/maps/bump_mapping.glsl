#pragma glslify: Material = require('../material.glsl')
#pragma glslify: calculate_tbn = require('../geometry/calculate_tbn.glsl')

precision mediump float;

vec3 bumpMapping(Material material, vec2 texCoord, vec3 normal, vec3 where) {
    if (material.bumpiness == 0.0) {
        return normal;
    }
    float height = texture(material.normal_map, texCoord).r;
    float delta = 0.001;
    float heightRight = texture(material.normal_map, texCoord + vec2(delta, 0.0)).r;
    float heightUp = texture(material.normal_map, texCoord + vec2(0.0, delta)).r;

    vec3 gradient = normalize(vec3(heightRight - height, heightUp - height, delta));

    mat3 tbn = calculate_tbn(texCoord, normal, where);


    vec3 bumpedNormal = mix(normal, normalize(tbn * gradient), material.bumpiness);

    return bumpedNormal;
}

#pragma glslify: export(bumpMapping)