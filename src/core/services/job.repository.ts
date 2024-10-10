import { Job } from "../models/job.model";

export interface JobRepository {
    getByIdentifier(identifier: string): Promise<Job | null>
}