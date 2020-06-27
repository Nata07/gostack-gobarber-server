import { ObjectID } from 'mongodb';

import ICreateNotificationDTO from '@modules/notfications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notfications/repositories/INotificationsRepository';

import Notification from '../../infra/typeorm/schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recipient_id,
    });

    this.notifications.push(notification);

    return notification;
  }
}

export default NotificationsRepository;
