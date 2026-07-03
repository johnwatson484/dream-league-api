vi.mock('../../src/config/index.js', () => ({
  default: { cache: { partition: 'dream-league' } },
}))

import { getFullKey } from '../../src/cache/get-full-key.js'

describe('cache full key', () => {
  test('builds a key from the partition, cache name, and specific key', () => {
    const result = getFullKey('summaries', 'gameweek-5')

    expect(result).toBe('dream-league:summaries:gameweek-5')
  })
})
