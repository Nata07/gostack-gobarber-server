import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvder';

let fakeUser: FakeUsersRepository;
let fakeUserToken: FakeUserTokenRepository;
let resetPassword: ResetPasswordService;
let fakeHash: FakeHashProvider;
describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeUserToken = new FakeUserTokenRepository();
    fakeHash = new FakeHashProvider();
    resetPassword = new ResetPasswordService(fakeUser, fakeUserToken, fakeHash);
  });

  it('should be able to reset password ', async () => {
    const user = await fakeUser.create({
      name: 'Jhon Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    const { token } = await fakeUserToken.generate(user.id);

    const generateHash = jest.spyOn(fakeHash, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updateUser = await fakeUser.findById(user.id);

    expect(generateHash).toBeCalledWith('123123');
    expect(updateUser?.password).toBe('123123');
  });

  it('should not recover password non-exist token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not recover password non-exist user', async () => {
    const user = await fakeUser.create({
      name: 'Jhon Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    const { token } = await fakeUserToken.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able recover password after two hours', async () => {
    const { token } = await fakeUserToken.generate('non-existing-user');

    await expect(
      resetPassword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
