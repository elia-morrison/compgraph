precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertUV;
varying vec2 textCoord;
varying vec3 normal;
varying vec3 FragPos;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 rotMatr;
uniform mat4 mProj;

void main()
{
  textCoord = vertUV;
  vec4 normal_homog = rotMatr * vec4(vertNormal, 1.0);
  normal = normal_homog.xyz/normal_homog.w;
  vec4 world_homog = mWorld * vec4(vertPosition, 1.0);
  FragPos = world_homog.xyz/world_homog.w;
  gl_Position = mProj * mView * world_homog;
}
