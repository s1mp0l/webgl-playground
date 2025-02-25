precision mediump float;
uniform sampler2D uImage;
uniform vec3 uTargetColor;
uniform float uTolerance;
varying vec2 texCoord;

void main() {
  vec4 color = texture2D(uImage, texCoord);
  float distance = length(color.rgb - uTargetColor);
  
  if (distance < uTolerance / 255.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    gl_FragColor = color;
  }
} 