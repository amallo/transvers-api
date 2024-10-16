import { Job } from '../models/job.model';

export interface JobRepository {
  getBy(identifier: string): Promise<Job | null>;
  run({ by, name }: { id: string; by: string; name: string }): Promise<Job>;
}
