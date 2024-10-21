
import { Dependencies } from '../dependencies';
import { PictureModel } from '../models/picture.model';

export class FinishApocalyptizeCommandHandler {
  constructor(private dependencies: Dependencies) {}
  async handle({ outputUrl, jobId }: FinishApocalyptizeCommand) {
    const {
      jobRepository,
      httpClient,
      pictureIdGenerator,
      dateService,
      notifier,
      notificationIdGenerator,
    } = this.dependencies;
    const now = dateService.nowIs();
    const newOutputPictureId = pictureIdGenerator.generate();
    const job = await jobRepository.getById(jobId);
    console.log(jobRepository, job, jobId);
    const willCreateNotificationId = notificationIdGenerator.generate();
    try {
      await httpClient.downloadAsStream(outputUrl);
      const ouputPicture = new PictureModel(newOutputPictureId, job.by);
      job.done(now.toISOString(), ouputPicture);
      await jobRepository.save(job);
      job.commit();
      notifier.notify({
        type: 'job',
        to: job.by,
        id: willCreateNotificationId,
        jobId: job.id,
        status: 'done',
        startedAt: now.toISOString(),
        output: ouputPicture.path,
      });
    } catch (_) {
      console.log('failed job', job);
      notifier.notify({
        type: 'job',
        to: job.by,
        id: willCreateNotificationId,
        jobId: job.id,
        status: 'failure',
        startedAt: now.toISOString(),
      });
    }
  }
}

export class FinishApocalyptizeCommand {
  constructor(
    public readonly jobId: string,
    public readonly outputUrl: string,
  ) {}
}
