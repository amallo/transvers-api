import { Stream } from 'stream';
import { Dependencies } from '../dependencies';
import { Handler } from '../handlers/handler';
import { JobModel } from '../models/job.model';
import { PictureModel } from '../models/picture.model';

export class StartApocalyptizeCommandHandler
  implements Handler<StartApocalyptizeCommand>
{
  constructor(private dependencies: Dependencies) {}
  async handle({ by, jobId }: StartApocalyptizeCommand) {
    const {
      pictureIdGenerator,
      pictureRepository,
      jobRepository,
      eventBus,
      dateService,
    } = this.dependencies;
    const willSavePictureId = pictureIdGenerator.generate();
    const now = dateService.nowIs();
    const job = JobModel.createPendingJob(eventBus, {
      id: jobId,
      by,
      name: 'apocalyptize',
    });
    const inputPicture = new PictureModel(willSavePictureId, job.by);
    try {
      await pictureRepository.save(inputPicture);
      job.start(now.toISOString(), inputPicture);
      await jobRepository.save(job);
      job.commit();
    } catch (e) {
      job.fail(e);
      await jobRepository.save(job);
      job.commit();
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
