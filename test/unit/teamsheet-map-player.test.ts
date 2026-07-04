import { mapPlayer } from '../../src/teamsheet/map-player.ts'

describe('teamsheet player mapping', () => {
  test('maps a player with their teamsheet match details', () => {
    const player = {
      dataValues: {
        playerId: 10,
        position: 'Midfielder',
        team: { dataValues: { name: 'Arsenal', teamId: 1 } },
      },
      fullName: 'Martin Odegaard',
      lastNameFirstName: 'Odegaard, Martin',
      managerPlayers: { dataValues: { substitute: false } },
    }
    const teamsheet = [
      { dataValues: { bestMatchId: 10, position: 'Midfielder' }, player: 'M. Odegaard', distance: 2 },
    ]

    const result = mapPlayer(player, teamsheet)

    expect(result).toEqual({
      playerId: 10,
      fullName: 'Martin Odegaard',
      lastNameFirstName: 'Odegaard, Martin',
      position: 'Midfielder',
      team: 'Arsenal',
      teamId: 1,
      sourceName: 'M. Odegaard',
      matchDistance: 2,
      substitute: false,
    })
  })

  test('returns empty source name and distance when no teamsheet match is found', () => {
    const player = {
      dataValues: {
        playerId: 20,
        position: 'Forward',
        team: { dataValues: { name: 'Liverpool', teamId: 3 } },
      },
      fullName: 'Mohamed Salah',
      lastNameFirstName: 'Salah, Mohamed',
      managerPlayers: { dataValues: { substitute: false } },
    }
    const teamsheet = []

    const result = mapPlayer(player, teamsheet)

    expect(result.sourceName).toBe('')
    expect(result.matchDistance).toBe('')
  })

  test('matches on both player ID and position to find the correct teamsheet entry', () => {
    const player = {
      dataValues: {
        playerId: 10,
        position: 'Midfielder',
        team: { dataValues: { name: 'Arsenal', teamId: 1 } },
      },
      fullName: 'Martin Odegaard',
      lastNameFirstName: 'Odegaard, Martin',
      managerPlayers: { dataValues: { substitute: false } },
    }
    const teamsheet = [
      { dataValues: { bestMatchId: 10, position: 'Forward' }, player: 'Wrong Match', distance: 5 },
      { dataValues: { bestMatchId: 10, position: 'Midfielder' }, player: 'Correct Match', distance: 1 },
    ]

    const result = mapPlayer(player, teamsheet)

    expect(result.sourceName).toBe('Correct Match')
    expect(result.matchDistance).toBe(1)
  })
})
