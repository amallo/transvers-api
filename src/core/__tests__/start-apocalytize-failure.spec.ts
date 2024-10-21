import { Stream } from 'stream';
import { ApocalytizeFixture } from './apocalyptize.fixture';

let fixture: ApocalytizeFixture;
beforeEach(() => {
  fixture = new ApocalytizeFixture();
});
it('abandon job when fail to start', async () => {
  fixture.givenNewPictureId('input-image-0');
  fixture.givenNewNotificationId('notification-id-0');
  const inputPictureStream = new Stream.Readable();
  inputPictureStream.push('Content of the picture');
  inputPictureStream.push(null);
  await fixture.whenStartingApocalyptizeWithJobFailure(
    inputPictureStream,
    'audie',
    'job-id-0',
    new Error('Failed to save the picture'),
  );
  fixture.expectLastSentNotificationToEqual({
    type: 'job',
    to: 'audie',
    id: 'notification-id-0',
    jobId: 'job-id-0',
    status: 'abandoned',
    startedAt: '2011-10-05T14:48:00.000Z',
  });
});

it('fails to done job', async () => {
  const inputPictureStream = new Stream.Readable();
  inputPictureStream.push('Content of input the picture');
  inputPictureStream.push(null);

  const outputPictureStream = new Stream.Readable();
  outputPictureStream.push('Content of the output picture');
  outputPictureStream.push(null);

  fixture.givenNewPictureId('input-image-0');
  fixture.givenNewPictureId('output-image-0');
  fixture.givenNewNotificationId('notification-id-0');
  fixture.givenDownloadStreamForUrl(
    'http://external/picture.png',
    outputPictureStream,
  );

  await fixture.whenStartingApocalyptizePicture(
    inputPictureStream,
    'audie',
    'job-id-0',
  );
  await fixture.forceJobDoneWithError(
    {
      jobId: 'job-id-0',
      outputUrl: 'http://external/picture.png',
    },
    new Error('Failed to finish job'),
  );
  fixture.expectLastSentNotificationToEqual({
    type: 'job',
    to: 'audie',
    id: 'notification-id-0',
    jobId: 'job-id-0',
    status: 'failure',
    startedAt: '2011-10-05T14:48:00.000Z',
  });
});
