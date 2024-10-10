import { Job } from "src/core/models/job.model";
import { JobRepository } from "../job.repository";

export class FakeJobRepository implements  JobRepository{
    private jobs: Job[] = []

    async getBy(id: string): Promise<Job | null> {
        return this.jobs.find(job => job.id === id)
    }

    run({ forUser, inputImageId, id }: { id: string, forUser: string; inputImageId: string; }): Promise<Job> {
        const job: Job = {
            id,
            userId: forUser,
            status: 'running',
            inputImageId
        }
        this.withJob(job)
        return Promise.resolve(job)
    }

    withJob(job: Job) {
        this.jobs.push(job)
    }

    lastJob() {
        return this.jobs[this.jobs.length - 1]
    }
}