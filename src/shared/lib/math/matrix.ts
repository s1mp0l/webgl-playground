import { normalize, cross, subtractVectors, dot } from './vector';

/**
 * Создает матрицу перспективной проекции 4x4
 * @param fieldOfViewInRadians - Угол обзора в радианах
 * @param aspect - Соотношение сторон (ширина/высота)
 * @param near - Расстояние до ближней плоскости отсечения
 * @param far - Расстояние до дальней плоскости отсечения
 * @returns Float32Array размером 16 элементов, представляющая матрицу 4x4
 */
export function mat4Perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number): Float32Array {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  const rangeInv = 1.0 / (near - far);

  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ]);
}

/**
 * Умножает две матрицы 4x4
 * @param a - Первая матрица (4x4) в виде Float32Array[16]
 * @param b - Вторая матрица (4x4) в виде Float32Array[16]
 * @returns Float32Array размером 16 элементов, представляющая результат умножения матриц
 */
export function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const result = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[i * 4 + k] * b[k * 4 + j];
      }
      result[i * 4 + j] = sum;
    }
  }
  return result;
}