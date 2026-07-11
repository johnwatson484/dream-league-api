import { describe, test, expect } from 'vitest'
import { normalizeName, isTeamMatch } from '../../src/refresh/teamsheet/normalize.ts'

describe('normalizeName', () => {
  test('should lowercase', () => {
    expect(normalizeName('Henderson')).toBe('henderson')
  })

  test('should strip football suffixes', () => {
    expect(normalizeName('Forest Green Rovers')).toBe('forest green')
    expect(normalizeName('Brighton & Hove Albion')).toBe('brighton hove')
    expect(normalizeName('Charlton Athletic')).toBe('charlton')
    expect(normalizeName('Manchester United')).toBe('manchester')
    expect(normalizeName('Manchester City')).toBe('manchester')
  })

  test('should collapse whitespace', () => {
    expect(normalizeName('  multiple   spaces  ')).toBe('multiple spaces')
  })

  test('should replace non-word characters with spaces', () => {
    expect(normalizeName("O'Brien")).toBe('o brien')
  })

  test('should return empty for falsy input', () => {
    expect(normalizeName('')).toBe('')
  })
})

describe('isTeamMatch', () => {
  test('should match exact names', () => {
    expect(isTeamMatch('Rochdale', 'Rochdale')).toBe(true)
  })

  test('should match when one contains the other', () => {
    expect(isTeamMatch('Forest Green Rovers', 'Forest Green')).toBe(true)
    expect(isTeamMatch('West Brom', 'West Bromich Albion')).toBe(true)
  })

  test('should be case insensitive', () => {
    expect(isTeamMatch('ROCHDALE', 'rochdale')).toBe(true)
  })

  test('should not match different teams', () => {
    expect(isTeamMatch('Rochdale', 'Brighton')).toBe(false)
  })

  test('should require exact match for short names', () => {
    expect(isTeamMatch('QPR', 'QPR')).toBe(true)
    expect(isTeamMatch('QPR', 'QP')).toBe(false)
  })

  test('should return false for empty inputs', () => {
    expect(isTeamMatch('', 'Rochdale')).toBe(false)
    expect(isTeamMatch('Rochdale', '')).toBe(false)
  })
})
