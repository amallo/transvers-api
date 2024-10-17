
import { PictureProperties } from '../models/picture.model';

export interface PictureRepository {
  save(picture: PictureProperties): Promise<void>;
}
