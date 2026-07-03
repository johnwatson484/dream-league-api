vi.mock('../../src/config/index.js', () => ({
  default: { cache: { partition: 'dream-league' } },
}))

import { getKeyPrefix } from '../../src/cache/get-key-prefix.js'

describe('cache key prefix', () => {
  test('builds a prefix from the partition and cache name', () => {
    const result = getKeyPrefix('summaries')

    expect(result).toBe('dream-league:summaries')
  })
})
