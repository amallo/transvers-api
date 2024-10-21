import { JobModel } from '../models/job.model';

export type JobTaskResult = {
  outputUrl: string;
  jobId: string;
};

export type JobTaskFailureResult = {
  error: Error;
  jobId: string;
};

export interface JobTask {
  run(job: JobModel): Promise<void>;
  registerDoneHander(
    jobId: string,
    handler: (result: JobTaskResult) => void,
  ): void;
}
