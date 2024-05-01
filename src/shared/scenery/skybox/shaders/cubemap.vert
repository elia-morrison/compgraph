#version 300 es
precision mediump float;

in vec3 vertPosition;

out vec3 TexCoords;

uniform mat4 mProj;
uniform mat4 mView;

void main()
{
    TexCoords = vertPosition;
    vec4 pos = mProj * mView * vec4(vertPosition, 1.0);
    gl_Position = pos.xyww;
}
