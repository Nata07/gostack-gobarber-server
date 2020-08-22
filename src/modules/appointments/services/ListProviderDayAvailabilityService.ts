import { injectable, inject } from 'tsyringe';

import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRespository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRespository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      },
    );

    const hourStart = 8;
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availavility = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compateDate = new Date(year, month, day, hour);

      // console.log(currentDate);
      // console.log(compateDate);
      // console.log(hasAppointmentInHour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compateDate, currentDate),
      };
    });
    console.log(currentDate);
    console.log(month);
    console.log(day);
    console.log(availavility);
    return availavility;
  }
}

export default ListProviderDayAvailabilityService;
