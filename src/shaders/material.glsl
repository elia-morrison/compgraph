precision mediump float;

struct Material {
    bool use_fragment_shading;

    sampler2D diff_map_1;
    float diff_map_1_strength;
    sampler2D diff_map_2;
    float diff_map_2_strength;

    vec3 color;
    float color_strength;

    float shininess;
    float ambient;
    float specular;
    float diffusion;

    float tooniness;
    float rim_strength;
    vec3 rim_color;
};

#pragma glslify: export(Material)