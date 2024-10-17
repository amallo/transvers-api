import { Stream } from 'stream';
import { PicturePath } from '../services/picture-path';
import { Dependencies } from '../dependencies';

export class StartApocalyptizeCommandHandler {
  constructor(private dependencies: Dependencies) {}
  async handle({ by, input, jobId }: StartApocalyptizeCommand) {
    const {
      pictureIdGenerator,
      pictureRepository,
      jobRepository,
      dateService,
      notifier,
      notificationIdGenerator,
    } = this.dependencies;
    const now = dateService.nowIs();
    const willSavePictureId = pictureIdGenerator.generate();
    const willCreateNotificationId = notificationIdGenerator.generate();
    const picturePath = new PicturePath({
      owner: by,
      pictureId: willSavePictureId,
    });
    const job = await jobRepository.run({
      id: jobId,
      by,
      name: 'apocalyptize',
      input: willSavePictureId,
    });
    try {
      await pictureRepository.save({
        id: willSavePictureId,
        picture: input,
        owner: by,
        path: picturePath,
      });

      notifier.notify({
        type: 'job',
        to: by,
        id: willCreateNotificationId,
        jobId: job.id,
        status: 'running',
        at: now.toISOString(),
      });
    } catch (e) {
      await jobRepository.fail(jobId, e);
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

export class StartApocalyptizeCommand {
  constructor(
    public readonly input: Stream,
    public readonly by: string,
    public readonly jobId: string,
  ) {}
}
