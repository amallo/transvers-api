import { Stream } from 'stream';
import { FileStorage } from '../../file.storage';

export class FakeFileStorage implements FileStorage {
  private storage: Map<string, Buffer> = new Map();

  async writeStream(input: Stream, path: string): Promise<void> {
    const chunks: Buffer[] = [];

    return new Promise<void>((resolve, reject) => {
      input.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      input.on('end', () => {
        const data = Buffer.concat(chunks);
        this.storage.set(path, data);
        resolve();
      });

      input.on('error', (err) => {
        reject(err);
      });
    });
  }

  writtenFileAsString(path: string): string | undefined {
    const data = this.storage.get(path);
    if (data) {
      return data.toString('utf-8');
    }
    return undefined;
  }
}
