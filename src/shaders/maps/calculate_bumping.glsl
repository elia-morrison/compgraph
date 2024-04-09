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
    // vec3 tangentNormal = texture(material.normal_map, texCoord).xyz * 2.0 - 1.0; // Convert from [0, 1] to [-1, 1]

    // // compute derivations of the world position
    // vec3 p_dx = dFdx(where);
    // vec3 p_dy = dFdy(where);
    // // compute derivations of the texture coordinate
    // vec2 tc_dx = dFdx(texCoord);
    // vec2 tc_dy = dFdy(texCoord);
    // // compute initial tangent and bi-tangent
    // vec3 t = normalize( tc_dy.y * p_dx - tc_dx.y * p_dy );
    // vec3 b = normalize( tc_dy.x * p_dx - tc_dx.x * p_dy ); // sign inversion
    // // get new tangent from a given mesh normal
    // vec3 n = normalize(n_obj_i);
    // vec3 x = cross(n, t);
    // t = cross(x, n);
    // t = normalize(t);
    // // get updated bi-tangent
    // x = cross(b, n);
    // b = cross(n, x);
    // b = normalize(b);
    // mat3 tbn = mat3(t, b, n);
    // // Calculate the TBN matrix from the normal, tangent, and bitangent
    // vec3 T = normalize(vec3(model * vec4(tangent, 0.0)));
    // vec3 N = normalize(vec3(model * vec4(normal, 0.0)));
    // // Assuming a "model" matrix is available for transforming normals.
    // // Bitangent is calculated as the cross product of normal and tangent, assuming right-handed coordinates
    // // vec3 B = cross(N, T);
    // // T = cross(B, N); // Re-orthogonalize T in case of non-uniform scaling
    // // mat3 TBN = mat3(T, B, N);

    // // Transform the tangent space normal from the normal map to world space
    // vec3 bumpedNormal = mix(N, normalize(tbn * tangentNormal), material.bumpiness);

    return normal;
}

#pragma glslify: export(calculateBumping)