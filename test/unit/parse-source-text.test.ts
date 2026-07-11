import { describe, test, expect } from 'vitest'
import { parseSourceText } from '../../src/refresh/teamsheet/parse-source-text.ts'

describe('parseSourceText', () => {
  test('should split name and team on last separator', () => {
    expect(parseSourceText('Henderson - Rochdale')).toEqual({ name: 'Henderson', team: 'Rochdale' })
  })

  test('should handle double-barrelled names', () => {
    expect(parseSourceText('Sarpeng-Wiredu - Charlton')).toEqual({ name: 'Sarpeng-Wiredu', team: 'Charlton' })
  })

  test('should handle multi-word team names', () => {
    expect(parseSourceText('Phillips - West Brom')).toEqual({ name: 'Phillips', team: 'West Brom' })
  })

  test('should return full text as name when no separator', () => {
    expect(parseSourceText('Rochdale')).toEqual({ name: 'Rochdale', team: '' })
  })

  test('should handle empty string', () => {
    expect(parseSourceText('')).toEqual({ name: '', team: '' })
  })

  test('should trim whitespace', () => {
    expect(parseSourceText('  Henderson  -  Rochdale  ')).toEqual({ name: 'Henderson', team: 'Rochdale' })
  })
})
