const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../src/repositories/user.repository');
const authService = require('../src/services/auth.service');

jest.mock('../src/repositories/user.repository', () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

describe('auth service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in a valid admin user and returns a token', async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: 'user-id',
      email: 'admin@example.com',
      password: 'hashed-password',
      role: 'ADMIN',
      name: 'Admin'
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt-token');

    const result = await authService.login({ email: 'admin@example.com', password: 'StrongPass123!' });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('admin@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('StrongPass123!', 'hashed-password');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 'user-id', role: 'ADMIN' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    expect(result).toMatchObject({ token: 'jwt-token', user: { email: 'admin@example.com', role: 'ADMIN' } });
  });

  it('rejects invalid credentials', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'missing@example.com', password: 'wrongpass' })
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
