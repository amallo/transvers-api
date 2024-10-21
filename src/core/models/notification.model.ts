export type Notification =
  | StartJobNotification
  | DoneJobNotification
  | FailureJobNotification
  | AbandonedJobNotification;

type StartJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'running';
  startedAt: string;
};

type DoneJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'done';
  startedAt: string;
  finishedAt: string;
  output: string;
};

type FailureJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'failure';
  startedAt: string;
};

type AbandonedJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'abandoned';
  startedAt: string;
};
