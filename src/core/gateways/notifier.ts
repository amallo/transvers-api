import { Notification } from '../models/notification.model';

/**
 * Handles the notification of a job
 */
export interface Notifier {
  notify(notification: Notification): void;
}
