import { Stream } from 'stream';

export interface HttpClient {
  downloadAsStream(url: string): Promise<Stream>;
}
