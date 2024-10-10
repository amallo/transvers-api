import { FakeIdGenerator } from "../services/adapters/fake-id.generator"
import { FakeJobRepository } from "../services/adapters/fake-job.repository"
import { FakeNotifier } from "../services/adapters/fake-notifier"
import { makeNotify } from "../usecases/notify"

it("has successfully apocalyptised a picture", async ()=>{
    const notifier = new FakeNotifier()
    const jobRepository = new FakeJobRepository()
    const idGenerator = new FakeIdGenerator()
    idGenerator.willGenerate('notification-id-0')
    jobRepository.withJob({id: 'job-id-0', userId: 'audie', status: 'working', identifier: 'job-external-id-0'})
  
    const notify = makeNotify({notifier, jobRepository, idGenerator})
    await notify({
        identifier: 'job-external-id-0',
        status: 'done',
        picture: 'http://masuperiumage.png'
    })
    
    expect(notifier.lastNotification()).toEqual({
        id: 'notification-id-0',
        user: 'audie',
        status: 'done',
        picture: 'http://masuperiumage.png'
    })
})