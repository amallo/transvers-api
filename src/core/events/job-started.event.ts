import { Dependencies } from '../dependencies';
import { Handler } from '../handlers/handler';

export class JobStartedEvent {
  constructor(
    public readonly jobId: string,
    public readonly startedBy: string,
  ) {}
}

export class JobStartedEventHandler implements Handler<JobStartedEvent> {
  constructor(private dependencies: Dependencies) {}

  async handle({ jobId }: JobStartedEvent): Promise<void> {
    const { notifier, dateService, notificationIdGenerator, jobRepository } =
      this.dependencies;
    const willCreateNotificationId = notificationIdGenerator.generate();
    const now = dateService.nowIs();
    const job = await jobRepository.getById(jobId);
    notifier.notify({
      type: 'job',
      to: job.by,
      id: willCreateNotificationId,
      jobId: job.id,
      status: 'running',
      at: now.toISOString(),
    });
  }
}
