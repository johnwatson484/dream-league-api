const getPoints = require('../../app/results/get-points')

describe('get points', () => {
  test('returns 3 points for a win', () => {
    const result = getPoints('W')
    expect(result).toBe(3)
  })

  test('returns 1 point for a draw', () => {
    const result = getPoints('D')
    expect(result).toBe(1)
  })

  test('returns 0 points for a loss', () => {
    const result = getPoints('L')
    expect(result).toBe(0)
  })

  test('returns 0 points for invalid', () => {
    const result = getPoints('X')
    expect(result).toBe(0)
  })
})
