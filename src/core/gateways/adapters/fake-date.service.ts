import { DateProvider } from "../date.provider";

export class FakeDateService implements DateProvider {
    private currentDate: Date;

    constructor(private now: Date) {
    }

    nowIs(): Date {
        return this.now;
    }

}