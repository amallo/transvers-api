import { Stream } from 'stream';

export class StartApocalyptizeCommand {
  constructor(
    public readonly inputStream: Stream,
    public readonly by: string,
  ) {}
}
