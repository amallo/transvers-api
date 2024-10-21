import { Stream } from 'stream';
import { FileStorage } from '../file.storage';

export class FailureFileStorage implements FileStorage {
  constructor(private error: Error) {}
  async writeStream(_input: Stream, _path: string): Promise<void> {
    return Promise.reject(this.error);
  }
}
