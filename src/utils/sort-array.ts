export function sortArray (a: any, b: any): number {
  const order = a < b ? -1 : 1
  return a === b ? 0 : order
}
