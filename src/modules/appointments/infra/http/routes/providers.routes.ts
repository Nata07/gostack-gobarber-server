import { Router } from 'express';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const appointmentsController = new ProvidersController();
const availabilityMonthController = new ProviderMonthAvailabilityController();
const availabilityDayController = new ProviderDayAvailabilityController();
providersRouter.use(ensureAuthenticated);

providersRouter.get('/', appointmentsController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  availabilityMonthController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  availabilityDayController.index,
);

export default providersRouter;
