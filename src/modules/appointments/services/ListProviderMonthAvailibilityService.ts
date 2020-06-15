import { injectable, inject } from 'tsyringe';

import { getDaysInMonth, getDate } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRespository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRespository.findAllInMOnthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    // console.log(`eachDAy ${eachDayArray}`);

    const availability = eachDayArray.map(day => {
      const appoinmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      // console.log(`appoinmentsInDay ${appoinmentsInDay.length} day ${day}`);
      return {
        day,
        available: appoinmentsInDay.length < 10,
      };
    });

    // console.log(availability);

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
