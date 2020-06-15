import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvder';
import UpdateProfileService from './UpdateProfileService';

let fake: FakeUsersRepository;
let fakeHash: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fake = new FakeUsersRepository();
    fakeHash = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fake, fakeHash);
  });
  it('should be able to create a new User', async () => {
    const user = await fake.create({
      name: 'annnasdnad',
      email: 'sdsdsa@email.com',
      password: '123456',
    });

    const updateuser = await updateProfile.execute({
      user_id: user.id,
      name: 'Alter names',
      email: 'alteremail@email.com',
    });

    expect(updateuser.name).toBe('Alter names');
  });

  it('should not be able to create user with existing email ', async () => {
    await fake.create({
      name: 'NAtanael',
      email: 'nata@email.com',
      password: '123456',
    });

    const user = await fake.create({
      name: 'natanael 1',
      email: 'natanael@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Alter names',
        email: 'nata@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fake.create({
      name: 'annnasdnad',
      email: 'sdsdsa@email.com',
      password: '123456',
    });

    const updateuser = await updateProfile.execute({
      user_id: user.id,
      name: 'Alter names',
      email: 'alteremail@email.com',
      oldPassword: '123456',
      password: '123123',
    });

    expect(updateuser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fake.create({
      name: 'annnasdnad',
      email: 'sdsdsa@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Alter names',
        email: 'alteremail@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fake.create({
      name: 'annnasdnad',
      email: 'sdsdsa@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Alter names',
        email: 'alteremail@email.com',
        oldPassword: '1234567',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
