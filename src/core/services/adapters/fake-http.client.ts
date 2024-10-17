import { Readable, Stream } from 'stream';
import { HttpClient } from '../http.client';

async function* generateFileContent() {
  yield 'THIS-IS-A-FAKE-FILE';
}

export class FakeHttpClient implements HttpClient {
  private streams: Map<string, Stream> = new Map();

  withDownloadStreamForUrl(url: string, stream: Stream) {
    this.streams.set(url, stream);
  }

  async downloadAsStream(_url: string): Promise<Stream> {
    const readableStream = Readable.from(generateFileContent());
    return Promise.resolve(readableStream);
  }
}
