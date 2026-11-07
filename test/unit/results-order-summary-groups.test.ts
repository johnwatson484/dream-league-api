import { orderSummaryGroups } from '../../src/results/order-summary-groups.ts'

const alpha = [{ managerId: 1, points: 6 }, { managerId: 2, points: 3 }]
const beta = [{ managerId: 4, points: 9 }, { managerId: 3, points: 0 }]
const groups = [
  { name: 'Beta', managers: [{ managerId: 3 }, { managerId: 4 }] },
  { name: 'alpha', managers: [{ managerId: 2 }, { managerId: 1 }] },
]

describe('summary group ordering', () => {
  test('orders groups by name while preserving standings and the original summary', () => {
    const tables = [beta, alpha]
    const result = orderSummaryGroups(tables, groups)

    expect(result).toEqual([alpha, beta])
    expect(result[0]).toBe(alpha)
    expect(result[1]).toBe(beta)
    expect(tables).toEqual([beta, alpha])
  })

  test('leaves historical tables with changed membership in their original positions', () => {
    const historical = [{ managerId: 1 }, { managerId: 5 }]
    expect(orderSummaryGroups([beta, historical, alpha], groups)).toEqual([alpha, historical, beta])
  })

  test('leaves ambiguous groups in place when two cups have identical memberships', () => {
    expect(orderSummaryGroups([beta, alpha], [
      ...groups,
      { name: 'Other cup group', managers: alpha },
    ])).toEqual([beta, alpha])
  })

  test('handles empty tables and missing group definitions', () => {
    expect(orderSummaryGroups([], groups)).toEqual([])
    expect(orderSummaryGroups([[], beta, alpha], groups)).toEqual([[], alpha, beta])
    expect(orderSummaryGroups([beta, alpha], [])).toEqual([beta, alpha])
  })
})
