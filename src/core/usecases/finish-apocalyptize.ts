
import { Dependencies } from '../dependencies';
import { PictureModel } from '../models/picture.model';

export class FinishApocalyptizeCommandHandler {
  constructor(private dependencies: Dependencies) {}
  async handle({ output, jobId }: FinishApocalyptizeCommand) {
    const {
      jobRepository,
      httpClient,
      pictureIdGenerator,
      pictureRepository,
      dateService,
      notifier,
      notificationIdGenerator,
    } = this.dependencies;
    const now = dateService.nowIs();
    const newOutputPictureId = pictureIdGenerator.generate();
    const job = await jobRepository.getById(jobId);
    const willCreateNotificationId = notificationIdGenerator.generate();
    try {
      const outputStream = await httpClient.downloadAsStream(output);
      const ouputPicture = new PictureModel(newOutputPictureId, job.by);
      await pictureRepository.save(ouputPicture);
      job.done(now.toISOString(), ouputPicture);
      await jobRepository.save(job);
      job.commit();
      notifier.notify({
        type: 'job',
        to: job.by,
        id: willCreateNotificationId,
        jobId: job.id,
        status: 'done',
        at: now.toISOString(),
        output: ouputPicture.path,
      });
    } catch (_) {
      notifier.notify({
        type: 'job',
        to: job.by,
        id: willCreateNotificationId,
        jobId: job.id,
        status: 'failure',
        at: now.toISOString(),
      });
    }
  }
}

export class FinishApocalyptizeCommand {
  constructor(
    public readonly output: string,
    public readonly jobId: string,
  ) {}
}
