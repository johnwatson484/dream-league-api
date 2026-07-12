import { vi, describe, afterEach, test, expect } from 'vitest'

const { mockPlayer } = vi.hoisted(() => ({
  mockPlayer: { truncate: vi.fn(), bulkCreate: vi.fn() },
}))

vi.mock('../../src/data/index.ts', () => ({
  default: {
    Player: mockPlayer,
  },
}))

import { confirmPlayers } from '../../src/refresh/players/confirm-players.ts'

describe('confirm players', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should truncate and bulk create players', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'Forward',
      teamId: 1,
    }]

    const result = await confirmPlayers(players)

    expect(result.success).toBe(true)
    expect(mockPlayer.truncate).toHaveBeenCalledOnce()
    expect(mockPlayer.bulkCreate).toHaveBeenCalledWith(players)
  })

  test('should reject if any player missing teamId', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: 'Forward',
      teamId: 1,
    }, {
      firstName: 'Joe',
      lastName: 'Bloggs',
      position: 'Defender',
      teamId: undefined,
    }]

    const result = await confirmPlayers(players)

    expect(result.success).toBe(false)
    expect(mockPlayer.truncate).not.toHaveBeenCalled()
  })

  test('should reject if any player missing position', async () => {
    const players = [{
      firstName: 'Ian',
      lastName: 'Henderson',
      position: '',
      teamId: 1,
    }]

    const result = await confirmPlayers(players)

    expect(result.success).toBe(false)
    expect(mockPlayer.truncate).not.toHaveBeenCalled()
  })
})
