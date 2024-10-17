import { PicturePath } from '../services/picture-path';
import { Dependencies } from '../dependencies';

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
    const outputPath = new PicturePath({
      owner: job.by,
      pictureId: newOutputPictureId,
    });
    const willCreateNotificationId = notificationIdGenerator.generate();
    try {
      const outputStream = await httpClient.downloadAsStream(output);
      await pictureRepository.save({
        id: newOutputPictureId,
        picture: outputStream,
        owner: job.by,
        path: outputPath,
      });
      await jobRepository.finish(jobId, outputPath);
      notifier.notify({
        type: 'job',
        to: job.by,
        id: willCreateNotificationId,
        jobId: job.id,
        status: 'done',
        at: now.toISOString(),
        output: outputPath.path(),
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
