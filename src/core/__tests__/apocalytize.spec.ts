import { FakeDateService } from "../services/adapters/fake-date.service"
import { FakeNotifier } from "../services/adapters/fake-notifier"
import { makeApocalyptize } from "../usecases/apocalyptize"
import {Stream} from 'stream'


let dateService: FakeDateService
beforeEach(()=>{
    dateService = new FakeDateService(new Date("2011-10-05T14:48:00.000Z"))
})
it("prepare to apocalyptize a picture", async ()=>{
    const notifier = new FakeNotifier()

    const apocalyptize = makeApocalyptize({dateService})
    const inputPictureStream = new Stream.Readable()
    const job = await apocalyptize({
        input: inputPictureStream,
    })
    expect(job).toEqual({
        at: '2011-10-05T14:48:00.000Z',
        by: 'audie',
        id: 'job-id-0'
    })
})
