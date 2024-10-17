import { EndJobWithFailure, EndJobWithSuccess, Job } from 'src/core/models/job.model';
import { JobRepository } from '../job.repository';
import { PicturePath } from '../picture-path';

export class FakeJobRepository implements JobRepository {
  private jobs: Job[] = [];

  async getById(id: string): Promise<Job | null> {
    return Promise.resolve(this.jobs.find((job) => job.id === id));
  }

  run({
    by,
    name,
    id,
    input,
  }: {
    id: string;
    by: string;
    name: string;
    input: string;
  }): Promise<Job> {
    const job: Job = {
      id,
      by,
      status: 'running',
      name,
      input,
    };
    this.withJob(job);
    return Promise.resolve(job);
  }

  async finish(jobId: string, outputPath: PicturePath): Promise<void> {
    const job = (await this.getById(jobId)) as EndJobWithSuccess;
    job.status = 'done';
    job.output = outputPath.pictureId();
    return Promise.resolve();
  }
  async fail(jobId: string, error: Error): Promise<void> {
    const job = (await this.getById(jobId)) as EndJobWithFailure;
    job.status = 'failure';
    job.error = error.message;
  }

  withJob(job: Job) {
    this.jobs.push(job);
  }

  last() {
    return this.jobs[this.jobs.length - 1];
  }
  all() {
    return this.jobs;
  }
}
