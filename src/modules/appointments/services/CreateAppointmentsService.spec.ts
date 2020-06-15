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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointments.excecute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user-ssas',
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    createAppointments.excecute({
      date: appointmentDate,
      user_id: 'user-ssas',
      provider_id: '123123123',
    });

    await expect(
      createAppointments.excecute({
        date: appointmentDate,
        user_id: 'user-ssas',
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointments.excecute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointments.excecute({
        date: new Date(2020, 4, 10, 11),
        user_id: '123456',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8 hours and after 17 hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointments.excecute({
        date: new Date(2020, 4, 10, 7),
        user_id: '123456',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointments.excecute({
        date: new Date(2020, 4, 10, 18),
        user_id: '123456',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
