import { JobRepository } from '../job.repository';
import { JobModel } from 'src/core/models/job.model';

export class FailureJobRepository implements JobRepository {
  constructor(private error: Error) {}
  async getById(_id: string): Promise<JobModel | null> {
    return Promise.resolve(null);
  }

  save(_job: JobModel): Promise<void> {
    return Promise.reject(this.error);
  }

}
