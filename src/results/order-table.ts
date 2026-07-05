import { compare } from '../utils/compare.ts'

export function orderTable (rows: any[]): any[] {
  return rows.toSorted((a, b) => { return compare(b.points, a.points) || compare(b.gd, a.gd) || compare(b.gf, a.gf) || compare(a.manager, b.manager) })
    .map((x, i) => ({ position: i + 1, ...x }))
}
