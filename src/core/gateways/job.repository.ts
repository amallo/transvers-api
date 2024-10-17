import { JobProperties, JobModel } from '../models/job.model';
import { PicturePath } from '../models/picture-path';

export interface JobRepository {
  getById(jobId: string): Promise<JobModel | null>;
  save(job: JobProperties): Promise<void>;
  finish(jobId: string, outputPath: PicturePath): Promise<void>;
  fail(jobId: string, error: Error): Promise<void>;
}
