import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvder';
import AuthenticateUserService from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  it('should be able to Authenticate with password incorrect', async () => {
    const fake = new FakeUserRepository();
    const fakeHash = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(fake, fakeHash);
    const createUser = new CreateUserService(fake, fakeHash);

    const user = await createUser.execute({
      name: 'jon',
      email: 'jon@email.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'jon@email.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to Authenticate with non existing user ', async () => {
    const fake = new FakeUserRepository();
    const fakeHash = new FakeHashProvider();
    const authenticateUser = new AuthenticateUserService(fake, fakeHash);

    expect(
      authenticateUser.execute({
        email: 'jon@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // it('should be able to Authenticate', async () => {
  //   const fake = new FakeUserRepository();
  //   const fakeHash = new FakeHashProvider();
  //   const authenticateUser = new AuthenticateUserService(fake, fakeHash);
  //   const createUser = new CreateUserService(fake, fakeHash);

  //   const user = await createUser.execute({
  //     name: 'jhon Doe',
  //     email: 'jondoe@email.com',
  //     password: '123456',
  //   });

  //   const response = await authenticateUser.execute({
  //     email: 'jondoe@email.com',
  //     password: '123456',
  //   });

  //   expect(response).toHaveProperty('token');
  //   expect(response.user).toEqual(user);
  // });
});
