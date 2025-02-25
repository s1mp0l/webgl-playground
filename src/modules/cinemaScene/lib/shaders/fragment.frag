precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
  // Используем текстуру только для передней грани (где vColor белый)
  if (vColor.r == 1.0 && vColor.g == 1.0 && vColor.b == 1.0) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  } else {
    gl_FragColor = vColor;
  }
}