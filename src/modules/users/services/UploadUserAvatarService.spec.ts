import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UploadUserAvatarService';

describe('UploadUserAvatar', () => {
  it('should be able to create a new User', async () => {
    const fake = new FakeUserRepository();
    const fakeStorage = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fake, fakeStorage);

    const user = await fake.create({
      name: 'John Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'teste.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('non exist user update avatar', async () => {
    const fake = new FakeUserRepository();
    const fakeStorage = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fake, fakeStorage);

    expect(
      updateUserAvatar.execute({
        avatarFilename: 'teste.jpg',
        user_id: 'non-exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete user avatar when upload new one', async () => {
    const fake = new FakeUserRepository();
    const fakeStorage = new FakeStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(fake, fakeStorage);

    const deleteFile = jest.spyOn(fakeStorage, 'deleteFile');

    const user = await fake.create({
      name: 'John Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'teste.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: 'teste2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('teste.jpg');
    expect(user.avatar).toBe('teste2.jpg');
  });
});
