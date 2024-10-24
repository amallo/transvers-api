import { FakeDispatcher } from '../dispatchers/adapters/fake.dispatcher';
import { FakeDateService } from '../gateways/adapters/config/fake-date.service';
import { FakeIdGenerator } from '../gateways/adapters/id/fake-id.generator';
import { FakeJobRepository } from '../gateways/adapters/job-repository/fake-job.repository';
import { FakeNotifier } from '../gateways/adapters/notifier/fake-notifier';
import { FakePictureRepository } from '../gateways/adapters/picture-repository/fake-picture.repository';
import { PictureProperties } from '../models/picture.model';
import { Notification } from '../models/notification.model';
import { Stream } from 'stream';
import { JobModel, JobProperties } from '../models/job.model';
import { FakeHttpClient } from '../gateways/adapters/http/fake-http.client';
import { Dependencies, DependenciesFactory } from '../dependencies';
import { FakeBus } from '../events/adapters/fake.bus';
import { FakeFileStorage } from '../gateways/adapters/file-storage/fake-file.storage';
import { FailureFileStorage } from '../gateways/adapters/file-storage/failure-file.storage';
import { FailureJobRepository } from '../gateways/adapters/job-repository/failure-job.repository';
import { FakeJobTask } from '../gateways/adapters/job-task/fake-job.task';
import { JobTaskResult } from '../gateways/job.task';
import { FakeConfigGateway } from '../gateways/adapters/config/fake-config.gateway';
import { ApocalyptizeService } from '../services/apocalytize.service';

export class ApocalytizeFixture {
  dateService: FakeDateService;
  jobRepository: FakeJobRepository;
  notificationIdGenerator: FakeIdGenerator;
  pictureRepository: FakePictureRepository;
  pictureIdGenerator: FakeIdGenerator;
  jobIdGenerator: FakeIdGenerator;
  commandDispatcher: FakeDispatcher;
  queryDispatcher: FakeDispatcher;
  notifier: FakeNotifier;
  httpClient: FakeHttpClient;
  dependencies: Dependencies;
  apocalyptizeService: ApocalyptizeService;
  fileStorage: FakeFileStorage;
  jobTask: FakeJobTask;
  configGateway: FakeConfigGateway;
  constructor(private eventBus: FakeBus = new FakeBus()) {
    this.dateService = new FakeDateService([
      new Date('2011-10-05T14:48:00.000Z'),
      new Date('2011-10-05T14:48:01.000Z'),
    ]);
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
    this.configGateway = new FakeConfigGateway();
    this.jobIdGenerator = new FakeIdGenerator();
    this.dependencies = DependenciesFactory.build({
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
      config: this.configGateway,
      jobIdGenerator: this.jobIdGenerator,
    });
    this.apocalyptizeService = new ApocalyptizeService(this.dependencies);
  }
  givenNewPictureId(id: string) {
    this.pictureIdGenerator.willGenerate(id);
  }
  givenNewNotificationId(id: string) {
    this.notificationIdGenerator.willGenerate(id);
  }
  givenNewJobId(id: string) {
    this.jobIdGenerator.willGenerate(id);
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
  givenConfig({ filesUrl }: { filesUrl: string }) {
    this.configGateway.withConfig({ filesUrl });
  }
  async forceJobDoneWith(result: JobTaskResult) {
    return this.jobTask.forceJobDone(result);
  }
  async forceJobDoneWithError(result: JobTaskResult, error: Error) {
    const failureFileStorage = new FailureFileStorage(error);
    this.dependencies.fileStorage = failureFileStorage;
    return this.jobTask.forceJobDone(result);
  }
  givenDownloadStreamForUrl(url: string, stream: Stream) {
    this.httpClient.withDownloadStreamForUrl(url, stream);
  }
  whenStartingApocalyptizePicture(pictureStream: Stream, user: string) {
    return this.apocalyptizeService.start({
      by: user,
      inputStream: pictureStream,
    });
  }
  whenStartingApocalyptizeWithSavingPictureFailure(
    pictureStream: Stream,
    user: string,
    error: Error,
  ) {
    const failureFileStorage = new FailureFileStorage(error);
    this.dependencies.fileStorage = failureFileStorage;
    return this.apocalyptizeService.start({
      by: user,
      inputStream: pictureStream,
    });
  }
  whenStartingApocalyptizeWithJobFailure(
    pictureStream: Stream,
    user: string,
    error: Error,
  ) {
    const failureJobRepository = new FailureJobRepository(error);
    this.dependencies.jobRepository = failureJobRepository;
    return this.apocalyptizeService.start({
      by: user,
      inputStream: pictureStream,
    });
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
