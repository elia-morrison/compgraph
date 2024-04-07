precision mediump float;

struct Material {
    bool use_texture;
    bool use_fragment_shading;
    sampler2D diffuse_map;
    vec3 color;

    float shininess;
    float ambient;
    float specular;
    float diffusion;

    float tooniness;
    float rim_strength;
    vec3 rim_color;
};

#pragma glslify: export(Material)