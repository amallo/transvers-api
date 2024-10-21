import { DateProvider } from '../date.provider';

export class FakeDateService implements DateProvider {
  private dates: Date[] = [];

  constructor(now: Date | Date[]) {
    if (now instanceof Date) {
      this.dates.push(now);
    } else {
      this.dates = now;
    }
  }

  nowIs(): Date {
    return this.dates.shift();
  }
}
