const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userRepository = require('../src/repositories/user.repository');
const installationRepository = require('../src/repositories/installation.repository');
const installationService = require('../src/services/installation.service');

jest.mock('../src/repositories/user.repository', () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn()
}));

jest.mock('../src/repositories/installation.repository', () => ({
  find: jest.fn(),
  create: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('mongoose', () => ({
  startSession: jest.fn()
}));

describe('installation service', () => {
  let session;

  beforeEach(() => {
    jest.clearAllMocks();
    session = {
      withTransaction: jest.fn(async (callback) => callback()),
      endSession: jest.fn()
    };
    mongoose.startSession.mockResolvedValue(session);
  });

  it('returns installed false when no installation exists', async () => {
    installationRepository.find.mockResolvedValue(null);

    const result = await installationService.getStatus();

    expect(result).toEqual({ installed: false });
  });

  it('refuses a second installation', async () => {
    installationRepository.find.mockResolvedValue({ _id: 'abc' });

    await expect(
      installationService.install({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'StrongPass123!'
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('creates the admin user and installation in one transaction', async () => {
    installationRepository.find.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue({ _id: 'user-id', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' });
    installationRepository.create.mockResolvedValue({ _id: 'installation-id', admin: 'user-id' });

    const result = await installationService.install({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'StrongPass123!'
    });

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        password: 'hashed-password'
      }),
      session
    );
    expect(session.withTransaction).toHaveBeenCalledTimes(1);
    expect(session.endSession).toHaveBeenCalledTimes(1);
    expect(installationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        admin: 'user-id'
      }),
      session
    );
    expect(result).toMatchObject({ installed: true, admin: { email: 'admin@example.com' } });
  });
});
