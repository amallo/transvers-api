import { Job } from "../models/job.model";

export interface JobRepository {
    getBy(identifier: string): Promise<Job | null>
    run({forUser, inputImageId} : {id: string, forUser: string, inputImageId: string}): Promise<Job>
}