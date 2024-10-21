import { JobModel } from 'src/core/models/job.model';
import { JobRepository } from '../job.repository';

export class FakeJobRepository implements JobRepository {
  private jobs: JobModel[] = [];
  private onDone: ((jobId: string, outputPicturePath: string) => void) | null =
    null;

  async getById(id: string): Promise<JobModel | null> {
    return Promise.resolve(this.jobs.find((job) => job.id === id));
  }

  setOnDone(onDone: (jobId: string, outputPicturePath: string) => void) {
    this.onDone = onDone;
  }

  complete(jobId: string, outputPicturePath: string) {
    if (this.onDone) {
      this.onDone(jobId, outputPicturePath);
    }
  }
  save(job: JobModel): Promise<void> {
    this.jobs.push(job);
    return Promise.resolve();
  }
  withJob(job: JobModel) {
    this.jobs.push(job);
  }

  last() {
    return this.jobs[this.jobs.length - 1];
  }
  all() {
    return this.jobs;
  }
}
