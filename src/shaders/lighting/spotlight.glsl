precision mediump float;

struct SpotLight {
    vec3 position;
    vec3 direction;
    float cutOff;
    float outerCutOff;
    float radius;

    vec3 color;
};

#pragma glslify: export(SpotLight)