
export type Job = StartJob | EndJob;
type StartJob = {
  id: string;
  by: string;
  status: 'running';
  name: string;
  input: string;
};

export type EndJob = {
  id: string;
  by: string;
  status: 'done';
  name: string;
  input: string;
  output: string;
};
