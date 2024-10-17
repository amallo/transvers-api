import { Readable } from 'stream';
import { PicturePath } from '../models/picture-path';

export interface FileDownloader {
  download(url: string, atPath: PicturePath): Promise<Readable>;
}
