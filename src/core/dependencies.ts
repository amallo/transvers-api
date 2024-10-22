import { FakeBus } from './events/adapters/fake.bus';
import { Bus } from './events/bus';
import { FakeConfigGateway } from './gateways/adapters/fake-config.gateway';
import { FakeDateService } from './gateways/adapters/fake-date.service';
import { FakeFileStorage } from './gateways/adapters/fake-file.storage';
import { FakeHttpClient } from './gateways/adapters/fake-http.client';
import { FakeIdGenerator } from './gateways/adapters/fake-id.generator';
import { FakeJobRepository } from './gateways/adapters/fake-job.repository';
import { FakeJobTask } from './gateways/adapters/fake-job.task';
import { FakeNotifier } from './gateways/adapters/fake-notifier';
import { FakePictureRepository } from './gateways/adapters/fake-picture.repository';
import { ConfigGateway } from './gateways/config.gateway';
import { DateProvider } from './gateways/date.provider';
import { FileStorage } from './gateways/file.storage';
import { HttpClient } from './gateways/http.client';
import { IdGenerator } from './gateways/id.generator';
import { JobRepository } from './gateways/job.repository';
import { JobTask } from './gateways/job.task';
import { Notifier } from './gateways/notifier';
import { PictureRepository } from './gateways/picture.repository';

export type Dependencies = {
  dateService: DateProvider;
  jobRepository: JobRepository;
  pictureRepository: PictureRepository;
  pictureIdGenerator: IdGenerator;
  jobIdGenerator: IdGenerator;
  notifier: Notifier;
  notificationIdGenerator: IdGenerator;
  httpClient: HttpClient;
  eventBus: Bus;
  fileStorage: FileStorage;
  jobTask: JobTask;
  config: ConfigGateway;
};

const defaultTestDependencies: Dependencies = {
  dateService: new FakeDateService(new Date('2011-10-05T14:48:00.000Z')),
  jobRepository: new FakeJobRepository(),
  pictureRepository: new FakePictureRepository(),
  pictureIdGenerator: new FakeIdGenerator(),
  notifier: new FakeNotifier(),
  notificationIdGenerator: new FakeIdGenerator(),
  jobIdGenerator : new FakeIdGenerator(),
  httpClient: new FakeHttpClient(),
  eventBus: new FakeBus(),
  fileStorage: new FakeFileStorage(),
  jobTask: new FakeJobTask(),
  config: new FakeConfigGateway(),
};

export class DependenciesFactory {
  static build(
    deps: Partial<Dependencies> = defaultTestDependencies,
  ): Dependencies {
    return {
      ...defaultTestDependencies,
      ...deps,
    };
  }
}
