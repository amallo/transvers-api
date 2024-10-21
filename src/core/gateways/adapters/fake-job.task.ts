import { JobModel } from 'src/core/models/job.model';
import { JobTask, JobTaskResult } from '../job.task';

export type CompletedJobCallback = (jobId: string, outputUrl: string) => void;
export class FakeJobTask implements JobTask {
  doneHandlers: Map<string, (result: JobTaskResult) => void> = new Map();
  async run(_: JobModel): Promise<void> {
    return Promise.resolve();
  }
  registerDoneHander(
    jobId: string,
    handler: (result: JobTaskResult) => void,
  ): void {
    this.doneHandlers.set(jobId, handler);
  }
  forceJobDone(result: JobTaskResult) {
    if (this.doneHandlers.has(result.jobId)) {
      return this.doneHandlers.get(result.jobId)(result);
    }
  }
}
