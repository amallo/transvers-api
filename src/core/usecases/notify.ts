import { JobNotification } from "../models/job-notification.model";
import { IdGenerator } from "../services/id.generator";
import { JobRepository } from "../services/job.repository";
import { Notifier } from "../services/notifier";

export const makeNotify = ({ notifier, jobRepository, idGenerator }: {notifier: Notifier, jobRepository: JobRepository, idGenerator: IdGenerator}) =>async ({identifier, status, picture}: {identifier: string, status: string, picture: string})=> {
    const job = await jobRepository.getByIdentifier(identifier)
    const willCreateNotificationId = idGenerator.generate()
    const notification : JobNotification = {id: willCreateNotificationId, status, picture, user: job.userId}
    return notifier.notifySuccess(notification)
}