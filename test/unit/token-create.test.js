const { mockSign, mockHash, mockUpdate } = vi.hoisted(() => ({
  mockSign: vi.fn().mockReturnValue('mock-jwt-token'),
  mockHash: vi.fn().mockResolvedValue('hashed-refresh-token'),
  mockUpdate: vi.fn().mockResolvedValue([1]),
}))

vi.mock('jsonwebtoken', () => ({
  default: { sign: mockSign },
}))

vi.mock('bcrypt', () => ({
  default: { hash: mockHash },
}))

vi.mock('../../src/config/index.js', () => ({
  default: {
    jwtConfig: { secret: 'test-secret', expiryInMinutes: 60 },
  },
}))

vi.mock('../../src/data/index.js', () => ({
  default: { User: { update: mockUpdate } },
}))

import { create } from '../../src/token/create.js'

describe('authentication token creation', () => {
  test('a token includes the user ID and their role scopes', async () => {
    const user = { userId: 42, roles: [{ Role: { name: 'admin' } }, { Role: { name: 'user' } }] }

    await create(user)

    expect(mockSign).toHaveBeenCalledWith(
      { userId: 42, scope: ['admin', 'user'] },
      'test-secret',
      { expiresIn: '60m' }
    )
  })

  test('the signed JWT and refresh token are returned', async () => {
    const user = { userId: 1, roles: [{ Role: { name: 'user' } }] }

    const result = await create(user)

    expect(result.token).toBe('mock-jwt-token')
    expect(result.userId).toBe(1)
    expect(typeof result.refreshToken).toBe('string')
  })

  test('a user with a single role receives only that scope', async () => {
    const user = { userId: 5, roles: [{ Role: { name: 'user' } }] }

    await create(user)

    expect(mockSign).toHaveBeenCalledWith(
      { userId: 5, scope: ['user'] },
      'test-secret',
      { expiresIn: '60m' }
    )
  })
})
