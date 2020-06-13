import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateuserService from '@modules/users/services/CreateUserService';
import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUser = container.resolve(CreateuserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  }

  public async alterAvatar(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const updateUserAvatar = container.resolve(UploadUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    delete user.password;
    return response.json(user);
  }
}
