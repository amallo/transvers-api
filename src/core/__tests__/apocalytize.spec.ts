import { FakeDateService } from "../services/adapters/fake-date.service"
import { FakeIdGenerator } from "../services/adapters/fake-id.generator"
import { FakeJobRepository } from "../services/adapters/fake-job.repository"
import { FakePictureRepository } from "../services/adapters/fake-picture.repository"
import { makeApocalyptize } from "../usecases/apocalyptize"
import {Stream} from 'stream'


let dateService: FakeDateService
let jobRepository: FakeJobRepository
let jobIdGenerator : FakeIdGenerator
let pictureRepository: FakePictureRepository
let pictureIdGenerator: FakeIdGenerator
beforeEach(()=>{
    dateService = new FakeDateService(new Date("2011-10-05T14:48:00.000Z"))
    jobRepository = new FakeJobRepository()
    jobIdGenerator = new FakeIdGenerator()
    pictureRepository = new FakePictureRepository()
    pictureIdGenerator = new FakeIdGenerator()
})
it("prepare to apocalyptize a picture", async ()=>{

    jobIdGenerator.willGenerate('job-id-0')
    pictureIdGenerator.willGenerate('input-image-0')
    const apocalyptize = makeApocalyptize({dateService, jobRepository, jobIdGenerator, pictureRepository, pictureIdGenerator})
    const inputPictureStream = new Stream.Readable()
    const request = await apocalyptize({
        input: inputPictureStream,
        forUser: 'audie'
    })
    expect(request).toEqual({
        at: '2011-10-05T14:48:00.000Z',
        by: 'audie',
        jobId: 'job-id-0'
    })
    expect(jobRepository.lastJob()).toEqual({
        id: 'job-id-0',
        userId: 'audie',
        status: 'running',
        inputImageId: 'input-image-0'
    })
    expect(pictureRepository.lastPicture()).toEqual({
        id: 'input-image-0',
        owner: 'audie',
        path: 'audie/pictures/input-image-0.png'      
    })
    
})
