import { describe, test, expect } from 'vitest'
import { fuzzyMatchTeam } from '../../src/refresh/teamsheet/fuzzy-match-team.ts'

const teams = [
  { teamId: 1, name: 'Rochdale', alias: 'Rochdale' },
  { teamId: 2, name: 'Wycombe', alias: 'Wycombe' },
  { teamId: 3, name: 'Brighton & Hove Albion', alias: 'Brighton' },
  { teamId: 4, name: 'Forest Green Rovers', alias: 'Forest Green' },
  { teamId: 5, name: 'Charlton Athletic', alias: 'Charlton' },
]

const sameCityTeams = [
  { teamId: 45, name: 'Sheffield United', alias: 'Sheff Utd' },
  { teamId: 46, name: 'Sheffield Wednesday', alias: 'Sheff Wed' },
  { teamId: 90, name: 'Bristol City', alias: 'Bristol City' },
  { teamId: 91, name: 'Bristol Rovers', alias: 'Bristol Rovers' },
]

describe('fuzzyMatchTeam', () => {
  test.each([
    ['Rochdale', 1],
    ['Brighton', 3],
    ['Forest Green', 4],
  ])('should confidently match "%s" to team %i', (input, expectedTeamId) => {
    const result = fuzzyMatchTeam(teams, input)
    expect(result.category).toBe('confident')
    expect(result.bestMatch?.teamId).toBe(expectedTeamId)
  })

  test.each([
    ['Sheffield United', 45],
    ['Sheffield Wednesday', 46],
    ['Bristol City', 90],
    ['Bristol Rovers', 91],
  ])('should not confuse same-city clubs: "%s" matches team %i', (input, expectedTeamId) => {
    const result = fuzzyMatchTeam(sameCityTeams, input)
    expect(result.category).toBe('confident')
    expect(result.bestMatch?.teamId).toBe(expectedTeamId)
  })

  test('should return unrecognized for no match', () => {
    const result = fuzzyMatchTeam(teams, 'Xyzzynospam')
    expect(result.category).toBe('unrecognized')
  })

  test('should handle source text with name - team format', () => {
    const result = fuzzyMatchTeam(teams, 'Keeper - Rochdale')
    expect(result.bestMatch?.teamId).toBe(1)
  })

  test('should handle empty input', () => {
    const result = fuzzyMatchTeam(teams, '')
    expect(result.category).toBe('unrecognized')
    expect(result.confidence).toBe(0)
  })

  test('should return candidates', () => {
    const result = fuzzyMatchTeam(teams, 'Rochdale')
    expect(result.candidates.length).toBeGreaterThan(0)
  })
})
