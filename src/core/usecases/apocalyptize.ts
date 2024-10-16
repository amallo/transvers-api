import {  Stream } from 'stream';
import { DateService } from '../services/date.service';
import { JobRepository } from '../services/job.repository';
import { IdGenerator } from '../services/id.generator';
import { PictureRepository } from '../services/picture.repository';
import { PicturePath } from '../services/picture-path';
import { Dispatcher } from '../dispatchers/dispatcher';
import { Notifier } from '../services/notifier';

type Dependencies = {
  dateService: DateService;
  jobRepository: JobRepository;
  pictureRepository: PictureRepository;
  pictureIdGenerator: IdGenerator;
  notifier: Notifier;
  notificationIdGenerator: IdGenerator;
};
export class ApocalyptizeCommandHandler {
  constructor(
    private dispatcher: Dispatcher,
    private dependencies: Dependencies,
  ) {
    this.dispatcher.registerHandler(ApocalyptizeCommand, this);
  }
  async handle({ by, input, jobId }: ApocalyptizeCommand) {
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
    const picturePath = new PicturePath({
      owner: by,
      pictureId: willSavePictureId,
    });
    await pictureRepository.save({
      id: willSavePictureId,
      picture: input,
      owner: by,
      path: picturePath,
    });
    const job = await jobRepository.run({
      id: jobId,
      by,
      name: 'apocalyptize',
    });
    const willCreateNotificationId = notificationIdGenerator.generate();
    notifier.notify({
      type: 'job',
      to: by,
      id: willCreateNotificationId,
      jobId: job.id,
      status: 'running',
      at: now.toISOString(),
    });
  }
}

export class ApocalyptizeCommand {
  constructor(
    public readonly input: Stream,
    public readonly by: string,
    public readonly jobId: string,
  ) {}
}
