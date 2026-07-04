import { mapPosition } from '../../src/refresh/map-position.ts'

describe('position code to name mapping', () => {
  test('GK maps to Goalkeeper', () => {
    expect(mapPosition('GK')).toBe('Goalkeeper')
  })

  test('DEF maps to Defender', () => {
    expect(mapPosition('DEF')).toBe('Defender')
  })

  test('MID maps to Midfielder', () => {
    expect(mapPosition('MID')).toBe('Midfielder')
  })

  test('FWD maps to Forward', () => {
    expect(mapPosition('FWD')).toBe('Forward')
  })

  test('an unknown position code returns undefined', () => {
    expect(mapPosition('XYZ')).toBeUndefined()
  })
})
