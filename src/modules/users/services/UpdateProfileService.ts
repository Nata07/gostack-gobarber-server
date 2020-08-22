import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private usersRespository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    user_id,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRespository.findById(user_id);

    if (!user) {
      throw new AppError('user not found');
    }

    const userExists = await this.usersRespository.findByEmail(email);

    if (userExists && userExists.id !== user.id) {
      throw new AppError('User already exists.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkPassword) {
        throw new AppError('Old Password does not match');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRespository.save(user);
  }
}

export default UpdateProfileService;
