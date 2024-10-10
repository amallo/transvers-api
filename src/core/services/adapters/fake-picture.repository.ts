import { Readable } from "stream";
import { PictureRepository } from "../picture.repository";
import { Picture } from "src/core/models/picture.model";

export class FakePictureRepository implements PictureRepository{
    private pictures: Picture[] = []
    save(params: { id: string; picture: Readable; owner: string; path: string}) {
        const picture : Picture = { 
            id: params.id,
            owner: params.owner,
            path: params.path
        }
        this.pictures.push(picture)
        return Promise.resolve()
    }
    lastPicture() {
        return this.pictures[this.pictures.length - 1]
    }
    
}