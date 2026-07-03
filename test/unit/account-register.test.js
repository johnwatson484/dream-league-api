const { mockUserExists, mockCreateUser, mockIsMember, mockCreate } = vi.hoisted(() => ({
  mockUserExists: vi.fn(),
  mockCreateUser: vi.fn(),
  mockIsMember: vi.fn(),
  mockCreate: vi.fn(),
}))

vi.mock('../../src/config/index.js', () => ({
  default: { allowNonMemberRegistration: false },
}))

vi.mock('../../src/account/user-manager.js', () => ({
  userExists: mockUserExists,
  createUser: mockCreateUser,
  isMember: mockIsMember,
}))

vi.mock('../../src/token/index.js', () => ({
  create: mockCreate,
}))

import { register } from '../../src/account/register.js'

describe('user registration', () => {
  test('a new member can register and receives an authentication token', async () => {
    mockUserExists.mockResolvedValue(false)
    mockIsMember.mockResolvedValue(true)
    const user = { userId: 1, roles: [] }
    mockCreateUser.mockResolvedValue(user)
    mockCreate.mockReturnValue('new-token')

    const result = await register('new@example.com', 'password123')

    expect(result).toEqual({ token: 'new-token' })
  })

  test('registration is rejected if the email is already registered', async () => {
    mockUserExists.mockResolvedValue(true)

    const result = await register('existing@example.com', 'password123')

    expect(result).toBe(false)
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  test('a non-member cannot register when non-member registration is disabled', async () => {
    mockUserExists.mockResolvedValue(false)
    mockIsMember.mockResolvedValue(false)

    const result = await register('outsider@example.com', 'password123')

    expect(result).toBe(false)
    expect(mockCreateUser).not.toHaveBeenCalled()
  })

  test('the user is created with the provided email and password', async () => {
    mockUserExists.mockResolvedValue(false)
    mockIsMember.mockResolvedValue(true)
    mockCreateUser.mockResolvedValue({ userId: 1 })
    mockCreate.mockReturnValue('token')

    await register('new@example.com', 'secure-password')

    expect(mockCreateUser).toHaveBeenCalledWith('new@example.com', 'secure-password')
  })
})
