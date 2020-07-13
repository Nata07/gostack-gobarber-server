import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notfications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async excecute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cant create appointment on past date');
    }
    const findAppointmentsInSameDate = await this.appointmentRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (user_id === provider_id) {
      throw new AppError('You not create appointment from you');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You cant only create appointmnet between 8 and 17 hours',
      );
    }

    if (findAppointmentsInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Você possui um novo agendamento para o dia ${dateFormated}`,
    });

    await this.cacheProvider.invalidate(
      `providers-appointment:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
