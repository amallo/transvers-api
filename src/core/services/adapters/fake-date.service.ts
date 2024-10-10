import { DateService } from "../date.service";

export class FakeDateService implements DateService {
    private currentDate: Date;

    constructor(private now: Date) {
    }

    nowIs(): Date {
        return this.now;
    }

}