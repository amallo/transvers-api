import { PictureRepository } from '../picture.repository';
import { PictureModel } from 'src/core/models/picture.model';

export class FakePictureRepository implements PictureRepository {
  private pictures: PictureModel[] = [];
  save(picture: PictureModel) {
    this.pictures.push(picture);
    return Promise.resolve();
  }
  last() {
    return this.pictures[this.pictures.length - 1];
  }
}
