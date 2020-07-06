import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';

let fake: FakeUsersRepository;
let listProviders: ListProviderService;
let fakeCacheProvider: FakeCacheProvider;

describe('ShowProfile', () => {
  beforeEach(() => {
    fake = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProviderService(fake, fakeCacheProvider);
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
