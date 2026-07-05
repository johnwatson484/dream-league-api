const { mockSign, mockRandomBytes, mockRandomUUID, mockCreate } = vi.hoisted(() => ({
  mockSign: vi.fn().mockReturnValue('mock-jwt-token'),
  mockRandomBytes: vi.fn().mockReturnValue({ toString: () => 'a'.repeat(64) }),
  mockRandomUUID: vi.fn().mockReturnValue('test-uuid'),
  mockCreate: vi.fn().mockResolvedValue({}),
}))

vi.mock('jsonwebtoken', () => ({
  default: { sign: mockSign },
}))

vi.mock('node:crypto', () => ({
  randomBytes: mockRandomBytes,
  createHash: () => ({ update: () => ({ digest: () => 'hashed-token' }) }),
  randomUUID: mockRandomUUID,
}))

vi.mock('../../src/config/index.ts', () => ({
  default: {
    get: (key: string) => ({
      'jwt.expiryInMinutes': 15,
      'jwt.refreshTokenExpiryDays': 7,
    } as Record<string, unknown>)[key],
  },
}))

vi.mock('../../src/config/keys.ts', () => ({
  privateKey: 'test-private-key',
  publicKey: 'test-public-key',
}))

vi.mock('../../src/data/index.ts', () => ({
  default: {
    RefreshToken: { create: mockCreate },
  },
}))

import { create } from '../../src/token/create.ts'

describe('authentication token creation', () => {
  test('a token includes the user ID, role scopes, and token version', async () => {
    const user = { userId: 42, roles: [{ Role: { name: 'admin' } }, { Role: { name: 'user' } }], tokenVersion: 3 }

    await create(user)

    expect(mockSign).toHaveBeenCalledWith(
      { userId: 42, scope: ['admin', 'user'], tokenVersion: 3 },
      'test-private-key',
      { algorithm: 'RS256', expiresIn: '15m' },
    )
  })

  test('the signed access token and refresh token are returned', async () => {
    const user = { userId: 1, roles: [{ Role: { name: 'user' } }], tokenVersion: 0 }

    const result = await create(user)

    expect(result.accessToken).toBe('mock-jwt-token')
    expect(result.refreshToken).toBeDefined()
  })

  test('a refresh token is persisted in the database', async () => {
    const user = { userId: 5, roles: [{ Role: { name: 'user' } }], tokenVersion: 1 }

    await create(user)

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      userId: 5,
      tokenHash: 'hashed-token',
      family: 'test-uuid',
    }))
  })

  test('tokenVersion defaults to 0 when not present on user', async () => {
    const user = { userId: 1, roles: [{ Role: { name: 'user' } }] }

    await create(user)

    expect(mockSign).toHaveBeenCalledWith(
      expect.objectContaining({ tokenVersion: 0 }),
      'test-private-key',
      expect.any(Object),
    )
  })
})
