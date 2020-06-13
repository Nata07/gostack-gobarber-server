import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { container } from 'tsyringe';
import CreateuserService from '@modules/users/services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
// import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
// const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = await container.resolve(CreateuserService);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
