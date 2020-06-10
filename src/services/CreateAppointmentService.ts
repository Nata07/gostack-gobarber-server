import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repository/AppointmentsRepository';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async excecute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentsInSameDate = await appointmentRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentsInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
