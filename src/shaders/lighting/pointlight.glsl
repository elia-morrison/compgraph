precision mediump float;

struct PointLight {    
    vec3 position;
    float radius;
    vec3 color;
};

#pragma glslify: export(PointLight)