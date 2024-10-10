import { IdGenerator } from "../id.generator";

export class FakeIdGenerator implements IdGenerator {
    private currentId: string;

    constructor() {}

    generate(): string {
        return this.currentId;
    }

    willGenerate(id: string): void {
        this.currentId = id;
    }

}