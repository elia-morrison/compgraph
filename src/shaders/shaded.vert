#define NR_POINT_LIGHTS 4

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: Material = require('./material.glsl')
#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', NR_POINT_LIGHTS=NR_POINT_LIGHTS)

precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertUV;
varying vec2 textCoord;
varying vec3 normal;
varying vec3 FragPos;
varying vec3 resultingColor;

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
