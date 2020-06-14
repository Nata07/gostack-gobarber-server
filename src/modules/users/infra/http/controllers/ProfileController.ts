import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfilleService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfileService = container.resolve(ShowProfilleService);

    const user = await showProfileService.execute({ user_id });
    delete user.password;
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { email, name, password, oldPassword } = request.body;

    const authenticateUser = container.resolve(UpdateProfileService);

    const user = await authenticateUser.execute({
      user_id,
      name,
      email,
      password,
      oldPassword,
    });

    delete user.password;

    return response.json(user);
  }
}
