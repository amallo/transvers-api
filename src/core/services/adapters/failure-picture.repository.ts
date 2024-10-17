import { Readable } from 'stream';
import { PictureRepository } from '../picture.repository';
import { PicturePath } from '../picture-path';

export class FailurePictureRepository implements PictureRepository {
  constructor(private savingFulure: Error) {}
  save(_: { id: string; picture: Readable; owner: string; path: PicturePath }) {
    return Promise.reject(this.savingFulure);
  }
}
