import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvder';
import CreateUserService from './CreateUserService';

let fake: FakeUsersRepository;
let fakeHash: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fake = new FakeUsersRepository();
    fakeHash = new FakeHashProvider();
    createUser = new CreateUserService(fake, fakeHash);
  });
  it('should be able to create a new User', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two User on the same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'jn@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
