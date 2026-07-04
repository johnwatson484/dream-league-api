import { orderPlayers } from '../../src/utils/order-players.ts'

describe('player list ordering', () => {
  test('players are ordered by position with defenders first', () => {
    const players = [
      { position: 'Forward', substitute: false, lastNameFirstName: 'Smith' },
      { position: 'Defender', substitute: false, lastNameFirstName: 'Jones' },
      { position: 'Midfielder', substitute: false, lastNameFirstName: 'Brown' },
    ]

    const result = orderPlayers(players)

    expect(result[0].position).toBe('Defender')
    expect(result[1].position).toBe('Midfielder')
    expect(result[2].position).toBe('Forward')
  })

  test('non-substitutes appear before substitutes within the same position', () => {
    const players = [
      { position: 'Defender', substitute: true, lastNameFirstName: 'Jones' },
      { position: 'Defender', substitute: false, lastNameFirstName: 'Smith' },
    ]

    const result = orderPlayers(players)

    expect(result[0].substitute).toBe(false)
    expect(result[1].substitute).toBe(true)
  })

  test('players in the same position and substitute status are ordered alphabetically by name', () => {
    const players = [
      { position: 'Midfielder', substitute: false, lastNameFirstName: 'Zola' },
      { position: 'Midfielder', substitute: false, lastNameFirstName: 'Adams' },
    ]

    const result = orderPlayers(players)

    expect(result[0].lastNameFirstName).toBe('Adams')
    expect(result[1].lastNameFirstName).toBe('Zola')
  })
})
