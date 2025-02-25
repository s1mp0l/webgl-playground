/**
 * Нормализует вектор (приводит его к единичной длине)
 * @param v - Входной вектор [x, y, z]
 * @returns Нормализованный вектор той же размерности
 */
export function normalize(v: number[]): number[] {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
}

/**
 * Вычисляет векторное произведение двух векторов
 * @param a - Первый вектор [x, y, z]
 * @param b - Второй вектор [x, y, z]
 * @returns Вектор, перпендикулярный обоим входным векторам
 */
export function cross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/**
 * Вычитает один вектор из другого
 * @param a - Вектор, из которого вычитаем [x, y, z]
 * @param b - Вычитаемый вектор [x, y, z]
 * @returns Результат вычитания векторов
 */
export function subtractVectors(a: number[], b: number[]): number[] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/**
 * Вычисляет скалярное произведение двух векторов
 * @param a - Первый вектор [x, y, z]
 * @param b - Второй вектор [x, y, z]
 * @returns Скалярное произведение векторов
 */
export function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
} 