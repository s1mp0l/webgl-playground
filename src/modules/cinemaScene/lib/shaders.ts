import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';
import { cross, dot, normalize, subtractVectors } from '../../../shared/lib/math/vector';

export const vertexShaderSource = vertexShader;
export const fragmentShaderSource = fragmentShader;

export function initBuffers(gl: WebGLRenderingContext): {
  position: WebGLBuffer | null;
  color: WebGLBuffer | null;
  indices: WebGLBuffer | null;
} {
  // Создаем вершины для прямоугольника (параллелепипеда)
  const positions = new Float32Array([
    // Передняя грань
    -4.0, -3.0,  1.0,
     4.0, -3.0,  1.0,
     4.0,  3.0,  1.0,
    -4.0,  3.0,  1.0,
    // Задняя грань
    -4.0, -3.0, -1,
    -4.0,  3.0, -1,
     4.0,  3.0, -1,
     4.0, -3.0, -1,
  ]);

  const colors = new Float32Array([
    // Передняя грань (красная)
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // Задняя грань (синяя)
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ]);

  const indices = new Uint16Array([
    0, 1, 2,    0, 2, 3,    // передняя грань
    4, 5, 6,    4, 6, 7,    // задняя грань
    0, 4, 7,    0, 7, 1,    // нижняя грань
    3, 2, 6,    3, 6, 5,    // верхняя грань
    0, 3, 5,    0, 5, 4,    // левая грань
    1, 7, 6,    1, 6, 2,    // правая грань
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

export function createViewMatrix(cameraPosition: [number, number, number], target: [number, number, number], up: [number, number, number]): Float32Array {
  const zAxis = normalize(subtractVectors(cameraPosition, target));
  const xAxis = normalize(cross(up, zAxis));
  const yAxis = normalize(cross(zAxis, xAxis));

  return new Float32Array([
    xAxis[0], yAxis[0], zAxis[0], 0,
    xAxis[1], yAxis[1], zAxis[1], 0,
    xAxis[2], yAxis[2], zAxis[2], 0,
    -dot(xAxis, cameraPosition),
    -dot(yAxis, cameraPosition),
    -dot(zAxis, cameraPosition),
    1,
  ]);
}