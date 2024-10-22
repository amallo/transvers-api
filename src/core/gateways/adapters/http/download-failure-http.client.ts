import { Stream } from 'stream';
import { HttpClient } from '../../http.client';


export class DownloadFailureHttpClient implements HttpClient {
  constructor(private error: Error){}

  async downloadAsStream(_url: string): Promise<Stream> {
    return Promise.reject(this.error);
  }
}
