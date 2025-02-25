attribute vec2 position;
varying vec2 texCoord;

void main() {
  texCoord = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5); // перевод координат из диапазона [-1, 1] в диапазон [0, 1]
  gl_Position = vec4(position, 0.0, 1.0); // z = 0 (2D), w = 1 (отсутствие перспективы)
} 