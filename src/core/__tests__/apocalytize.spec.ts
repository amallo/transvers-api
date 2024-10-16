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
  fixture.expectLastNotificationToEqual({
    type: 'job',
    to: 'audie',
    id: 'notification-id-0',
    jobId: 'job-id-0',
    status: 'running',
    at: '2011-10-05T14:48:00.000Z',
  });
});
