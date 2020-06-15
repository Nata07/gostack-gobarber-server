import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from './ListProviderService';

let fake: FakeUsersRepository;
let listProviders: ListProviderService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fake = new FakeUsersRepository();
    listProviders = new ListProviderService(fake);
  });
  it('should be able to list the providers', async () => {
    const user = await fake.create({
      name: 'teste',
      email: 'teste@email.com',
      password: '123456',
    });

    const user2 = await fake.create({
      name: 'John Tre',
      email: 'johntre@email.com',
      password: '123456',
    });

    const logged = await fake.create({
      name: 'logged',
      email: 'userlogged@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: logged.id,
    });

    expect(providers).toEqual([user, user2]);
  });
});
