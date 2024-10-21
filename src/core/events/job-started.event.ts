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

  async handle({ jobId, startedBy }: JobStartedEvent): Promise<void> {
    const { notifier, dateService, notificationIdGenerator } =
      this.dependencies;
    const willCreateNotificationId = notificationIdGenerator.generate();
    const now = dateService.nowIs();
    notifier.notify({
      type: 'job',
      to: startedBy,
      id: willCreateNotificationId,
      jobId,
      status: 'running',
      at: now.toISOString(),
    });
  }
}
