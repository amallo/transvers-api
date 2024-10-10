import { JobNotification } from "../../models/job-notification.model";
import { Notifier } from "../notifier";

export class FakeNotifier implements Notifier {
    private notifications: JobNotification[] = []
    async notifySuccess(notification: JobNotification) {
        console.log(`job ${notification.id} done!`)
        this.notifications.push(notification)
    }
    lastNotification() {
        return this.notifications[this.notifications.length - 1]
    }
}