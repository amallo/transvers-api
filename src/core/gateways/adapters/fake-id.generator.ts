import { IdGenerator } from '../id.generator';

export class FakeIdGenerator implements IdGenerator {
  private ids: string[] = [];

  constructor() {}

  generate(): string {
    return this.ids.shift() || '';
  }

  willGenerate(id: string): void {
    this.ids.push(id);
  }
}
