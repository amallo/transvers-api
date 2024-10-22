
import { PictureProperties } from 'src/core/models/picture.model';
import { PictureRepository } from '../../picture.repository';

export class FailurePictureRepository implements PictureRepository {
  constructor(private savingFulure: Error) {}
  save(_: PictureProperties) {
    return Promise.reject(this.savingFulure);
  }
}
