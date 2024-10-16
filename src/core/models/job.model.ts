type JobStatus = 'done' | 'running';
export interface Job {
  id: string;
  by: string;
  status: JobStatus;
  name: string;
}
