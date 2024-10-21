import { FakeDispatcher } from '../dispatchers/adapters/fake.dispatcher';
import { FakeDateService } from '../gateways/adapters/fake-date.service';
import { FakeIdGenerator } from '../gateways/adapters/fake-id.generator';
import { FakeJobRepository } from '../gateways/adapters/fake-job.repository';
import { FakeNotifier } from '../gateways/adapters/fake-notifier';
import { FakePictureRepository } from '../gateways/adapters/fake-picture.repository';
import {
  StartApocalyptizeCommand,
  StartApocalyptizeCommandHandler,
} from '../usecases/start-apocalyptize';
import { PictureProperties } from '../models/picture.model';
import { Notification } from '../models/notification.model';
import { Stream } from 'stream';
import { JobModel, JobProperties } from '../models/job.model';
import { FakeHttpClient } from '../gateways/adapters/fake-http.client';
import { Dependencies, DependenciesFactory } from '../dependencies';
import { FakeBus } from '../events/adapters/fake.bus';
import {
  JobStartedEvent,
  JobStartedEventHandler,
} from '../events/job-started.event';
import {
  JobFailedEvent,
  JobFailedEventHandler,
} from '../events/job-failed.event';
import { FakeFileStorage } from '../gateways/adapters/fake-file.storage';
import { FailureFileStorage } from '../gateways/adapters/failure-file.storage';
import { FailureJobRepository } from '../gateways/adapters/failure-job.repository';
import { FakeJobTask } from '../gateways/adapters/fake-job.task';
import { JobTaskResult } from '../gateways/job.task';

export class ApocalytizeFixture {
  dateService: FakeDateService;
  jobRepository: FakeJobRepository;
  notificationIdGenerator: FakeIdGenerator;
  pictureRepository: FakePictureRepository;
  pictureIdGenerator: FakeIdGenerator;
  commandDispatcher: FakeDispatcher;
  queryDispatcher: FakeDispatcher;
  notifier: FakeNotifier;
  httpClient: FakeHttpClient;
  dependencies: Dependencies;
  startApocalyptizeCommandHandler: StartApocalyptizeCommandHandler;
  fileStorage: FakeFileStorage;
  jobTask: FakeJobTask;
  constructor(private eventBus: FakeBus = new FakeBus()) {
    this.dateService = new FakeDateService(
      new Date('2011-10-05T14:48:00.000Z'),
    );
    this.jobRepository = new FakeJobRepository();
    this.pictureRepository = new FakePictureRepository();
    this.pictureIdGenerator = new FakeIdGenerator();
    this.commandDispatcher = new FakeDispatcher();
    this.queryDispatcher = new FakeDispatcher();
    this.notifier = new FakeNotifier();
    this.notificationIdGenerator = new FakeIdGenerator();
    this.httpClient = new FakeHttpClient();
    this.fileStorage = new FakeFileStorage();
    this.jobTask = new FakeJobTask();
    this.dependencies = DependenciesFactory.forTest({
      dateService: this.dateService,
      jobRepository: this.jobRepository,
      pictureRepository: this.pictureRepository,
      pictureIdGenerator: this.pictureIdGenerator,
      notifier: this.notifier,
      notificationIdGenerator: this.notificationIdGenerator,
      httpClient: this.httpClient,
      eventBus: this.eventBus,
      fileStorage: this.fileStorage,
      jobTask: this.jobTask,
    });
    this.startApocalyptizeCommandHandler = new StartApocalyptizeCommandHandler(
      this.dependencies,
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
  givenAlreadyStartedJob(jobProperties: {
    id: string;
    by: string;
    input: string;
    name: string;
    startedAt: string;
  }) {
    const job = JobModel.createStartedJob(this.eventBus, {
      id: jobProperties.id,
      by: jobProperties.by,
      name: jobProperties.name,
      inputPictureId: jobProperties.input,
      startedAt: jobProperties.startedAt,
    });
    this.jobRepository.save(job);
  }
  forceJobDoneWith(result: JobTaskResult) {
    return this.jobTask.forceJobDone(result);
  }
  forceJobDoneWithError(result: JobTaskResult, error: Error) {
    const failureFileStorage = new FailureFileStorage(error);
    this.dependencies.fileStorage = failureFileStorage;
    return this.jobTask.forceJobDone(result);
  }
  givenDownloadStreamForUrl(url: string, stream: Stream) {
    this.httpClient.withDownloadStreamForUrl(url, stream);
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
  whenStartingApocalyptizeWithSavingPictureFailure(
    pictureStream: Stream,
    user: string,
    jobId: string,
    error: Error,
  ) {
    const failureFileStorage = new FailureFileStorage(error);
    this.dependencies.fileStorage = failureFileStorage;
    return this.commandDispatcher.dispatch(
      new StartApocalyptizeCommand(pictureStream, user, jobId),
    );
  }
  whenStartingApocalyptizeWithJobFailure(
    pictureStream: Stream,
    user: string,
    jobId: string,
    error: Error,
  ) {
    const failureJobRepository = new FailureJobRepository(error);
    this.dependencies.jobRepository = failureJobRepository;
    return this.commandDispatcher.dispatch(
      new StartApocalyptizeCommand(pictureStream, user, jobId),
    );
  }
  expectLastPictureToEqual(expected: PictureProperties) {
    expect(this.pictureRepository.last().properties).toEqual(expected);
  }
  expectLastSentNotificationToEqual(expected: Notification) {
    expect(this.notifier.last()).toEqual(expected);
  }
  expectLastJobToEqual(expected: JobProperties) {
    expect(this.jobRepository.last().properties).toEqual(expected);
  }
  expectSavedPictureContentAsString(
    expectedPath: string,
    expectedContent: string,
  ) {
    expect(this.fileStorage.writtenFileAsString(expectedPath)).toEqual(
      expectedContent,
    );
  }
}
