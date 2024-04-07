precision mediump float;
varying vec3 fragColor;
uniform vec3 materialColor;
void main()
{
  float greyFrag = (fragColor.r + fragColor.g + fragColor.b) / 3.0;
  gl_FragColor = vec4(materialColor * greyFrag, 1.0);
}
