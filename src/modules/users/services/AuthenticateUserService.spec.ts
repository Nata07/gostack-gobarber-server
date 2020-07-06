import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
// import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvder';
import AuthenticateUserService from './AuthenticateUserService';

let fake: FakeUsersRepository;
let fakeHash: FakeHashProvider;
// let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fake = new FakeUsersRepository();
    fakeHash = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fake, fakeHash);
    // createUser = new CreateUserService(fake, fakeHash);
  });

  it('should be able to Authenticate', async () => {
    const user = await fake.create({
      name: 'jhon Doe',
      email: 'jondoe@email.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'jondoe@email.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should be able to Authenticate with password incorrect', async () => {
    await fake.create({
      name: 'jon',
      email: 'jon@email.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'jon@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to Authenticate with non existing user ', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jon@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
