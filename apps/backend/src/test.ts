export function sum(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function internalCalculation(a: number, b: number): number {
  if (a > b) {
    return a * 2;
  }

  if (a === b) {
    return a * b;
  }

  return b * 3;
}
