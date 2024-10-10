import { Job } from "src/core/models/job.model";
import { JobRepository } from "../job.repository";

export class FakeJobRepository implements  JobRepository{
    private jobs: Job[] = []

    async getByIdentifier(identifier: string): Promise<Job | null> {
        return this.jobs.find(job => job.identifier === identifier)
    }

    withJob(job: Job) {
        this.jobs.push(job)
    }
}