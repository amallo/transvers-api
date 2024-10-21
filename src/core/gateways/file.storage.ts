import { Stream } from 'stream';

export interface FileStorage {
  writeStream(input: Stream, path: string): Promise<void>;
}
