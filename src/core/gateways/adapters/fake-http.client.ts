import {  Stream } from 'stream';
import { HttpClient } from '../http.client';

export class FakeHttpClient implements HttpClient {
  private streams: Map<string, Stream> = new Map();

  withDownloadStreamForUrl(url: string, stream: Stream) {
    this.streams.set(url, stream);
  }

  async downloadAsStream(_url: string): Promise<Stream> {
    const readableStream = this.streams.get(_url);
    return Promise.resolve(readableStream);
  }
}
