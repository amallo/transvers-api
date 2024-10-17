import { JobProperties, JobModel } from 'src/core/models/job.model';
import { JobRepository } from '../job.repository';
import { PicturePath } from '../../models/picture-path';

export class FakeJobRepository implements JobRepository {
  private jobs: JobModel[] = [];

  async getById(id: string): Promise<JobModel | null> {
    return Promise.resolve(this.jobs.find((job) => job.id === id));
  }


  save(job: JobModel): Promise<void> {
    this.withJob(job);
    return Promise.resolve();
  }

  /**
   * @deprecated
   */
  async finish(jobId: string, outputPath: PicturePath): Promise<void> {
    const job = await this.getById(jobId);
    //job.status = 'done';
    //job.output = outputPath.pictureId();
    return Promise.resolve();
  }

  /**
   * @deprecated
   */
  async fail(jobId: string, error: Error): Promise<void> {
    const job = await this.getById(jobId);
   // job.status = 'failure';
   // job.error = error.message;
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
