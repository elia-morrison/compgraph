precision mediump float;

struct PointLight {    
    vec3 position;
    float intensity;
    float radius;
    bool quadratic_falloff;
    vec3 color;
};

#pragma glslify: export(PointLight)