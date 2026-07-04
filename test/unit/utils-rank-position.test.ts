import { rankPosition } from '../../src/utils/rank-position.ts'

describe('player position ranking', () => {
  test('defenders are ranked first', () => {
    expect(rankPosition('Defender')).toBe(0)
  })

  test('midfielders are ranked second', () => {
    expect(rankPosition('Midfielder')).toBe(1)
  })

  test('forwards are ranked third', () => {
    expect(rankPosition('Forward')).toBe(2)
  })

  test('unknown positions default to the forward rank', () => {
    expect(rankPosition('Striker')).toBe(2)
    expect(rankPosition(undefined)).toBe(2)
  })
})
