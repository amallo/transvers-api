import { Job } from '../models/job.model';
import { PicturePath } from './picture-path';

export interface JobRepository {
  getById(jobId: string): Promise<Job | null>;
  run({
    by,
    name,
    input,
  }: {
    id: string;
    by: string;
    name: string;
    input: string;
  }): Promise<Job>;
  finish(jobId: string, outputPath: PicturePath): Promise<void>;
}
