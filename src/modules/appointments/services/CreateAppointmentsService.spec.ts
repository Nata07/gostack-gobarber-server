import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

let fake: FakeAppointmentRepository;
let createAppointments: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fake = new FakeAppointmentRepository();
    createAppointments = new CreateAppointmentService(fake);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointments.excecute({
      date: new Date(),
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    createAppointments.excecute({
      date: appointmentDate,
      provider_id: '123123123',
    });

    expect(
      createAppointments.excecute({
        date: appointmentDate,
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
