import { Stream } from 'stream';
import { DateService } from '../services/date.service';
import { JobRepository } from '../services/job.repository';
import { IdGenerator } from '../services/id.generator';
import { PictureRepository } from '../services/picture.repository';
import { Dispatcher } from '../dispatchers/dispatcher';
import { Notifier } from '../services/notifier';
import { PicturePath } from '../services/picture-path';
import { HttpClient } from '../services/http.client';

type Dependencies = {
  dateService: DateService;
  jobRepository: JobRepository;
  pictureRepository: PictureRepository;
  pictureIdGenerator: IdGenerator;
  notifier: Notifier;
  notificationIdGenerator: IdGenerator;
  httpClient: HttpClient;
};
export class FinishApocalyptizeCommandHandler {
  constructor(
    private dispatcher: Dispatcher,
    private dependencies: Dependencies,
  ) {
    this.dispatcher.registerHandler(FinishApocalyptizeCommand, this);
  }
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
    const job = await jobRepository.getById(jobId);

    const newOutputPictureId = pictureIdGenerator.generate();
    const outputPath = new PicturePath({
      owner: job.by,
      pictureId: newOutputPictureId,
    });
    const outputStream = await httpClient.downloadAsStream(output);
    await pictureRepository.save({
      id: newOutputPictureId,
      picture: outputStream,
      owner: job.by,
      path: outputPath,
    });
    await jobRepository.finish(jobId, outputPath);
    const now = dateService.nowIs();
    const willCreateNotificationId = notificationIdGenerator.generate();
    notifier.notify({
      type: 'job',
      to: job.by,
      id: willCreateNotificationId,
      jobId: job.id,
      status: 'done',
      at: now.toISOString(),
      output: outputPath.path(),
    });
  }
}

export class FinishApocalyptizeCommand {
  constructor(
    public readonly output: string,
    public readonly jobId: string,
  ) {}
}
