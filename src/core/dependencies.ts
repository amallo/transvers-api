import { FakeDispatcher } from './dispatchers/adapters/fake.dispatcher';
import { Dispatcher } from './dispatchers/dispatcher';
import { FakeDateService } from './services/adapters/fake-date.service';
import { FakeHttpClient } from './services/adapters/fake-http.client';
import { FakeIdGenerator } from './services/adapters/fake-id.generator';
import { FakeJobRepository } from './services/adapters/fake-job.repository';
import { FakeNotifier } from './services/adapters/fake-notifier';
import { FakePictureRepository } from './services/adapters/fake-picture.repository';
import { DateService } from './services/date.service';
import { HttpClient } from './services/http.client';
import { IdGenerator } from './services/id.generator';
import { JobRepository } from './services/job.repository';
import { Notifier } from './services/notifier';
import { PictureRepository } from './services/picture.repository';

export type Dependencies = {
  dateService: DateService;
  jobRepository: JobRepository;
  pictureRepository: PictureRepository;
  pictureIdGenerator: IdGenerator;
  notifier: Notifier;
  notificationIdGenerator: IdGenerator;
  httpClient: HttpClient;
  commandDispatcher: Dispatcher;
};

const defaultTestDependencies: Dependencies = {
  dateService: new FakeDateService(new Date('2011-10-05T14:48:00.000Z')),
  jobRepository: new FakeJobRepository(),
  pictureRepository: new FakePictureRepository(),
  pictureIdGenerator: new FakeIdGenerator(),
  notifier: new FakeNotifier(),
  notificationIdGenerator: new FakeIdGenerator(),
  httpClient: new FakeHttpClient(),
  commandDispatcher: new FakeDispatcher(),
};
export class DependenciesFactory {
  static forTest(
    deps: Partial<Dependencies> = defaultTestDependencies,
  ): Dependencies {
    return {
      dateService: new FakeDateService(new Date('2011-10-05T14:48:00.000Z')),
      jobRepository: new FakeJobRepository(),
      pictureRepository: new FakePictureRepository(),
      pictureIdGenerator: new FakeIdGenerator(),
      notifier: new FakeNotifier(),
      notificationIdGenerator: new FakeIdGenerator(),
      httpClient: new FakeHttpClient(),
      commandDispatcher: new FakeDispatcher(),
      ...deps,
    };
  }
}

export const dependencies = () => {
  return {
    test: (deps: Partial<Dependencies>): Dependencies => ({
      dateService: new FakeDateService(new Date('2011-10-05T14:48:00.000Z')),
      jobRepository: new FakeJobRepository(),
      notificationIdGenerator: new FakeIdGenerator(),
      pictureRepository: new FakePictureRepository(),
      pictureIdGenerator: new FakeIdGenerator(),
      commandDispatcher: new FakeDispatcher(),
      notifier: new FakeNotifier(),
      httpClient: new FakeHttpClient(),
      ...deps,
    }),
  };
};
