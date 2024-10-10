import { FakeDateService } from "../services/adapters/fake-date.service"
import { FakeNotifier } from "../services/adapters/fake-notifier"
import { makeApocalyptise } from "../usecases/apocalyptise"
import {Stream} from 'stream'


let dateService: FakeDateService
beforeEach(()=>{
    dateService = new FakeDateService(new Date("2011-10-05T14:48:00.000Z"))
})
it("prepare to apocalyptise a picture", async ()=>{
    const notifier = new FakeNotifier()

    const apocalyptise = makeApocalyptise({dateService})
    const inputPictureStream = new Stream.Readable()
    const job = await apocalyptise({
        input: inputPictureStream,
    })
    expect(job).toEqual({
        at: '2011-10-05T14:48:00.000Z',
        by: 'audie',
        id: 'job-id-0'
    })
})
