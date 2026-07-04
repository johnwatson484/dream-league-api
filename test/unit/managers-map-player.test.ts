import { mapPlayer } from '../../src/managers/map-player.ts'

describe('manager team player mapping', () => {
  test('maps a player with league and cup goals from Sequelize model data', () => {
    const player = {
      dataValues: {
        playerId: 10,
        position: 'Midfielder',
        team: { dataValues: { name: 'Arsenal', teamId: 1 } },
      },
      fullName: 'Martin Odegaard',
      lastNameFirstName: 'Odegaard, Martin',
      managerPlayers: { dataValues: { substitute: false } },
      goals: [
        { cup: false },
        { cup: false },
        { cup: true },
      ],
    }

    const result = mapPlayer(player)

    expect(result).toEqual({
      playerId: 10,
      fullName: 'Martin Odegaard',
      lastNameFirstName: 'Odegaard, Martin',
      position: 'Midfielder',
      team: 'Arsenal',
      teamId: 1,
      substitute: false,
      goals: 2,
      cupGoals: 1,
    })
  })

  test('a player with no goals has zero for both counts', () => {
    const player = {
      dataValues: {
        playerId: 5,
        position: 'Defender',
        team: { dataValues: { name: 'Chelsea', teamId: 2 } },
      },
      fullName: 'Reece James',
      lastNameFirstName: 'James, Reece',
      managerPlayers: { dataValues: { substitute: true } },
      goals: [],
    }

    const result = mapPlayer(player)

    expect(result.goals).toBe(0)
    expect(result.cupGoals).toBe(0)
    expect(result.substitute).toBe(true)
  })

  test('handles null goals array gracefully', () => {
    const player = {
      dataValues: {
        playerId: 5,
        position: 'Forward',
        team: { dataValues: { name: 'Liverpool', teamId: 3 } },
      },
      fullName: 'Mohamed Salah',
      lastNameFirstName: 'Salah, Mohamed',
      managerPlayers: { dataValues: { substitute: false } },
      goals: null,
    }

    const result = mapPlayer(player)

    expect(result.goals).toBe(0)
    expect(result.cupGoals).toBe(0)
  })
})
