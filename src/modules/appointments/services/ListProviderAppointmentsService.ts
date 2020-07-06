import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRespository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `providers-appointment:${provider_id}:${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentRespository.findAllInDayFromProvider(
        {
          provider_id,
          month,
          year,
          day,
        },
      );

      // console.log('busca do banco');

      await this.cacheProvider.save(cacheKey, appointments);
    }

    // await this.cacheProvider.save('assa', 'assa');
    // console.log(appointments);
    return appointments;
  }
}

export default ListProviderAppointmentsService;
