import { Notification } from '../../models/notification.model';
import { Notifier } from '../notifier';

export class FakeNotifier implements Notifier {
  private notifications: Notification[] = [];
  async notify(notification: Notification) {
    console.log(`job ${notification.id} done!`);
    this.notifications.push(notification);
  }
  last() {
    return this.notifications[this.notifications.length - 1];
  }
}
