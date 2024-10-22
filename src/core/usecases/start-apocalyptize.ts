import { Stream } from 'stream';
import { Dependencies } from '../dependencies';
import { Handler } from '../handlers/handler';
import { JobModel } from '../models/job.model';
import { PictureModel } from '../models/picture.model';
import { JobTaskResult } from '../gateways/job.task';
export class StartApocalyptizeCommandHandler
  implements Handler<StartApocalyptizeCommand>
{
  constructor(private dependencies: Dependencies) {}

  async onJobDone(taskResult: JobTaskResult) {
    const {
      httpClient,
      fileStorage,
      dateService,
      jobRepository,
      pictureIdGenerator,
      notifier,
      notificationIdGenerator,
      config,
    } = this.dependencies;
    const now = dateService.nowIs();
    const job = await jobRepository.getById(taskResult.jobId);
    const outputPictureId = pictureIdGenerator.generate();
    const outputPicture = new PictureModel(outputPictureId, job.by);

    try {
      const outputStream = await httpClient.downloadAsStream(
        taskResult.outputUrl,
      );
      await fileStorage.writeStream(outputStream, outputPicture.path);
      job.done(now.toISOString(), outputPicture);
      await jobRepository.save(job);
      return notifier.notify({
        id: notificationIdGenerator.generate(),
        jobId: job.id,
        status: 'done',
        to: job.by,
        startedAt: job.startedAt,
        type: 'job',
        output: config.filesUrl + '/' + outputPicture.id,
        finishedAt: job.finishedAt,
      });
    } catch (e) {
      job.fail(e);
      return notifier.notify({
        id: notificationIdGenerator.generate(),
        jobId: job.id,
        status: 'failure',
        to: job.by,
        startedAt: job.startedAt,
        type: 'job',
      });
    }
  }

  async handle({ by, jobId, inputStream }: StartApocalyptizeCommand) {
    const {
      pictureIdGenerator,
      jobRepository,
      dateService,
      fileStorage,
      jobTask,
      notifier,
      notificationIdGenerator,
    } = this.dependencies;
    jobTask.registerDoneHander(jobId, this.onJobDone.bind(this));

    const inputPictureId = pictureIdGenerator.generate();
    const now = dateService.nowIs();
    const job = JobModel.createPendingJob({
      id: jobId,
      by,
      name: 'apocalyptize',
    });

    const inputPicture = new PictureModel(inputPictureId, job.by);

    try {
      await fileStorage.writeStream(inputStream, inputPicture.path);
      job.start(now.toISOString(), inputPicture);

      await jobRepository.save(job);
      await jobTask.run(job);
    } catch (e) {
      job.fail(e);
      return notifier.notify({
        id: notificationIdGenerator.generate(),
        jobId: jobId,
        status: 'abandoned',
        to: by,
        startedAt: now.toISOString(),
        type: 'job',
      });
    }
  }
}

export class StartApocalyptizeCommand {
  constructor(
    public readonly inputStream: Stream,
    public readonly by: string,
    public readonly jobId: string,
  ) {}
}
