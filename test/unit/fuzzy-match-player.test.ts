import { describe, test, expect } from 'vitest'
import { fuzzyMatchPlayer } from '../../src/refresh/teamsheet/fuzzy-match-player.ts'

const players = [
  { playerId: 1, firstName: 'Ian', lastName: 'Henderson', position: 'Forward', teamId: 1, team: { teamId: 1, name: 'Rochdale', alias: 'Rochdale' } },
  { playerId: 2, firstName: 'Adebayo', lastName: 'Akinfenwa', position: 'Forward', teamId: 2, team: { teamId: 2, name: 'Wycombe', alias: 'Wycombe' } },
  { playerId: 3, firstName: 'Matt', lastName: 'Phillips', position: 'Midfielder', teamId: 3, team: { teamId: 3, name: 'West Bromich Albion', alias: 'West Brom' } },
  { playerId: 4, firstName: 'Ebou', lastName: 'Adams', position: 'Midfielder', teamId: 4, team: { teamId: 4, name: 'Forest Green Rovers', alias: 'Forest Green' } },
  { playerId: 5, firstName: 'Joe', lastName: 'Adams', position: 'Midfielder', teamId: 5, team: { teamId: 5, name: 'Bury', alias: 'Bury' } },
  { playerId: 6, firstName: 'Daniel', lastName: 'Sanchez Ayala', position: 'Defender', teamId: 6, team: { teamId: 6, name: 'Middlesbrough', alias: 'Middlesbrough' } },
  { playerId: 7, firstName: 'Desire', lastName: 'Segbe Azankpo', position: 'Forward', teamId: 7, team: { teamId: 7, name: 'Oldham Athletic', alias: 'Oldham' } },
  { playerId: 8, firstName: 'Ian', lastName: 'Henderson', position: 'Forward', teamId: 8, team: { teamId: 8, name: 'Millwall', alias: 'Millwall' } },
]

describe('fuzzyMatchPlayer', () => {
  test('should match exact player name and team', () => {
    const result = fuzzyMatchPlayer(players, 'Henderson - Rochdale', 'Forward')
    expect(result.category).toBe('confident')
    expect(result.bestMatch?.playerId).toBe(1)
  })

  test('should detect transfer when team differs', () => {
    const result = fuzzyMatchPlayer(players, 'Henderson - Brighton', 'Forward')
    expect(result.category).toBe('transfer')
    expect(result.bestMatch?.playerId).toBeDefined()
    expect(result.transferInfo).not.toBeNull()
    expect(result.transferInfo?.spreadsheetTeamName).toBe('Brighton')
  })

  test('should return unrecognized for no match', () => {
    const result = fuzzyMatchPlayer(players, 'Xyzzynospam - Nowhere', 'Forward')
    expect(result.category).toBe('unrecognized')
  })

  test('should filter by position', () => {
    const result = fuzzyMatchPlayer(players, 'Phillips - West Brom', 'Midfielder')
    expect(result.category).toBe('confident')
    expect(result.bestMatch?.playerId).toBe(3)
  })

  test('should match when team has alias', () => {
    const result = fuzzyMatchPlayer(players, 'Adams - Forest Green', 'Midfielder')
    expect(result.category).toBe('confident')
    expect(result.bestMatch?.playerId).toBe(4)
  })

  test('should parse source text correctly', () => {
    const result = fuzzyMatchPlayer(players, 'Henderson - Rochdale', 'Forward')
    expect(result.parsedName).toBe('Henderson')
    expect(result.parsedTeam).toBe('Rochdale')
  })

  test('should return candidates', () => {
    const result = fuzzyMatchPlayer(players, 'Henderson - Rochdale', 'Forward')
    expect(result.candidates.length).toBeGreaterThan(0)
  })

  test('should handle empty source text', () => {
    const result = fuzzyMatchPlayer(players, '', 'Forward')
    expect(result.category).toBe('unrecognized')
    expect(result.confidence).toBe(0)
  })

  test('should match multi-word surnames', () => {
    const result = fuzzyMatchPlayer(players, 'Segbe Azankpo - Oldham', 'Forward')
    expect(result.bestMatch?.playerId).toBe(7)
  })
})
