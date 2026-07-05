export function compare (a: string | number | boolean, b: string | number | boolean): number {
  const order = a < b ? -1 : 1
  return a === b ? 0 : order
}
