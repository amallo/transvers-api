import {Readable} from 'stream'
import { DateService } from '../services/date.service'
import { JobRepository } from '../services/job.repository'
import { IdGenerator } from '../services/id.generator'
import { PictureRepository } from '../services/picture.repository'
import { PicturePath } from '../services/picture-path'

type Dependencies = {dateService: DateService, jobRepository: JobRepository, jobIdGenerator: IdGenerator, pictureRepository: PictureRepository, pictureIdGenerator: IdGenerator}
export const makeApocalyptize = ({dateService, jobRepository, jobIdGenerator, pictureRepository, pictureIdGenerator} : Dependencies)=>async ({input, forUser} : {input: Readable, forUser: string})=>{
    const willCreateJobId = jobIdGenerator.generate()
    const willSavePictureId = pictureIdGenerator.generate()

    //const picturePath = `${forUser}/pictures/${willSavePictureId}.png`
    const picturePath = new PicturePath({owner: forUser, pictureId: willSavePictureId})
    await pictureRepository.save({id: willSavePictureId, picture: input, owner: forUser, path: picturePath})
    const job = await jobRepository.run({id: willCreateJobId, forUser, inputImageId:  willSavePictureId})
    return Promise.resolve({
        at: dateService.nowIs().toISOString(),
        by: 'audie',
        jobId: job.id
    })
}