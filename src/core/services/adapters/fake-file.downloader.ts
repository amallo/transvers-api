import { Readable, Stream } from "stream";
import { FileDownloader } from "../file.downloader";
import { PicturePath } from "../picture-path";

async function * generate() {
    yield 'hello';
    yield 'streams';
  }

export class FakeFileDownloader implements FileDownloader{
    private lastUrl: string = ""
    private downloadedFileContentAsString: string = ""
    download(_url: string, atPath: PicturePath): Promise<Readable> {
        this.lastUrl = _url
        const readableStream = Readable.from(generate());
        readableStream.push(this.downloadedFileContentAsString)
        return Promise.resolve(readableStream)
    }

    willDownloadFileWithString(content: string) {
        this.downloadedFileContentAsString = content
    }
    lastDownloadedUrl() {
        return this.lastUrl
    }
}