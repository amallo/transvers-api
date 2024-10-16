export interface Notification {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: string;
  at: string;
}
