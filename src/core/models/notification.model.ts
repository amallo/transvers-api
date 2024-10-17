export type Notification =
  | StartJobNotification
  | DoneJobNotification
  | FailureJobNotification;

type StartJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'running';
  at: string;
};

type DoneJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'done';
  at: string;
  output: string;
};

type FailureJobNotification = {
  id: string;
  type: 'job';
  to: string;
  jobId: string;
  status: 'failure';
  at: string;
};
