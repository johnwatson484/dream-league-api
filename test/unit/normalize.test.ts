import { describe, test, expect } from 'vitest'
import { normalizePlayerName, normalizeTeamName, isTeamMatch } from '../../src/refresh/teamsheet/normalize.ts'

describe('normalizePlayerName', () => {
  test('should lowercase', () => {
    expect(normalizePlayerName('Henderson')).toBe('henderson')
  })

  test('should not strip football suffixes from player names', () => {
    expect(normalizePlayerName('Town')).toBe('town')
    expect(normalizePlayerName('County')).toBe('county')
    expect(normalizePlayerName('Townsend')).toBe('townsend')
  })

  test('should collapse whitespace', () => {
    expect(normalizePlayerName('  multiple   spaces  ')).toBe('multiple spaces')
  })

  test('should replace non-word characters with spaces', () => {
    expect(normalizePlayerName("O'Brien")).toBe('o brien')
  })

  test('should return empty for falsy input', () => {
    expect(normalizePlayerName('')).toBe('')
  })
})

describe('normalizeTeamName', () => {
  test('should lowercase', () => {
    expect(normalizeTeamName('Henderson')).toBe('henderson')
  })

  test('should strip football suffixes', () => {
    expect(normalizeTeamName('Forest Green Rovers')).toBe('forest green')
    expect(normalizeTeamName('Brighton & Hove Albion')).toBe('brighton hove')
    expect(normalizeTeamName('Charlton Athletic')).toBe('charlton')
    expect(normalizeTeamName('Manchester United')).toBe('manchester')
    expect(normalizeTeamName('Manchester City')).toBe('manchester')
  })

  test('should collapse whitespace', () => {
    expect(normalizeTeamName('  multiple   spaces  ')).toBe('multiple spaces')
  })

  test('should replace non-word characters with spaces', () => {
    expect(normalizeTeamName("O'Brien")).toBe('o brien')
  })

  test('should return empty for falsy input', () => {
    expect(normalizeTeamName('')).toBe('')
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
