import { Dependencies } from '../dependencies';
import { Handler } from '../handlers/handler';

export class JobFailedEvent {
  constructor(
    public readonly jobId: string,
    public readonly failedBy: string,
  ) {}
}

export class JobFailedEventHandler implements Handler<JobFailedEvent> {
  constructor(private dependencies: Dependencies) {}

  async handle({ jobId, failedBy }: JobFailedEvent): Promise<void> {
    const { notifier, dateService, notificationIdGenerator } =
      this.dependencies;
    const willCreateNotificationId = notificationIdGenerator.generate();
    const now = dateService.nowIs();
    notifier.notify({
      type: 'job',
      to: failedBy,
      id: willCreateNotificationId,
      jobId: jobId,
      status: 'failure',
      at: now.toISOString(),
    });
  }
}
