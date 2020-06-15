import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfilleService from './ShowProfileService';

let fake: FakeUserRepository;
let showProfileService: ShowProfilleService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fake = new FakeUserRepository();
    showProfileService = new ShowProfilleService(fake);
  });
  it('should be able to show profile', async () => {
    const user = await fake.create({
      name: 'teste',
      email: 'teste@email.com',
      password: '123456',
    });

    const profileUser = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profileUser.name).toBe('teste');
    expect(profileUser.email).toBe('teste@email.com');
  });

  it('should not be able to show profile', async () => {
    expect(
      showProfileService.execute({
        user_id: 'non-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
