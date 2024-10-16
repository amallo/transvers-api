import { FakeDispatcher } from '../dispatchers/adapters/fake.dispatcher';
import { FakeDateService } from '../services/adapters/fake-date.service';
import { FakeIdGenerator } from '../services/adapters/fake-id.generator';
import { FakeJobRepository } from '../services/adapters/fake-job.repository';
import { FakeNotifier } from '../services/adapters/fake-notifier';
import { FakePictureRepository } from '../services/adapters/fake-picture.repository';
import {
  ApocalyptizeCommand,
  ApocalyptizeCommandHandler,
} from '../usecases/apocalyptize';
import { Picture } from '../models/picture.model';
import { Notification } from '../models/notification.model';

export class ApocalytizeFixture {
  dateService: FakeDateService;
  jobRepository: FakeJobRepository;
  jobIdGenerator: FakeIdGenerator;
  notificationIdGenerator: FakeIdGenerator;
  pictureRepository: FakePictureRepository;
  pictureIdGenerator: FakeIdGenerator;
  commandDispatcher: FakeDispatcher;
  notifier: FakeNotifier;
  constructor() {
    this.dateService = new FakeDateService(
      new Date('2011-10-05T14:48:00.000Z'),
    );
    this.jobRepository = new FakeJobRepository();
    this.jobIdGenerator = new FakeIdGenerator();
    this.pictureRepository = new FakePictureRepository();
    this.pictureIdGenerator = new FakeIdGenerator();
    this.commandDispatcher = new FakeDispatcher();
    this.notifier = new FakeNotifier();
    this.notificationIdGenerator = new FakeIdGenerator();
    new ApocalyptizeCommandHandler(this.commandDispatcher, {
      notificationIdGenerator: this.notificationIdGenerator,
      notifier: this.notifier,
      dateService: this.dateService,
      jobRepository: this.jobRepository,
      jobIdGenerator: this.jobIdGenerator,
      pictureRepository: this.pictureRepository,
      pictureIdGenerator: this.pictureIdGenerator,
    });
  }
  givenNewJobId(id: string) {
    this.jobIdGenerator.willGenerate(id);
  }
  givenNewPictureId(id: string) {
    this.pictureIdGenerator.willGenerate(id);
  }
  givenNewNotificationId(id: string) {
    this.notificationIdGenerator.willGenerate(id);
  }
  whenApocalyptizePicture(pictureStream: any, user: string) {
    return this.commandDispatcher.dispatch(
      new ApocalyptizeCommand(pictureStream, user),
    );
  }
  expectLastPictureToEqual(expected: Picture) {
    expect(this.pictureRepository.last()).toEqual(expected);
  }
  expectLastNotificationToEqual(expected: Notification) {
    expect(this.notifier.last()).toEqual(expected);
  }
}
