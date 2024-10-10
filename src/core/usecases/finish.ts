import { JobNotification } from "../models/job-notification.model";
import { FileDownloader } from "../services/file.downloader";
import { IdGenerator } from "../services/id.generator";
import { JobRepository } from "../services/job.repository";
import { Notifier } from "../services/notifier";
import { PicturePath } from "../services/picture-path";
import { PictureRepository } from "../services/picture.repository";

type Dependencies = {
    notifier: Notifier, 
    jobRepository: JobRepository, 
    notificationIdGenerator: IdGenerator, 
    pictureRepository: PictureRepository, 
    fileDownloader: FileDownloader,
    pictureIdGenerator: IdGenerator
}
export const finish = ({ notifier, jobRepository, notificationIdGenerator, pictureIdGenerator, fileDownloader, pictureRepository }: Dependencies) =>
    async ({id, status, outputUrl}: {id: string, status: string, outputUrl: string})=> {
        const job = await jobRepository.getBy(id)
        const willGeneratePictureId = pictureIdGenerator.generate()
        const outputPath = new PicturePath({owner: job.userId, pictureId: willGeneratePictureId})
        const stream = await fileDownloader.download(outputUrl, outputPath)
        await pictureRepository.save({id: willGeneratePictureId, picture: stream, owner: job.userId, path: outputPath})
        const willCreateNotificationId = notificationIdGenerator.generate()
        const notification : JobNotification = {id: willCreateNotificationId, status, outputId: willGeneratePictureId, user: job.userId}
        return notifier.notifySuccess(notification)
}