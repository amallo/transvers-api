import { Job } from 'src/core/models/job.model';
import { JobRepository } from '../job.repository';

export class FakeJobRepository implements JobRepository {
  private jobs: Job[] = [];

  async getBy(id: string): Promise<Job | null> {
    return this.jobs.find((job) => job.id === id);
  }

  run({
    by,
    name,
    id,
  }: {
    id: string;
    by: string;
    name: string;
  }): Promise<Job> {
    const job: Job = {
      id,
      by,
      status: 'running',
      name,
    };
    this.withJob(job);
    return Promise.resolve(job);
  }

  withJob(job: Job) {
    this.jobs.push(job);
  }

  last() {
    return this.jobs[this.jobs.length - 1];
  }
  all() {
    return this.jobs
  }
}
