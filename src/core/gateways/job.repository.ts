import {  JobModel } from '../models/job.model';

export interface JobRepository {
  getById(jobId: string): Promise<JobModel | null>;
  save(job: JobModel): Promise<void>;
}
