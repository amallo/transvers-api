import { PictureRepository } from '../picture.repository';
import { PictureProperties } from 'src/core/models/picture.model';

export class FailurePictureRepository implements PictureRepository {
  constructor(private savingFulure: Error) {}
  save(_: PictureProperties) {
    return Promise.reject(this.savingFulure);
  }
}
