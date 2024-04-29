#version 300 es

#define NR_POINT_LIGHTS 4

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: Material = require('./material.glsl')
#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', NR_POINT_LIGHTS=NR_POINT_LIGHTS)

precision mediump float;

in vec3 vertPosition;
in vec3 vertNormal;
in vec2 vertUV;
out vec2 textCoord;
out vec3 normal;
out vec3 FragPos;
out vec3 resultingColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 rotMatr;
uniform mat4 mProj;

uniform Material material;
uniform float ambient_strength;
uniform PointLight pointLights[NR_POINT_LIGHTS];
uniform vec3 viewPos;

void main()
{
  textCoord = vertUV;
  vec4 normal_homog = rotMatr * vec4(vertNormal, 1.0);
  normal = normal_homog.xyz/normal_homog.w;
  vec4 world_homog = mWorld * vec4(vertPosition, 1.0);
  FragPos = world_homog.xyz/world_homog.w;
  gl_Position = mProj * mView * world_homog;

  if (!material.use_fragment_shading) {
    resultingColor = calculateLighting(material, vertUV, FragPos, normal, viewPos, pointLights);
  }
}
