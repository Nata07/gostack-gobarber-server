import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointment: FakeAppointmentRepository;
describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointment = new FakeAppointmentRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointment,
    );
  });

  it('should be able list the appointments on specific day', async () => {
    const appointment1 = await fakeAppointment.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 5, 25, 9, 0, 0),
    });

    const appointment2 = await fakeAppointment.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 5, 25, 10, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 25,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
