precision mediump float;

struct DirLight {
    vec3 direction;
    float intensity;
    vec3 color;
};

#pragma glslify: export(DirLight)