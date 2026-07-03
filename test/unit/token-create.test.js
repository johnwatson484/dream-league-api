const { mockSign } = vi.hoisted(() => ({
  mockSign: vi.fn().mockReturnValue('mock-jwt-token'),
}))

vi.mock('jsonwebtoken', () => ({
  default: { sign: mockSign },
}))

vi.mock('../../src/config/index.js', () => ({
  default: {
    jwtConfig: { secret: 'test-secret', expiryInMinutes: 60 },
  },
}))

import { create } from '../../src/token/create.js'

describe('authentication token creation', () => {
  test('a token includes the user ID and their role scopes', () => {
    const user = { userId: 42, roles: [{ Role: { name: 'admin' } }, { Role: { name: 'user' } }] }

    create(user)

    expect(mockSign).toHaveBeenCalledWith(
      { userId: 42, scope: ['admin', 'user'] },
      'test-secret',
      { expiresIn: '60m' }
    )
  })

  test('the signed JWT string is returned', () => {
    const user = { userId: 1, roles: [{ Role: { name: 'user' } }] }

    const result = create(user)

    expect(result).toBe('mock-jwt-token')
  })

  test('a user with a single role receives only that scope', () => {
    const user = { userId: 5, roles: [{ Role: { name: 'user' } }] }

    create(user)

    expect(mockSign).toHaveBeenCalledWith(
      { userId: 5, scope: ['user'] },
      'test-secret',
      { expiresIn: '60m' }
    )
  })
})
