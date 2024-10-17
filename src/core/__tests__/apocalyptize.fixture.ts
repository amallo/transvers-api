import { FakeDispatcher } from '../dispatchers/adapters/fake.dispatcher';
import { FakeDateService } from '../services/adapters/fake-date.service';
import { FakeIdGenerator } from '../services/adapters/fake-id.generator';
import { FakeJobRepository } from '../services/adapters/fake-job.repository';
import { FakeNotifier } from '../services/adapters/fake-notifier';
import { FakePictureRepository } from '../services/adapters/fake-picture.repository';
import {
  StartApocalyptizeCommand,
  StartApocalyptizeCommandHandler,
} from '../usecases/start-apocalyptize';
import { Picture } from '../models/picture.model';
import { Notification } from '../models/notification.model';
import { Stream } from 'stream';
import { Job } from '../models/job.model';
import {
  FinishApocalyptizeCommand,
  FinishApocalyptizeCommandHandler,
} from '../usecases/finish-apocalyptize';
import { FakeHttpClient } from '../services/adapters/fake-http.client';
import { FailurePictureRepository } from '../services/adapters/failure-picture.repository';
import { Dependencies, DependenciesFactory } from '../dependencies';

export class ApocalytizeFixture {
  dateService: FakeDateService;
  jobRepository: FakeJobRepository;
  notificationIdGenerator: FakeIdGenerator;
  pictureRepository: FakePictureRepository;
  pictureIdGenerator: FakeIdGenerator;
  commandDispatcher: FakeDispatcher;
  notifier: FakeNotifier;
  httpClient: FakeHttpClient;
  dependencies: Dependencies;
  startApocalyptizeCommandHandler: StartApocalyptizeCommandHandler;
  finishApocalyptizeCommandHandler: FinishApocalyptizeCommandHandler;
  constructor() {
    this.dateService = new FakeDateService(
      new Date('2011-10-05T14:48:00.000Z'),
    );
    this.jobRepository = new FakeJobRepository();
    this.pictureRepository = new FakePictureRepository();
    this.pictureIdGenerator = new FakeIdGenerator();
    this.commandDispatcher = new FakeDispatcher();
    this.notifier = new FakeNotifier();
    this.notificationIdGenerator = new FakeIdGenerator();
    this.httpClient = new FakeHttpClient();

    this.dependencies = DependenciesFactory.forTest({
      dateService: this.dateService,
      jobRepository: this.jobRepository,
      pictureRepository: this.pictureRepository,
      pictureIdGenerator: this.pictureIdGenerator,
      notifier: this.notifier,
      notificationIdGenerator: this.notificationIdGenerator,
      httpClient: this.httpClient,
      commandDispatcher: this.commandDispatcher,
    });
    this.startApocalyptizeCommandHandler = new StartApocalyptizeCommandHandler(
      this.dependencies,
    );
    this.finishApocalyptizeCommandHandler =
      new FinishApocalyptizeCommandHandler(this.dependencies);
    this.commandDispatcher.registerHandler(
      FinishApocalyptizeCommand,
      this.finishApocalyptizeCommandHandler,
    );
    this.commandDispatcher.registerHandler(
      StartApocalyptizeCommand,
      this.startApocalyptizeCommandHandler,
    );
  }
  givenNewPictureId(id: string) {
    this.pictureIdGenerator.willGenerate(id);
  }
  givenNewNotificationId(id: string) {
    this.notificationIdGenerator.willGenerate(id);
  }
  givenJob(job: Job) {
    this.jobRepository.withJob(job);
  }
  whenStartingApocalyptizePicture(
    pictureStream: Stream,
    user: string,
    jobId: string,
  ) {
    return this.commandDispatcher.dispatch(
      new StartApocalyptizeCommand(pictureStream, user, jobId),
    );
  }
  whenStartingApocalyptizePictureWithSavingPictureFailure(
    pictureStream: Stream,
    user: string,
    jobId: string,
    error: Error,
  ) {
    const failurePictureRepository = new FailurePictureRepository(error);
    this.dependencies.pictureRepository = failurePictureRepository;
    return this.commandDispatcher.dispatch(
      new StartApocalyptizeCommand(pictureStream, user, jobId),
    );
  }
  whenFinishingApocalyptizePicture({
    jobId,
    output,
  }: {
    jobId: string;
    output: string;
  }) {
    return this.commandDispatcher.dispatch(
      new FinishApocalyptizeCommand(output, jobId),
    );
  }
  expectLastPictureToEqual(expected: Picture) {
    expect(this.pictureRepository.last()).toEqual(expected);
  }
  expectLastSentNotificationToEqual(expected: Notification) {
    expect(this.notifier.last()).toEqual(expected);
  }
  expectLastJobToEqual(expected: Job) {
    expect(this.jobRepository.last()).toEqual(expected);
  }
}
