#pragma glslify: Material = require('../material.glsl')

precision mediump float;

float reduce_dynamic_range(float normalized_number, float steps, Material material)
{
    float step = 1./steps;
    return normalized_number - mod(normalized_number, step) + material.ambient;
}

vec3 calculateToon(vec3 intensity, Material material)
{
    float steps = 3.;

    return vec3(reduce_dynamic_range(intensity.x, steps, material), 
                reduce_dynamic_range(intensity.y, steps, material),
                reduce_dynamic_range(intensity.z, steps, material));
}

#pragma glslify: export(calculateToon)