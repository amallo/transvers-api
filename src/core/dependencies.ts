import { FakeDispatcher } from './dispatchers/adapters/fake.dispatcher';
import { Dispatcher } from './dispatchers/dispatcher';
import { FakeBus } from './events/adapters/fake.bus';
import { Bus } from './events/bus';
import { FakeDateService } from './gateways/adapters/fake-date.service';
import { FakeHttpClient } from './gateways/adapters/fake-http.client';
import { FakeIdGenerator } from './gateways/adapters/fake-id.generator';
import { FakeJobRepository } from './gateways/adapters/fake-job.repository';
import { FakeNotifier } from './gateways/adapters/fake-notifier';
import { FakePictureRepository } from './gateways/adapters/fake-picture.repository';
import { DateService } from './gateways/date.service';
import { HttpClient } from './gateways/http.client';
import { IdGenerator } from './gateways/id.generator';
import { JobRepository } from './gateways/job.repository';
import { Notifier } from './gateways/notifier';
import { PictureRepository } from './gateways/picture.repository';

export type Dependencies = {
  dateService: DateService;
  jobRepository: JobRepository;
  pictureRepository: PictureRepository;
  pictureIdGenerator: IdGenerator;
  notifier: Notifier;
  notificationIdGenerator: IdGenerator;
  httpClient: HttpClient;
  eventBus: Bus;
};

const defaultTestDependencies: Dependencies = {
  dateService: new FakeDateService(new Date('2011-10-05T14:48:00.000Z')),
  jobRepository: new FakeJobRepository(),
  pictureRepository: new FakePictureRepository(),
  pictureIdGenerator: new FakeIdGenerator(),
  notifier: new FakeNotifier(),
  notificationIdGenerator: new FakeIdGenerator(),
  httpClient: new FakeHttpClient(),
  eventBus: new FakeBus(),
};
export class DependenciesFactory {
  static forTest(
    deps: Partial<Dependencies> = defaultTestDependencies,
  ): Dependencies {
    return {
      ...defaultTestDependencies,
      ...deps,
    };
  }
}
