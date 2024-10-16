import {  Stream } from 'stream';
import { PicturePath } from './picture-path';

type SaveParams = {
  id: string;
  picture: Stream;
  owner: string;
  path: PicturePath;
};
export interface PictureRepository {
  save(params: SaveParams): Promise<void>;
}
