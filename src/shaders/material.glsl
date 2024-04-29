precision mediump float;

struct Material {
    bool use_fragment_shading;

    sampler2D diff_map_1;
    float diff_map_1_strength;
    sampler2D diff_map_2;
    float diff_map_2_strength;

    sampler2D normal_map;
    float normal_map_strength;
    sampler2D bump_map;
    float bumpiness;
    float normal_bump_mix;

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