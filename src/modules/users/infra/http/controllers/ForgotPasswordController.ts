import { Request, Response } from 'express';
import { container } from 'tsyringe';
import SendForgotPassowordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPassword = container.resolve(
      SendForgotPassowordEmailService,
    );

    await sendForgotPassword.execute({
      email,
    });

    return response.status(204).json();
  }
}
