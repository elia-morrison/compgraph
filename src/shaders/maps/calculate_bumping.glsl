#pragma glslify: Material = require('../material.glsl')

precision mediump float;

// vec3 calculateBumping(Material material, vec2 textCoord, vec3 normal)
// {
//     if (material.bumpiness == 0.0) {
//         return normal;
//     }
//     vec3 bumpedNormal = texture2D(material.normal_map, textCoord).xyz * 2.0 - 1.0;
//     vec3 resultNormal = normalize(normal + material.bumpiness * bumpedNormal);

//     return resultNormal;
// }

vec3 calculateBumping(Material material, vec2 texCoord, vec3 normal, vec3 where) {
    if (material.bumpiness == 0.0) {
        return normal;
    }
    vec3 tangentNormal = texture(material.normal_map, texCoord).xyz * 2.0 - 1.0;

    vec3 p_dx = dFdx(where);
    vec3 p_dy = dFdy(where);

    vec2 tc_dx = dFdx(texCoord);
    vec2 tc_dy = dFdy(texCoord);

    vec3 t = normalize( tc_dy.y * p_dx - tc_dx.y * p_dy );
    vec3 b = normalize( tc_dy.x * p_dx - tc_dx.x * p_dy );

    vec3 n = normalize(normal);
    vec3 x = cross(n, t);
    t = cross(x, n);
    t = normalize(t);

    x = cross(b, n);
    b = cross(n, x);
    b = normalize(b);
    mat3 tbn = mat3(t, b, n);
    
    vec3 bumpedNormal = mix(n, normalize(tbn * tangentNormal), material.bumpiness);

    return bumpedNormal;
}

#pragma glslify: export(calculateBumping)