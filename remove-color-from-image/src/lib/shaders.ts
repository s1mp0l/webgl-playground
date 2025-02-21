export const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 texCoord;
  void main() {
    texCoord = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShaderSource = `
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
`; 