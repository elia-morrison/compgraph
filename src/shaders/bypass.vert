#version 300 es

#pragma glslify: PointLight = require('./lighting/pointlight.glsl')
#pragma glslify: SpotLight = require('./lighting/spotlight.glsl')
#pragma glslify: DirLight = require('./lighting/dirlight.glsl')
#pragma glslify: Material = require('./material.glsl')

const int NR_POINTLIGHTS = 4;
const int NR_SPOTLIGHTS = 8;
const int NR_DIRLIGHTS = 2;

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
uniform PointLight pointLights[NR_POINTLIGHTS];
uniform SpotLight spotLights[NR_SPOTLIGHTS];
uniform DirLight dirLights[NR_DIRLIGHTS];

#pragma glslify: calculateLighting = require('./lighting/calculate_lighting.glsl', \
, NR_POINTLIGHTS=NR_POINTLIGHTS, NR_SPOTLIGHTS=NR_SPOTLIGHTS, NR_DIRLIGHTS=NR_DIRLIGHTS, \
, pointLights=pointLights, spotLights=spotLights, dirLights=dirLights)

uniform vec3 viewPos;

void main()
{
  textCoord = vertUV;
  vec4 normal_homog = rotMatr * vec4(vertNormal, 1.0);
  normal = vertNormal;
  vec4 world_homog = mWorld * vec4(vertPosition, 1.0);
  FragPos = world_homog.xyz/world_homog.w;
  gl_Position = mProj * mView * world_homog;

  if (!material.use_fragment_shading) {
    resultingColor = calculateLighting(material, vertUV, FragPos, normal, viewPos);
  }
}
