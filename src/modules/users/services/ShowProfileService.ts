import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfilleService {
  constructor(
    @inject('UsersRepository') private usersRespository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRespository.findById(user_id);

    if (!user) {
      throw new AppError('user not found');
    }

    return user;
  }
}

export default ShowProfilleService;
