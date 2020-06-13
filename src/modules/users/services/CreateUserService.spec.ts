import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvder';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new User', async () => {
    const fake = new FakeUserRepository();
    const fakeHash = new FakeHashProvider();
    const createUser = new CreateUserService(fake, fakeHash);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two User on the same time', async () => {
    const fake = new FakeUserRepository();
    const fakeHash = new FakeHashProvider();
    const createUser = new CreateUserService(fake, fakeHash);

    await createUser.execute({
      name: 'John Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'John Doe',
        email: 'jn@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
