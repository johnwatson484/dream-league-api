import { vi, describe, afterEach, test, expect } from 'vitest'

const { mockTeam } = vi.hoisted(() => ({
  mockTeam: { findOne: vi.fn() },
}))

vi.mock('../../src/data/index.ts', () => ({
  default: {
    Team: mockTeam,
    Sequelize: { Op: { iLike: Symbol('iLike') } },
  },
}))

import { previewPlayers } from '../../src/refresh/players/preview-players.ts'

const players = [{
  firstName: 'Ian',
  lastName: 'Henderson',
  position: 'FWD',
  team: 'Rochdale',
}, {
  firstName: 'Adebayo',
  lastName: 'Akinfenwa',
  position: 'FWD',
  team: 'Wycombe',
}, {
  firstName: 'Joe',
  lastName: 'Bloggs',
  position: 'DEF',
  team: 'Wycombe',
}]

describe('preview players', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should return all players as mapped when all teams match', async () => {
    mockTeam.findOne.mockResolvedValue({ teamId: 1 })

    const result = await previewPlayers(players)

    expect(result.mappedPlayers).toHaveLength(3)
    expect(result.unmappedTeams).toHaveLength(0)
  })

  test('should group unmapped players by team name', async () => {
    mockTeam.findOne.mockResolvedValueOnce({ teamId: 1 })
      .mockResolvedValue(null)

    const result = await previewPlayers(players)

    expect(result.mappedPlayers).toHaveLength(1)
    expect(result.unmappedTeams).toHaveLength(1)
    expect(result.unmappedTeams[0]!.team).toBe('Wycombe')
    expect(result.unmappedTeams[0]!.players).toHaveLength(2)
  })

  test('should return multiple unmapped team groups', async () => {
    mockTeam.findOne.mockResolvedValue(null)

    const result = await previewPlayers(players)

    expect(result.mappedPlayers).toHaveLength(0)
    expect(result.unmappedTeams).toHaveLength(2)
    expect(result.unmappedTeams[0]!.team).toBe('Rochdale')
    expect(result.unmappedTeams[1]!.team).toBe('Wycombe')
  })

  test('should include player details in unmapped teams', async () => {
    mockTeam.findOne.mockResolvedValue(null)

    const result = await previewPlayers(players)

    const rochdale = result.unmappedTeams.find(t => t.team === 'Rochdale')
    expect(rochdale!.players[0]).toEqual({
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'FWD',
    })
  })

  test('should handle invalid position as unmapped', async () => {
    mockTeam.findOne.mockResolvedValue({ teamId: 1 })

    const result = await previewPlayers([{
      firstName: 'Joe',
      lastName: 'Bloggs',
      position: 'ST',
      team: 'Rochdale',
    }])

    expect(result.mappedPlayers).toHaveLength(0)
    expect(result.unmappedTeams).toHaveLength(1)
  })
})
