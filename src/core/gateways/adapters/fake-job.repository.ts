import { JobModel } from 'src/core/models/job.model';
import { JobRepository } from '../job.repository';

export class FakeJobRepository implements JobRepository {
  private jobs: JobModel[] = [];

  async getById(id: string): Promise<JobModel | null> {
    return Promise.resolve(this.jobs.find((job) => job.id === id));
  }
  save(job: JobModel): Promise<void> {
    this.jobs.push(job);
    return Promise.resolve();
  }
  last() {
    return this.jobs[this.jobs.length - 1];
  }
}
