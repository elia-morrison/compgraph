precision mediump float;

mat3 calculate_tbn(vec2 texCoord, vec3 normal, vec3 where) {
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
    return mat3(t, b, n);
}

#pragma glslify: export(calculate_tbn)