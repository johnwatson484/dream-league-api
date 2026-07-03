import { orderTable } from '../../src/results/order-table.js'

describe('league table ordering', () => {
  test('managers are ranked by points in descending order', () => {
    const rows = [
      { manager: 'Bob', points: 6, gd: 0, gf: 5 },
      { manager: 'Alice', points: 9, gd: 0, gf: 5 },
    ]

    const result = orderTable(rows)

    expect(result[0].manager).toBe('Alice')
    expect(result[1].manager).toBe('Bob')
  })

  test('goal difference breaks a tie on points', () => {
    const rows = [
      { manager: 'Bob', points: 9, gd: 2, gf: 5 },
      { manager: 'Alice', points: 9, gd: 5, gf: 8 },
    ]

    const result = orderTable(rows)

    expect(result[0].manager).toBe('Alice')
  })

  test('goals scored breaks a tie on points and goal difference', () => {
    const rows = [
      { manager: 'Bob', points: 9, gd: 5, gf: 7 },
      { manager: 'Alice', points: 9, gd: 5, gf: 10 },
    ]

    const result = orderTable(rows)

    expect(result[0].manager).toBe('Alice')
  })

  test('alphabetical name breaks a tie on all numeric fields', () => {
    const rows = [
      { manager: 'Zara', points: 9, gd: 5, gf: 10 },
      { manager: 'Alice', points: 9, gd: 5, gf: 10 },
    ]

    const result = orderTable(rows)

    expect(result[0].manager).toBe('Alice')
  })

  test('each row receives a sequential position number starting at 1', () => {
    const rows = [
      { manager: 'A', points: 3, gd: 0, gf: 0 },
      { manager: 'B', points: 6, gd: 0, gf: 0 },
      { manager: 'C', points: 9, gd: 0, gf: 0 },
    ]

    const result = orderTable(rows)

    expect(result.map(r => r.position)).toEqual([1, 2, 3])
  })

  test('original row data is preserved alongside the position', () => {
    const rows = [
      { manager: 'Alice', points: 9, gd: 5, gf: 10 },
    ]

    const result = orderTable(rows)

    expect(result[0]).toEqual({ position: 1, manager: 'Alice', points: 9, gd: 5, gf: 10 })
  })
})
