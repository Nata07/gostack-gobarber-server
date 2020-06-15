import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPassowordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUser: FakeUsersRepository;
let fakeEmailProvider: FakeMailProvider;
let fakeUserToken: FakeUserTokenRepository;
let sendForgotEmail: SendForgotPassowordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUser = new FakeUsersRepository();
    fakeEmailProvider = new FakeMailProvider();
    fakeUserToken = new FakeUserTokenRepository();

    sendForgotEmail = new SendForgotPassowordEmailService(
      fakeUser,
      fakeEmailProvider,
      fakeUserToken,
    );
  });

  it('should be able to recover password using email', async () => {
    const sendEmail = jest.spyOn(fakeEmailProvider, 'sendEmail');
    const user = await fakeUser.create({
      name: 'Jhon Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    await sendForgotEmail.execute({
      email: user.email,
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not recover password to inexist user ', async () => {
    await expect(
      sendForgotEmail.execute({
        email: 'jn@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserToken, 'generate');
    const user = await fakeUser.create({
      name: 'Jhon Doe',
      email: 'jn@email.com',
      password: '123456',
    });

    await sendForgotEmail.execute({
      email: user.email,
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
