import { FakeFileDownloader } from "../services/adapters/fake-file.downloader"
import { FakeIdGenerator } from "../services/adapters/fake-id.generator"
import { FakeJobRepository } from "../services/adapters/fake-job.repository"
import { FakeNotifier } from "../services/adapters/fake-notifier"
import { FakePictureRepository } from "../services/adapters/fake-picture.repository"
import { finish } from "../usecases/finish"

it("has successfully apocalyptised a picture", async ()=>{
    const notifier = new FakeNotifier()
    const jobRepository = new FakeJobRepository()
    const notificationIdGenerator = new FakeIdGenerator()
    const pictureIdGenerator = new FakeIdGenerator()
    const fileDownloader = new FakeFileDownloader()
    const pictureRepository = new FakePictureRepository()
    notificationIdGenerator.willGenerate('notification-id-0')
    jobRepository.withJob({id: 'job-id-0', userId: 'audie', status: 'running', inputImageId: 'input-image-0'})
  
    pictureIdGenerator.willGenerate('output-image-0')
    const notify = finish({notifier, jobRepository, notificationIdGenerator, pictureRepository, fileDownloader, pictureIdGenerator})
    await notify({
        id: 'job-id-0',
        status: 'done',
        outputUrl: 'http://masuperiumage.png'
    })
    
    expect(notifier.lastNotification()).toEqual({
        id: 'notification-id-0',
        user: 'audie',
        status: 'done',
        outputId: 'output-image-0'
    })
    expect(fileDownloader.lastDownloadedUrl()).toEqual('http://masuperiumage.png')
    expect(pictureRepository.lastPicture()).toEqual({
        id: 'output-image-0',
        owner: 'audie',
        path: 'audie/pictures/output-image-0.png'      
    })
})