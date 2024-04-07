precision mediump float;

struct PointLight {    
    vec3 position;
    float radius;
    float quadratic_falloff;
    vec3 color;
};

#pragma glslify: export(PointLight)