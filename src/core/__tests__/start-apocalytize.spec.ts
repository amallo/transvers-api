import { Stream } from 'stream';
import { ApocalytizeFixture } from './apocalyptize.fixture';
import { PictureModel } from '../models/picture.model';

let fixture: ApocalytizeFixture;
beforeEach(() => {
  fixture = new ApocalytizeFixture();
});
it('start to apocalyptize a picture', async () => {
  fixture.givenNewPictureId('input-image-0');
  fixture.givenNewNotificationId('notification-id-0');

  const inputPictureStream = new Stream.Readable();
  inputPictureStream.push('Content of the picture');
  inputPictureStream.push(null);
  await fixture.whenStartingApocalyptizePicture(
    inputPictureStream,
    'audie',
    'job-id-0',
  );
  const inputPictureModel = new PictureModel('input-image-0', 'audie');
  fixture.expectSavedPictureContentAsString(
    inputPictureModel.path,
    'Content of the picture',
  );
  fixture.expectLastJobToEqual({
    id: 'job-id-0',
    by: 'audie',
    name: 'apocalyptize',
    status: 'running',
    inputPicture: inputPictureModel,
    startedAt: '2011-10-05T14:48:00.000Z',
  });
});

it('finishes to apocalyptize a picture', async () => {
  const inputPictureStream = new Stream.Readable();
  inputPictureStream.push('Content of input the picture');
  inputPictureStream.push(null);
  const inputPictureModel = new PictureModel('input-image-0', 'audie');

  const outputPictureStream = new Stream.Readable();
  outputPictureStream.push('Content of the output picture');
  outputPictureStream.push(null);
  const ouputPictureModel = new PictureModel('output-image-0', 'audie');

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
  await fixture.forceJobDoneWith({
    jobId: 'job-id-0',
    outputUrl: 'http://external/picture.png',
  });

  fixture.expectSavedPictureContentAsString(
    ouputPictureModel.path,
    'Content of the output picture',
  );
  fixture.expectLastJobToEqual({
    id: 'job-id-0',
    by: 'audie',
    name: 'apocalyptize',
    status: 'done',
    inputPicture: inputPictureModel,
    outputPicture: ouputPictureModel,
    startedAt: '2011-10-05T14:48:00.000Z',
  });
});