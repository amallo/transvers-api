type JobStatus = "done" | "running"
export interface Job {
    id: string
    userId: string
    status: JobStatus,
    inputImageId: string
}