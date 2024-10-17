import { Stream } from 'stream';
import { ApocalytizeFixture } from './apocalyptize.fixture';

let fixture: ApocalytizeFixture;
beforeEach(() => {
  fixture = new ApocalytizeFixture();
});
it('prepare to apocalyptize a picture', async () => {
  fixture.givenNewPictureId('input-image-0');
  fixture.givenNewNotificationId('notification-id-0');
  await fixture.whenStartingApocalyptizePicture(
    new Stream.Readable(),
    'audie',
    'job-id-0',
  );
  fixture.expectLastPictureToEqual({
    id: 'input-image-0',
    owner: 'audie',
    path: 'audie/pictures/input-image-0.png',
  });
  fixture.expectLastJobToEqual({
    id: 'job-id-0',
    by: 'audie',
    input: 'input-image-0',
    name: 'apocalyptize',
    status: 'running',
  });
  fixture.expectLastSentNotificationToEqual({
    type: 'job',
    to: 'audie',
    id: 'notification-id-0',
    jobId: 'job-id-0',
    status: 'running',
    at: '2011-10-05T14:48:00.000Z',
  });
});

it('successfully finish to apocalyptize a picture', async () => {
  fixture.givenNewPictureId('output-image-0');
  fixture.givenNewNotificationId('notification-id-1');
  fixture.givenJob({
    id: 'job-id-0',
    by: 'audie',
    input: 'input-image-0',
    name: 'apocalyptize',
    status: 'running',
  });
  await fixture.whenFinishingApocalyptizePicture({
    jobId: 'job-id-0',
    output: 'external/picture.png',
  });
  fixture.expectLastPictureToEqual({
    id: 'output-image-0',
    owner: 'audie',
    path: 'audie/pictures/output-image-0.png',
  });
  fixture.expectLastJobToEqual({
    id: 'job-id-0',
    by: 'audie',
    input: 'input-image-0',
    output: 'output-image-0',
    name: 'apocalyptize',
    status: 'done',
  });
  fixture.expectLastSentNotificationToEqual({
    type: 'job',
    to: 'audie',
    id: 'notification-id-1',
    jobId: 'job-id-0',
    status: 'done',
    at: '2011-10-05T14:48:00.000Z',
    output: 'audie/pictures/output-image-0.png',
  });
});
