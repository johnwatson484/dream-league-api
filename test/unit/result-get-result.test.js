import { getResult } from '../../src/results/get-result.js'

describe('get points', () => {
  test('returns W for a win to nil', () => {
    const result = getResult(1, 0)
    expect(result).toBe('W')
  })

  test('returns W for a win with conceded', () => {
    const result = getResult(2, 1)
    expect(result).toBe('W')
  })

  test('returns D for a 0-0 draw', () => {
    const result = getResult(0, 0)
    expect(result).toBe('D')
  })

  test('returns D for a score draw', () => {
    const result = getResult(1, 1)
    expect(result).toBe('D')
  })

  test('returns L for a loss with no goals', () => {
    const result = getResult(0, 1)
    expect(result).toBe('L')
  })

  test('returns L for a loss with goals', () => {
    const result = getResult(1, 2)
    expect(result).toBe('L')
  })

  test('goals greater than conceded is a win even with negative values', () => {
    const result = getResult(-1, -2)
    expect(result).toBe('W')
  })
})
