precision mediump float;

#define LINEAR_FALLOF 1
#define QUADRATIC_FALLOF 2

struct PointLight {    
    vec3 position;
    float radius;
    vec3 color;
};

#pragma glslify: export(PointLight)