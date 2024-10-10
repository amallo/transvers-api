import { JobNotification } from "../models/job-notification.model";

/**
 * Handles the notification of a job
 */
export interface Notifier {
    notifySuccess(notification: JobNotification): Promise<void>
}