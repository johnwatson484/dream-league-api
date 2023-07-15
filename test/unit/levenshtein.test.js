const { calculateDistance } = require('../../app/levenshtein')

describe('levenshtein distance', () => {
  test('calculates distance', () => {
    const result = calculateDistance('car', 'bar')
    expect(result).toBe(1)
  })

  test('calculates distance with long word', () => {
    const result = calculateDistance('encyclopedia', 'edcyclipexia')
    expect(result).toBe(3)
  })

  test('calculates distance with multiple words', () => {
    const result = calculateDistance('the cat in the hat', 'the rat on the mat')
    expect(result).toBe(3)
  })

  test('calculates distance with multiple length words', () => {
    const result = calculateDistance('great', 'get')
    expect(result).toBe(2)
  })

  test('calculates distance with multiple words and length', () => {
    const result = calculateDistance('great goal', 'get foals')
    expect(result).toBe(4)
  })

  test('calculates distance with multiple words and length with no spaces', () => {
    const result = calculateDistance('greatgoal', 'getfoals')
    expect(result).toBe(4)
  })

  test('calculates distance of case', () => {
    const result = calculateDistance('car', 'CaR')
    expect(result).toBe(2)
  })
})
