import ListProviderMonthAvailabilityService from './ListProviderMonthAvailibilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentRepository';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointment: FakeAppointmentRepository;
describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointment = new FakeAppointmentRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointment,
    );
  });

  it('should be able to availability month from provider', async () => {
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 8, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 9, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 10, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 11, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 12, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 13, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: 'asdsad',
    });

    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 16, 0, 0),
      user_id: 'asdsad',
    });
    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 20, 17, 0, 0),
      user_id: 'asdsad',
    });

    await fakeAppointment.create({
      provider_id: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
      user_id: 'asdsad',
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
