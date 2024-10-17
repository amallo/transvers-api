export type Job = StartJob | EndJobWithSuccess | EndJobWithFailure;
type StartJob = {
  id: string;
  by: string;
  status: 'running';
  name: string;
  input: string;
};

export type EndJobWithSuccess = {
  id: string;
  by: string;
  status: 'done';
  name: string;
  input: string;
  output: string;
};

export type EndJobWithFailure = {
  id: string;
  by: string;
  status: 'failure';
  name: string;
  input: string;
  error: string;
};
